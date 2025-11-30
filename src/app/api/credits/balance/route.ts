import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get credit stats using helper function
        const { data, error } = await supabase.rpc('get_credit_stats', {
            p_user_id: user.id
        })

        if (error) {
            console.error('Error fetching credit stats:', error)
            return NextResponse.json({ error: 'Failed to fetch credit balance' }, { status: 500 })
        }

        return NextResponse.json({ success: true, stats: data }, { status: 200 })
    } catch (error: any) {
        console.error('Credit balance error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
