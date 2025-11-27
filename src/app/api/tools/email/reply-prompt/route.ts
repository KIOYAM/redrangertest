import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { buildReplyMetaPrompt, type EmailReplyPromptInput } from '@/lib/tools/email/email-reply-engine'

/**
 * POST /api/tools/email/reply-prompt
 * 
 * Stage 1: Generates a meta-prompt for email reply generation.
 * - Authenticates user with Supabase
 * - Checks can_use_ai permission
 * - Builds structured reply meta-prompt
 * 
 * Required field: receivedEmail
 * Optional fields: userRole, formality, replyIntent, extraNotes, language
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
        receivedEmail,
        userRole,
        formality,
        replyIntent,
        extraNotes,
        language
    } = await request.json()

    // Only receivedEmail is required
    if (!receivedEmail || !receivedEmail.trim()) {
        return NextResponse.json({ error: 'Received email content is required' }, { status: 400 })
    }

    // ============================================
    // 4. BUILD REPLY META-PROMPT
    // ============================================
    try {
        // Build the reply prompt input - only receivedEmail is required
        const replyInput: EmailReplyPromptInput = {
            receivedEmail,
            ...(userRole && { userRole }),
            ...(formality && { formality }),
            ...(replyIntent && { replyIntent }),
            ...(extraNotes && { extraNotes }),
            ...(language && { language }),
        }

        // Generate the meta-prompt using the helper function
        const prompt = buildReplyMetaPrompt(replyInput)

        return NextResponse.json({ prompt })

    } catch (error: any) {
        console.error('=== REPLY PROMPT BUILD ERROR ===')
        console.error('Error Message:', error.message)
        console.error('Stack:', error.stack)
        console.error('================================')

        return NextResponse.json({
            error: 'Failed to generate reply prompt',
            details: error.message,
        }, { status: 500 })
    }
}
