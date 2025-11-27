import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/lib/project-memory'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const project = await getProjectById(params.id)

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json({ project })
    } catch (error: any) {
        console.error('Get project error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const updates = await request.json()
        const project = await updateProject(params.id, updates)

        return NextResponse.json({ project })
    } catch (error: any) {
        console.error('Update project error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await deleteProject(params.id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Delete project error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
