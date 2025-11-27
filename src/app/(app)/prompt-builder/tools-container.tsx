'use client'

import { useState } from 'react'
import { UserProfile } from '@/types'
import { PromptBuilder } from './prompt-builder'
import { EmailTool } from '../tools/email/email-tool'
import { Button } from '@/components/ui/button'
import { MessageSquare, Mail } from 'lucide-react'

interface ToolsContainerProps {
    user: UserProfile | null
}

export function ToolsContainer({ user }: ToolsContainerProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'email'>('email')

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 border-b pb-2">
                <Button
                    variant={activeTab === 'email' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('email')}
                    className="gap-2"
                >
                    <Mail className="h-4 w-4" />
                    Email Tool
                </Button>
                <Button
                    variant={activeTab === 'general' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('general')}
                    className="gap-2"
                >
                    <MessageSquare className="h-4 w-4" />
                    General Prompt
                </Button>
            </div>

            <div className="min-h-[600px]">
                {activeTab === 'email' ? (
                    <EmailTool user={user} />
                ) : (
                    <PromptBuilder user={user} />
                )}
            </div>
        </div>
    )
}
