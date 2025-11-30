import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { project_id, tool_name, step_id, question, answer } = body

        // Validation
        if (!project_id || !tool_name || !step_id || !question || answer === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: project_id, tool_name, step_id, question, answer' },
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

        // Save wizard response
        const { data, error } = await supabase
            .from('wizard_responses')
            .insert({
                project_id,
                tool_name,
                step_id,
                question,
                answer
            })
            .select()
            .single()

        if (error) {
            console.error('Error saving wizard response:', error)
            return NextResponse.json({ error: 'Failed to save response' }, { status: 500 })
        }

        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error: any) {
        console.error('Wizard save error:', error)
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

        if (!project_id) {
            return NextResponse.json({ error: 'project_id is required' }, { status: 400 })
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

        // Get all wizard responses for this project
        const { data, error } = await supabase
            .from('wizard_responses')
            .select('*')
            .eq('project_id', project_id)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching wizard responses:', error)
            return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 })
        }

        return NextResponse.json({ success: true, data }, { status: 200 })
    } catch (error: any) {
        console.error('Wizard fetch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
