import { createClient } from '@/lib/supabase/server'
import { ToolWorkspaceClient } from './tool-workspace-client'
import { notFound } from 'next/navigation'

export default async function ToolPage({ params }: { params: Promise<{ toolName: string }> }) {
    const { toolName } = await params
    const supabase = await createClient()

    // Fetch tool details
    const { data: tool, error } = await supabase
        .from('tool_categories')
        .select(`
            *,
            ranger_groups (
                name,
                display_name,
                color_primary,
                color_secondary
            )
        `)
        .eq('tool_name', toolName)
        .single()

    if (error || !tool) {
        notFound()
    }

    // Fetch user for context
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <ToolWorkspaceClient
            tool={tool}
            userId={user?.id}
        />
    )
}
