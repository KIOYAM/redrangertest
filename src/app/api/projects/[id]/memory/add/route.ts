import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { addProjectMemory } from '@/lib/project-memory'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { role, content, toolName } = await request.json()

        if (!role || !content) {
            return NextResponse.json({ error: 'Role and content are required' }, { status: 400 })
        }

        if (role !== 'user' && role !== 'ai') {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
        }

        const memoryId = await addProjectMemory(params.id, role, content, toolName)

        return NextResponse.json({ id: memoryId })
    } catch (error: any) {
        console.error('Add memory error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
