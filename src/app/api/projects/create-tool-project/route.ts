import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createProject } from '@/lib/project-memory'

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { title, description, toolName } = await req.json()

        // Validate required fields
        if (!title || !title.trim()) {
            return NextResponse.json(
                { error: 'Project title is required' },
                { status: 400 }
            )
        }

        if (!toolName || !toolName.trim()) {
            return NextResponse.json(
                { error: 'Tool name is required' },
                { status: 400 }
            )
        }

        // Create the project
        const project = await createProject(title.trim(), toolName.trim(), description?.trim())

        return NextResponse.json({ project }, { status: 201 })
    } catch (error: any) {
        console.error('Create tool project error:', error)

        // Return specific error for duplicate names
        if (error.message.includes('already exists')) {
            return NextResponse.json(
                { error: error.message },
                { status: 409 } // Conflict
            )
        }

        return NextResponse.json(
            { error: error.message || 'Failed to create project' },
            { status: 500 }
        )
    }
}
