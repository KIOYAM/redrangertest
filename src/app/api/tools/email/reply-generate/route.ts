import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize AI providers
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

// Get AI provider from environment (default to gemini)
const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase()

/**
 * POST /api/tools/email/reply-generate
 * 
 * Stage 2: Generates actual email reply from meta-prompt.
 * - Authenticates user with Supabase
 * - Checks can_use_ai permission
 * - Uses meta-prompt to generate final email via AI
 * - Supports both OpenAI and Gemini providers
 * 
 * Required field: prompt
 * Optional field: language
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
    const { prompt, language } = await request.json()

    if (!prompt || !prompt.trim()) {
        return NextResponse.json({ error: 'Meta-prompt is required' }, { status: 400 })
    }

    // ============================================
    // 4. GENERATE EMAIL REPLY WITH AI
    // ============================================
    try {
        let emailText: string | null = null

        if (AI_PROVIDER === 'openai') {
            // OpenAI implementation
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert email writer. Use the following instructions to write a reply email. Output only the final email (subject + body) with no meta-commentary or explanations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    },
                ],
                temperature: 0.7,
            })
            emailText = completion.choices[0].message.content
        } else {
            // Gemini implementation (default)
            const model = gemini.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
                systemInstruction: 'You are an expert email writer. Use the following instructions to write a reply email. Output only the final email (subject + body) with no meta-commentary or explanations.',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                },
            })

            const result = await model.generateContent(prompt)

            // Check if response was blocked
            if (!result.response || !result.response.text) {
                throw new Error('AI response was blocked or empty. Please try again with different content.')
            }

            emailText = result.response.text()
        }

        if (!emailText) {
            throw new Error('AI did not return a valid response')
        }

        return NextResponse.json({ emailText })

    } catch (error: any) {
        console.error('=== EMAIL REPLY GENERATION ERROR ===')
        console.error('Provider:', AI_PROVIDER)
        console.error('Error Type:', error.constructor.name)
        console.error('Error Message:', error.message)
        console.error('====================================')

        return NextResponse.json({
            error: `Failed to generate email reply using ${AI_PROVIDER.toUpperCase()}`,
            details: error.message,
        }, { status: 500 })
    }
}
