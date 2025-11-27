import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createProject } from '@/lib/project-memory'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { title, description } = await request.json()

        if (!title || !title.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        const project = await createProject(title.trim(), description?.trim())

        return NextResponse.json({ project })
    } catch (error: any) {
        console.error('Create project error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
