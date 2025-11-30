import { createClient } from '@/lib/supabase/server'
import { GroupPageClient } from './group-page-client'
import Link from 'next/link'

export default async function GroupPage({ params }: { params: Promise<{ groupName: string }> }) {
    const { groupName } = await params
    const supabase = await createClient()

    // Fetch group and tools in parallel
    const { data: group, error: groupError } = await supabase
        .from('ranger_groups')
        .select('*')
        .eq('name', `${groupName}_ranger`)
        .single()

    if (groupError || !group) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Group Not Found</h1>
                    <Link href="/" className="text-red-500 hover:text-red-400">
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    const { data: tools } = await supabase
        .from('tool_categories')
        .select('*')
        .eq('group_id', group.id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })

    return <GroupPageClient group={group} tools={tools || []} />
}
