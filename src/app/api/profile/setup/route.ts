import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { full_name, user_type, job_role, avatar_url } = await request.json()

        if (!full_name || !user_type) {
            return NextResponse.json(
                { error: 'Full name and user type are required' },
                { status: 400 }
            )
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .update({
                full_name: full_name.trim(),
                user_type,
                job_role: job_role?.trim() || null,
                avatar_url: avatar_url || null,
                onboarding_completed: true
            })
            .eq('id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Onboarding setup error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ profile })
    } catch (error: any) {
        console.error('Onboarding error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
