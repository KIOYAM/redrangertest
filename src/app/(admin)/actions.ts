'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleAIAccess(userId: string, currentAccess: boolean) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (adminProfile?.role !== 'admin') {
        return { error: 'Forbidden' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ can_use_ai: !currentAccess })
        .eq('id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/users')
}
