import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Fetch all active ranger groups with tool counts
        const { data, error } = await supabase.rpc('get_all_ranger_groups')

        if (error) {
            console.error('Error fetching ranger groups:', error)
            return NextResponse.json({ error: 'Failed to fetch ranger groups' }, { status: 500 })
        }

        return NextResponse.json({ success: true, groups: data }, { status: 200 })
    } catch (error: any) {
        console.error('Ranger groups fetch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
