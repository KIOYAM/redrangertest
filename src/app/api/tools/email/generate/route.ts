import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildEmailPrompt } from '@/lib/tools/email/email-prompt-engine'
import type { EmailContext } from '@/lib/tools/email/email-types'
import { getProjectMemory, addProjectMemory } from '@/lib/project-memory'

// Initialize AI providers
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

// Get AI provider from environment (default to gemini)
const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase()

/**
 * POST /api/tools/email/generate
 * 
 * Generates a high-quality email writing meta-prompt using AI.
 * - Authenticates user with Supabase
 * - Checks can_use_ai permission
 * - Uses fault-tolerant prompt builder
 * - Supports OpenAI and Gemini providers
 * 
 * Required field: story
 * Optional fields: to, fromName, receiverType, subjectHint, tone, length, language
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
        to,
        fromName,
        receiverType,
        subjectHint,
        story,
        tone,
        length,
        language,
        projectId,
        toolName
    } = await request.json()

    // Only story is required - all other fields are optional
    if (!story) {
        return NextResponse.json({ error: 'Story/Purpose is required' }, { status: 400 })
    }

    // ============================================
    // 4. HANDLE PROJECT MEMORY (if projectId provided)
    // ============================================
    let contextFromMemory = ''

    if (projectId && toolName) {
        try {
            // Fetch last 10 messages for context
            const memory = await getProjectMemory(projectId, {
                toolName: toolName || 'email',
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
    // 5. BUILD FAULT-TOLERANT PROMPT
    // ============================================
    try {
        // Build the email context - only story is required
        const emailContext: EmailContext = {
            story: story + contextFromMemory,
            ...(to && { to }),
            ...(fromName && { fromName }),
            ...(receiverType && { receiverType }),
            ...(subjectHint && { subjectHint }),
            ...(tone && { tone }),
            ...(length && { length }),
            ...(language && { language }),
        }

        // Use the enhanced prompt builder with smart defaults
        const metaPrompt = buildEmailPrompt(emailContext)

        // ============================================
        // 6. CALL AI PROVIDER
        // ============================================
        let prompt: string | null = null

        if (AI_PROVIDER === 'openai') {
            // OpenAI implementation
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'user', content: metaPrompt },
                ],
                temperature: 0.7,
            })
            prompt = completion.choices[0].message.content
        } else {
            // Gemini implementation (default) - Using stable free-tier model
            const model = gemini.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                },
            })

            const result = await model.generateContent(metaPrompt)

            // Check if response was blocked
            if (!result.response || !result.response.text) {
                throw new Error('Gemini response was blocked or empty. Check content filters.')
            }

            prompt = result.response.text()
        }

        // ============================================
        // 7. SAVE TO PROJECT MEMORY (if projectId provided)
        // ============================================
        if (projectId && toolName && prompt) {
            try {
                // Save user prompt
                await addProjectMemory(projectId, 'user', story, toolName)
                // Save AI response
                await addProjectMemory(projectId, 'ai', prompt, toolName)
            } catch (error) {
                console.error('Failed to save to project memory:', error)
                // Don't fail the request if memory save fails
            }
        }

        return NextResponse.json({ prompt })
    } catch (error: any) {
        console.error('=== AI ERROR DEBUG ===')
        console.error('Provider:', AI_PROVIDER)
        console.error('Error Type:', error.constructor.name)
        console.error('Error Message:', error.message)
        console.error('Full Error:', JSON.stringify(error, null, 2))
        console.error('Stack:', error.stack)
        console.error('======================')

        return NextResponse.json({
            error: `Failed to generate prompt using ${AI_PROVIDER.toUpperCase()}`,
            details: error.message,
            type: error.constructor.name
        }, { status: 500 })
    }
}
