import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Fetch all active credit packages
        const { data, error } = await supabase
            .from('credit_packages')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        if (error) {
            console.error('Error fetching packages:', error)
            return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
        }

        return NextResponse.json({ success: true, packages: data }, { status: 200 })
    } catch (error: any) {
        console.error('Packages fetch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
