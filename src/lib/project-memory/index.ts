import { createClient } from '@/lib/supabase/server'
import type { Project, MemoryEntry } from '@/types/project'

/**
 * Get all projects for the authenticated user
 * @param toolName - Optional tool name to filter projects by specific tool
 */
export async function getUserProjects(toolName?: string): Promise<Project[]> {
    const supabase = await createClient()

    let query = supabase
        .from('projects')
        .select('*')

    // Filter by tool if specified
    if (toolName) {
        query = query.eq('tool_name', toolName)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Create a new project
 */
export async function createProject(title: string, toolName: string, description?: string): Promise<Project> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            title,
            tool_name: toolName,
            description
        })
        .select()
        .single()

    if (error) {
        // Check if it's a unique constraint violation
        if (error.code === '23505') {
            throw new Error(`A project named "${title}" already exists for this tool`)
        }
        throw error
    }
    return data
}

/**
 * Get a specific project by ID
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (error) return null
    return data
}

/**
 * Update a project
 */
export async function updateProject(
    projectId: string,
    updates: { title?: string; description?: string }
): Promise<Project> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

    if (error) throw error
}

/**
 * Get project memory (conversation history)
 * @param projectId - The project ID
 * @param options - Optional filters: toolName to filter by specific tool, limit for max entries
 */
export async function getProjectMemory(
    projectId: string,
    options?: { toolName?: string; limit?: number }
): Promise<MemoryEntry[]> {
    const supabase = await createClient()
    const limit = options?.limit ?? 10

    let query = supabase
        .from('project_memory')
        .select('*')
        .eq('project_id', projectId)

    // Filter by tool if specified
    if (options?.toolName) {
        query = query.eq('tool_name', options.toolName)
    }

    const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw error

    // Reverse to get chronological order
    return (data || []).reverse()
}

/**
 * Add a memory entry to a project
 */
export async function addProjectMemory(
    projectId: string,
    role: 'user' | 'ai',
    content: string,
    toolName?: string
): Promise<string> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('project_memory')
        .insert({
            project_id: projectId,
            role,
            content,
            tool_name: toolName
        })
        .select('id')
        .single()

    if (error) throw error
    return data.id
}

/**
 * Clear all memory for a project
 */
export async function clearProjectMemory(projectId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('project_memory')
        .delete()
        .eq('project_id', projectId)

    if (error) throw error
}

/**
 * Build AI context prompt from memory
 */
export function buildContextPrompt(
    memory: MemoryEntry[],
    userPrompt: string,
    toolName?: string
): string {
    const systemInstructions: Record<string, string> = {
        email: 'You are an expert email writer. Use the conversation history to maintain context and consistency in email communication.',
        developer: 'You are a senior software engineer. Remember previous discussions, code snippets, and technical decisions from this project.',
        default: 'You are a helpful AI assistant. Use the conversation history to provide contextually relevant responses.'
    }

    const system = systemInstructions[toolName || 'default'] || systemInstructions.default

    const previousConversation = memory.length > 0
        ? memory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
        : 'No previous conversation.'

    return `SYSTEM: ${system}

PREVIOUS CONVERSATION:
${previousConversation}

NEW USER REQUEST:
USER: ${userPrompt}

Respond based on the full context above. Maintain consistency with previous messages in this project.`
}

/**
 * Get project statistics
 */
export async function getProjectStats(projectId: string): Promise<{ messageCount: number; lastActivity: string | null }> {
    const supabase = await createClient()

    const { count } = await supabase
        .from('project_memory')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)

    const { data: latestMessage } = await supabase
        .from('project_memory')
        .select('created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    return {
        messageCount: count || 0,
        lastActivity: latestMessage?.created_at || null
    }
}

/**
 * Get tool-specific statistics for a project
 * Returns usage stats (count, last used) for each tool used in the project
 */
export async function getProjectToolStats(
    projectId: string
): Promise<Array<{ toolName: string; count: number; lastUsed: string }>> {
    const supabase = await createClient()

    // Get all memory entries for this project
    const { data: memories, error } = await supabase
        .from('project_memory')
        .select('tool_name, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

    if (error) throw error
    if (!memories || memories.length === 0) return []

    // Group by tool_name and calculate stats
    const toolStatsMap = new Map<string, { count: number; lastUsed: string }>()

    for (const memory of memories) {
        const toolName = memory.tool_name || 'unknown'
        const existing = toolStatsMap.get(toolName)

        if (existing) {
            existing.count++
            // Keep the latest timestamp
            if (new Date(memory.created_at) > new Date(existing.lastUsed)) {
                existing.lastUsed = memory.created_at
            }
        } else {
            toolStatsMap.set(toolName, {
                count: 1,
                lastUsed: memory.created_at
            })
        }
    }

    // Convert map to array and sort by last used (most recent first)
    return Array.from(toolStatsMap.entries())
        .map(([toolName, stats]) => ({
            toolName,
            count: stats.count,
            lastUsed: stats.lastUsed
        }))
        .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
}

