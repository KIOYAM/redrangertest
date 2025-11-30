import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { buildIdePrompt, buildChatPrompt, type DeveloperPromptInput } from '@/lib/tools/developer/developer-prompt-engine'
import { getProjectMemory, addProjectMemory } from '@/lib/project-memory'

/**
 * POST /api/tools/developer/generate
 * 
 * Generates optimized prompts for developer AI tools.
 * - Authenticates user with Supabase
 * - Checks can_use_ai permission
 * - Returns both IDE and Chat prompts
 * 
 * Required field: description
 * Optional fields: mode, stack, outputFormat, executionContext, fileNaming, language
 */
export async function POST(request: Request) {
    // ============================================
    // 1. AUTHENTICATION
    // ============================================
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ============================================
    // 2. AUTHORIZATION (RBAC)
    // ============================================
    const { data: profile } = await supabase
        .from('profiles')
        .select('can_use_ai')
        .eq('id', user.id)
        .single()

    if (!profile?.can_use_ai) {
        return NextResponse.json({ error: 'Forbidden: AI access required' }, { status: 403 })
    }

    // ============================================
    // 3. PARSE AND VALIDATE INPUT
    // ============================================
    const {
        description,
        mode,
        stack,
        outputFormat,
        executionContext,
        fileNaming,
        language,
        projectId,
        toolName
    } = await request.json()

    // Only description is required
    if (!description || !description.trim()) {
        return NextResponse.json({ error: 'Problem description is required' }, { status: 400 })
    }

    // ============================================
    // 3.5. CHECK AND DEDUCT MORPHIN ENERGY CREDITS
    // ============================================
    const { data: creditCheckData, error: creditError } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: 10, // Developer tool costs 10 Morphin Energy
        p_tool_name: 'developer_tool',
        p_reason: 'Developer prompt generation'
    })

    if (creditError || !creditCheckData?.success) {
        return NextResponse.json({
            error: 'Insufficient Morphin Energy',
            details: 'You need 10 Morphin Energy to use the Developer Tool. Please recharge!',
            required: 10,
            balance: creditCheckData?.balance || 0
        }, { status: 402 }) // 402 Payment Required
    }

    // ============================================
    // 4. HANDLE PROJECT MEMORY (if projectId provided)
    // ============================================
    let contextFromMemory = ''

    if (projectId && toolName) {
        try {
            // Fetch last 10 messages for context
            const memory = await getProjectMemory(projectId, {
                toolName: toolName || 'developer',
                limit: 10
            })

            if (memory.length > 0) {
                contextFromMemory = '\n\nPrevious context from this project:\n' +
                    memory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')
            }
        } catch (error) {
            console.error('Failed to fetch project memory:', error)
            // Continue without context rather than failing
        }
    }

    // ============================================
    // 5. BUILD DEVELOPER PROMPTS
    // ============================================
    try {
        // Build the developer prompt input - only description is required
        const promptInput: DeveloperPromptInput = {
            description: description + contextFromMemory,
            ...(mode && { mode }),
            ...(stack && stack.length > 0 && { stack }),
            ...(outputFormat && { outputFormat }),
            ...(executionContext && { executionContext }),
            ...(fileNaming !== undefined && { fileNaming }),
            ...(language && { language }),
        }

        // Generate both prompts
        const idePrompt = buildIdePrompt(promptInput)
        const chatPrompt = buildChatPrompt(promptInput)

        // ============================================
        // 6. SAVE TO PROJECT MEMORY (if projectId provided)
        // ============================================
        if (projectId && toolName) {
            try {
                // Save user description
                await addProjectMemory(projectId, 'user', description, toolName)
                // Save AI response (both prompts as JSON)
                const aiResponse = JSON.stringify({ idePrompt, chatPrompt }, null, 2)
                await addProjectMemory(projectId, 'ai', aiResponse, toolName)
            } catch (error) {
                console.error('Failed to save to project memory:', error)
                // Don't fail the request if memory save fails
            }
        }

        return NextResponse.json({
            idePrompt,
            chatPrompt
        })

    } catch (error: any) {
        console.error('=== DEVELOPER PROMPT BUILD ERROR ===')
        console.error('Error Message:', error.message)
        console.error('Stack:', error.stack)
        console.error('====================================')

        return NextResponse.json({
            error: 'Failed to generate developer prompts',
            details: error.message,
        }, { status: 500 })
    }
}
