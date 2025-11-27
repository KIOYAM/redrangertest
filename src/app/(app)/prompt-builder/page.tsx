import { createClient } from '@/lib/supabase/server'
import { ToolHub } from '@/components/prompt/ToolHub'

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Prompt Builder Hub
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Choose a tool to generate the perfect prompt
                    </p>
                </div>

                {profileError && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                        <p className="text-red-800 font-medium">Profile Error: {profileError.message}</p>
                        <p className="text-red-600 text-sm mt-1">User ID: {user?.id}</p>
                    </div>
                )}

                {/* Tool Hub */}
                <ToolHub user={profile} />
            </div>
        </div>
    )
}

