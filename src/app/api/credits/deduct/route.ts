import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CREDIT_COSTS, type ToolName } from '@/types/credits'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { tool_name, reason } = body

        // Validation
        if (!tool_name || !CREDIT_COSTS[tool_name as ToolName]) {
            return NextResponse.json(
                { error: 'Invalid tool name' },
                { status: 400 }
            )
        }

        const credits_to_deduct = CREDIT_COSTS[tool_name as ToolName]

        // Deduct credits using helper function
        const { data, error } = await supabase.rpc('deduct_credits', {
            p_user_id: user.id,
            p_amount: credits_to_deduct,
            p_tool_name: tool_name,
            p_reason: reason || `Used ${tool_name}`
        })

        if (error) {
            console.error('Error deducting credits:', error)
            return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 })
        }

        // Check if successful
        if (!data.success) {
            return NextResponse.json({
                success: false,
                error: data.error,
                balance: data.balance,
                required: data.required
            }, { status: 402 }) // 402 Payment Required
        }

        return NextResponse.json({
            success: true,
            balance: data.balance,
            deducted: data.deducted
        }, { status: 200 })
    } catch (error: any) {
        console.error('Deduct credits error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
