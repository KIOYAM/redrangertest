import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url)
    const userType = searchParams.get('user_type')
    const isActive = searchParams.get('is_active')
    const role = searchParams.get('role')

    let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (userType) query = query.eq('user_type', userType)
    if (isActive !== null) query = query.eq('is_active', isActive === 'true')
    if (role) query = query.eq('role', role)

    const { data: users, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users })
}
