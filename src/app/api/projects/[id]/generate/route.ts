import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getProjectMemory, addProjectMemory, buildContextPrompt } from '@/lib/project-memory'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')
const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase()

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('can_use_ai')
        .eq('id', user.id)
        .single()

    if (!profile?.can_use_ai) {
        return NextResponse.json({ error: 'AI access required' }, { status: 403 })
    }

    try {
        const { prompt, toolName } = await request.json()

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // Fetch project memory
        const memory = await getProjectMemory(params.id, 10)

        // Build context with memory
        const contextPrompt = buildContextPrompt(memory, prompt, toolName)

        // Save user prompt to memory
        await addProjectMemory(params.id, 'user', prompt, toolName)

        // Generate AI response
        let aiResponse: string | null = null

        if (AI_PROVIDER === 'openai') {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: contextPrompt }],
                temperature: 0.7
            })
            aiResponse = completion.choices[0].message.content
        } else {
            const model = gemini.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048
                }
            })

            const result = await model.generateContent(contextPrompt)

            if (!result.response || !result.response.text) {
                throw new Error('AI response blocked or empty')
            }

            aiResponse = result.response.text()
        }

        if (!aiResponse) {
            throw new Error('No AI response generated')
        }

        // Save AI response to memory
        const memoryId = await addProjectMemory(params.id, 'ai', aiResponse, toolName)

        return NextResponse.json({ response: aiResponse, memoryId })

    } catch (error: any) {
        console.error('Generate error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
