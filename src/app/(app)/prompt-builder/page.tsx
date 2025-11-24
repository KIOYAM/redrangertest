import { createClient } from '@/lib/supabase/server'
import { PromptBuilder } from './prompt-builder'

export default async function PromptBuilderPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Prompt Builder</h1>
                <p className="text-gray-500">Create the perfect prompt for your needs.</p>
            </div>
            <PromptBuilder user={profile} />
        </div>
    )
}
