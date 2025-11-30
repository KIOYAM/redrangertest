import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserProjects } from '@/lib/project-memory'

export async function GET(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get optional toolName from query parameters
        const { searchParams } = new URL(req.url)
        const toolName = searchParams.get('toolName') || undefined

        const projects = await getUserProjects(toolName)
        return NextResponse.json({ projects })
    } catch (error: any) {
        console.error('List projects error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
