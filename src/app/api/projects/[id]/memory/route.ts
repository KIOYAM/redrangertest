import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getProjectMemory, clearProjectMemory } from '@/lib/project-memory'

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
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '10')

        const memory = await getProjectMemory(params.id, limit)

        return NextResponse.json({ memory })
    } catch (error: any) {
        console.error('Get memory error:', error)
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
        await clearProjectMemory(params.id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Clear memory error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
