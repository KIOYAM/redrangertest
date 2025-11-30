import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupName: string }> }
) {
    try {
        const supabase = await createClient()
        const { groupName } = await params

        // Fetch tools for this group
        const { data, error } = await supabase.rpc('get_group_tools', {
            p_group_name: groupName
        })

        if (error) {
            console.error('Error fetching group tools:', error)
            return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 })
        }

        // Also fetch the group info
        const { data: groupData, error: groupError } = await supabase
            .from('ranger_groups')
            .select('*')
            .eq('name', groupName)
            .eq('is_active', true)
            .single()

        if (groupError || !groupData) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            group: groupData,
            tools: data
        }, { status: 200 })
    } catch (error: any) {
        console.error('Group tools fetch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
