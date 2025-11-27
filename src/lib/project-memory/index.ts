import { createClient } from '@/lib/supabase/server'
import type { Project, MemoryEntry } from '@/types/project'

/**
 * Get all projects for the authenticated user
 */
export async function getUserProjects(): Promise<Project[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Create a new project
 */
export async function createProject(title: string, description?: string): Promise<Project> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            title,
            description
        })
        .select()
        .single()

    if (error) throw error
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
 */
export async function getProjectMemory(
    projectId: string,
    limit: number = 10
): Promise<MemoryEntry[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('project_memory')
        .select('*')
        .eq('project_id', projectId)
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
