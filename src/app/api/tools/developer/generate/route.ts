import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { buildIdePrompt, buildChatPrompt, type DeveloperPromptInput } from '@/lib/tools/developer/developer-prompt-engine'

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
        language
    } = await request.json()

    // Only description is required
    if (!description || !description.trim()) {
        return NextResponse.json({ error: 'Problem description is required' }, { status: 400 })
    }

    // ============================================
    // 4. BUILD DEVELOPER PROMPTS
    // ============================================
    try {
        // Build the developer prompt input - only description is required
        const promptInput: DeveloperPromptInput = {
            description,
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
