'use client'

import { ToolHub } from '@/components/prompt/ToolHub'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { PageHeader } from '@/components/ui/PageHeader'
import { Sparkles } from 'lucide-react'
import type { UserProfile } from '@/types'

interface PromptBuilderClientProps {
    profile: UserProfile | null
    profileError: any
    userId?: string
}

export function PromptBuilderClient({ profile, profileError, userId }: PromptBuilderClientProps) {
    return (
        <PageWrapper variant="gradient" gradientVariant="red">
            <div className="mx-auto max-w-7xl px-4 py-12 pt-32 sm:px-6 lg:px-8">
                <PageHeader
                    title="Prompt Builder Hub"
                    description="Choose a tool to generate the perfect prompt"
                    icon={Sparkles}
                    iconColor="red"
                />

                {profileError && (
                    <div className="mb-6 rounded-lg bg-red-950/50 border border-red-500/30 p-4 backdrop-blur-xl">
                        <p className="text-red-300 font-medium">Profile Error: {profileError.message}</p>
                        <p className="text-red-400 text-sm mt-1">User ID: {userId}</p>
                    </div>
                )}

                {/* Tool Hub */}
                <ToolHub user={profile} />
            </div>
        </PageWrapper>
    )
}

