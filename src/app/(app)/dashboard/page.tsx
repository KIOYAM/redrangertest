import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './dashboard-client'

export default async function HomePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null // Layout handles redirect
    }

    const { data: groups, error } = await supabase
        .from('ranger_groups')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true })

    if (error) {
        console.error('Failed to fetch groups:', error)
    }

    // Fetch calculated energy (handles passive recharge)
    const { data: energyData, error: energyError } = await supabase
        .rpc('calculate_current_energy', { user_uuid: user.id })

    if (energyError) {
        console.error('Failed to fetch energy:', energyError)
    }

    // Transform to match expected prop format or pass directly
    // The RPC returns { current_balance, max_capacity }
    const userCredits = {
        balance: energyData?.current_balance ?? 0,
        max_capacity: energyData?.max_capacity ?? 100,
        // We might need to fetch total_earned/spent separately if not in RPC
        // For now, let's fetch the raw row too for totals, or update RPC to return them.
        // Let's fetch raw row for totals and merge.
    }

    const { data: rawCredits } = await supabase
        .from('user_credits')
        .select('total_earned, total_spent')
        .eq('user_id', user.id)
        .single()

    const finalCredits = {
        ...userCredits,
        total_earned: rawCredits?.total_earned ?? 0,
        total_spent: rawCredits?.total_spent ?? 0
    }

    // Fetch recent activity
    const { data: recentActivity } = await supabase
        .from('credit_usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    // Fetch total prompts generated
    const { count: totalPrompts } = await supabase
        .from('credit_usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    return <DashboardClient
        groups={groups || []}
        userCredits={finalCredits}
        recentActivity={recentActivity || []}
        totalPrompts={totalPrompts || 0}
    />
}
