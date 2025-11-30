import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Admin API - Grant credits to users
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // TODO: Check if user is admin (you can add a is_admin column or check email)
        // For now, allowing any authenticated user (change this in production)

        const body = await request.json()
        const { target_user_id, amount, reason } = body

        // Validation
        if (!target_user_id || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields: target_user_id, amount' },
                { status: 400 }
            )
        }

        if (amount <= 0) {
            return NextResponse.json(
                { error: 'Amount must be positive' },
                { status: 400 }
            )
        }

        // Grant credits using helper function
        const { data, error } = await supabase.rpc('add_credits', {
            p_user_id: target_user_id,
            p_amount: amount,
            p_type: 'grant',
            p_reason: reason || `Admin grant by ${user.email}`,
            p_admin_id: user.id
        })

        if (error) {
            console.error('Error granting credits:', error)
            return NextResponse.json({ error: 'Failed to grant credits' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            balance: data.balance,
            granted: data.added
        }, { status: 200 })
    } catch (error: any) {
        console.error('Grant credits error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Get all users with credit info (Admin only)
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch all user credits with user email
        const { data, error } = await supabase
            .from('user_credits')
            .select(`
        *,
        user:auth.users(email)
      `)
            .order('balance', { ascending: false })

        if (error) {
            console.error('Error fetching user credits:', error)
            return NextResponse.json({ error: 'Failed to fetch user credits' }, { status: 500 })
        }

        return NextResponse.json({ success: true, users: data }, { status: 200 })
    } catch (error: any) {
        console.error('Fetch users error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
