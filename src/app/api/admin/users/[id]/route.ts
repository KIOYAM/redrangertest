import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Super Admin - NEVER allow modification or deletion
const SUPER_ADMIN_EMAIL = 'kannansin784yg0@gmail.com'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    // Get user stats
    const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id)

    return NextResponse.json({
        profile,
        stats: {
            projectCount: projectCount || 0,
        },
    })
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if requester is admin
    const { data: requesterProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (requesterProfile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    try {
        // Check if target user is super admin
        const { data: targetProfile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', id)
            .single()

        if (targetProfile?.email === SUPER_ADMIN_EMAIL) {
            return NextResponse.json(
                { error: 'Cannot delete super admin account' },
                { status: 403 }
            )
        }

        // Prevent self-deletion
        if (id === user.id) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            )
        }

        // Hard delete user from auth.users using admin client
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)

        if (authError) {
            console.error('Auth delete error:', authError)
            return NextResponse.json({ error: authError.message }, { status: 500 })
        }

        // Profile, projects, and memory cascade delete automatically via foreign key constraints

        return NextResponse.json({ success: true, message: 'User permanently deleted' })
    } catch (error: any) {
        console.error('Hard delete error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if requester is admin
    const { data: requesterProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (requesterProfile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        const updates = await request.json()

        // Check if target user is super admin
        const { data: targetProfile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', id)
            .single()

        if (targetProfile?.email === SUPER_ADMIN_EMAIL && updates.role && updates.role !== 'admin') {
            return NextResponse.json(
                { error: 'Cannot modify super admin role' },
                { status: 403 }
            )
        }

        // Prevent changing own admin status
        if (id === user.id && updates.role && updates.role !== 'admin') {
            return NextResponse.json(
                { error: 'Cannot remove your own admin role' },
                { status: 400 }
            )
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ profile })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
