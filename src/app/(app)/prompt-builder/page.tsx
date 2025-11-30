import { createClient } from '@/lib/supabase/server'
import { PromptBuilderClient } from './prompt-builder-client'

export default async function PromptBuilderPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    // Debug logs (can be removed later)
    console.log('🔍 DEBUG - User ID:', user?.id)
    console.log('🔍 DEBUG - Profile data:', profile)
    console.log('🔍 DEBUG - Profile error:', profileError)

    return (
        <PromptBuilderClient 
            profile={profile} 
            profileError={profileError}
            userId={user?.id}
        />
    )
}

