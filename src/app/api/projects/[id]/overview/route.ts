import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getProjectToolStats, getProjectStats, getProjectMemory } from '@/lib/project-memory'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    try {
        // Verify user owns this project
        const { data: project } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single()

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Get tool statistics
        const toolStats = await getProjectToolStats(projectId)

        // Get project stats
        const projectStats = await getProjectStats(projectId)

        // Get all memory for timeline (last 50 entries)
        const timeline = await getProjectMemory(projectId, { limit: 50 })

        return NextResponse.json({
            project,
            toolStats,
            projectStats,
            timeline
        })
    } catch (error: any) {
        console.error('Error fetching project overview:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
