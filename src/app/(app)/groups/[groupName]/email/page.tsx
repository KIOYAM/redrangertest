'use client'

import { use } from 'react'
import { EmailToolPanel } from '@/components/prompt/EmailToolPanel'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types'

export default function GroupEmailToolPage({
    params
}: {
    params: Promise<{ groupName: string }>
}) {
    const { groupName } = use(params)
    const [user, setUser] = useState<UserProfile | null>(null)
    const [showPanel, setShowPanel] = useState(true)

    useEffect(() => {
        loadUser()
    }, [])

    async function loadUser() {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()
            if (data) {
                setUser({ ...authUser, ...data } as UserProfile)
            }
        }
    }

    return (
        <div className="min-h-screen">
            {showPanel && user && (
                <EmailToolPanel
                    user={user}
                    onClose={() => setShowPanel(false)}
                />
            )}
        </div>
    )
}
