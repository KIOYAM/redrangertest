import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('can_use_ai')
        .eq('id', user.id)
        .single()

    if (!profile?.can_use_ai) {
        return NextResponse.json({ error: 'Forbidden: AI access required' }, { status: 403 })
    }

    const { task, language, tone, format } = await request.json()

    if (!task) {
        return NextResponse.json({ error: 'Task is required' }, { status: 400 })
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert prompt engineer. Create a high-quality prompt based on the user's request.
          Language: ${language}
          Tone: ${tone}
          Format: ${format}`,
                },
                {
                    role: 'user',
                    content: task,
                },
            ],
        })

        const prompt = completion.choices[0].message.content

        return NextResponse.json({ prompt })
    } catch (error: any) {
        console.error('OpenAI Error:', error)
        return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 })
    }
}
