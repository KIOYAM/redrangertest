import { createClient } from '@/lib/supabase/server'
import { GenericTool } from '@/components/tools/GenericTool'
import Link from 'next/link'

export default async function ToolPage({ params }: { params: Promise<{ groupName: string, toolId: string }> }) {
    const { groupName, toolId } = await params
    const supabase = await createClient()

    // 1. Fetch Group
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

    // 2. Fetch Tool
    const routePath = `/groups/${groupName}/${toolId}`
    const { data: tool, error: toolError } = await supabase
        .from('tool_categories')
        .select('*')
        .eq('route_path', routePath)
        .eq('group_id', group.id)
        .single()

    if (toolError || !tool) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Tool Not Found</h1>
                    <p className="text-gray-400 mb-8">We couldn't find the tool you're looking for.</p>
                    <Link
                        href={`/groups/${groupName}`}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                    >
                        Back to Group
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            {/* Background Gradient */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{ background: `radial-gradient(circle at top right, ${group.color_primary}, transparent 70%)` }}
                />
            </div>

            <div className="relative z-10">
                <GenericTool
                    tool={tool}
                    groupColor={group.color_primary}
                    groupName={group.name}
                />
            </div>
        </div>
    )
}
