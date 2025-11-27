import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getUserProjects } from '@/lib/project-memory'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const projects = await getUserProjects()
        return NextResponse.json({ projects })
    } catch (error: any) {
        console.error('List projects error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
