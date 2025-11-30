import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            project_id,
            tool_name,
            task_description,
            status,
            ai_tool_used,
            feedback,
            error_details,
            success_metrics
        } = body

        // Validation
        if (!project_id || !tool_name || !task_description || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: project_id, tool_name, task_description, status' },
                { status: 400 }
            )
        }

        // Validate status
        const validStatuses = ['success', 'partial', 'failed', 'error']
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be one of: success, partial, failed, error' },
                { status: 400 }
            )
        }

        // Verify project belongs to user
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('id')
            .eq('id', project_id)
            .eq('user_id', user.id)
            .single()

        if (projectError || !project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Save task outcome
        const { data, error } = await supabase
            .from('task_outcomes')
            .insert({
                project_id,
                tool_name,
                task_description,
                status,
                ai_tool_used,
                feedback,
                error_details,
                success_metrics
            })
            .select()
            .single()

        if (error) {
            console.error('Error saving task outcome:', error)
            return NextResponse.json({ error: 'Failed to save outcome' }, { status: 500 })
        }

        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error: any) {
        console.error('Outcome save error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const project_id = searchParams.get('project_id')
        const tool_name = searchParams.get('tool_name')

        if (!project_id) {
            return NextResponse.json({ error: 'project_id is required' }, { status: 400 })
        }

        // Build query
        let query = supabase
            .from('task_outcomes')
            .select('*')
            .eq('project_id', project_id)
            .order('created_at', { ascending: false })

        if (tool_name) {
            query = query.eq('tool_name', tool_name)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching outcomes:', error)
            return NextResponse.json({ error: 'Failed to fetch outcomes' }, { status: 500 })
        }

        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error: any) {
        console.error('Outcome fetch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
