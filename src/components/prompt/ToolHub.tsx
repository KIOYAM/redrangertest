'use client'

import { useState } from 'react'
import { ToolCard } from './ToolCard'
import { EmailToolPanel } from './EmailToolPanel'
import { DeveloperToolPanel } from './DeveloperToolPanel'
import { ComingSoonPanel } from './ComingSoonPanel'
import { AnimatePresence, motion } from 'framer-motion'
import { UserProfile } from '@/types'
import { tools, type ToolConfig } from './toolsConfig'

interface ToolHubProps {
    user: UserProfile | null
}

export function ToolHub({ user }: ToolHubProps) {
    const [activeTool, setActiveTool] = useState<string | null>(null)

    const activeToolConfig = tools.find(t => t.id === activeTool)

    return (
        <>
            {/* Tool Hub Grid */}
            {!activeTool && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ToolCard
                                icon={tool.icon}
                                title={tool.title}
                                description={tool.description}
                                tags={tool.tags}
                                onClick={() => setActiveTool(tool.id)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Active Tool Panels */}
            <AnimatePresence mode="wait">
                {/* Email Tool Panel */}
                {activeTool === 'email' && (
                    <EmailToolPanel
                        user={user}
                        onClose={() => setActiveTool(null)}
                    />
                )}

                {/* Developer Tool Panel */}
                {activeTool === 'developer' && (
                    <DeveloperToolPanel
                        user={user}
                        onClose={() => setActiveTool(null)}
                    />
                )}

                {/* Coming Soon Panels for other tools */}
                {activeTool && activeTool !== 'email' && activeTool !== 'developer' && activeToolConfig && (
                    <ComingSoonPanel
                        icon={activeToolConfig.icon}
                        title={activeToolConfig.title}
                        onClose={() => setActiveTool(null)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
