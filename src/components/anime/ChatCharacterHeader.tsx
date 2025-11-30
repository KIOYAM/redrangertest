'use client'

import { motion } from 'framer-motion'
import { AnimeAssistantAvatar } from './AnimeAssistantAvatar'
import { Badge } from '@/components/ui/badge'

type ToolType = 'email' | 'developer' | 'general'

interface ChatCharacterHeaderProps {
    activeTool?: ToolType
    customSubtitle?: string
}

const toolSubtitles: Record<ToolType, string> = {
    email: "I'll help you craft perfect emails ✉️",
    developer: "I'll help you talk to your coding AI 💻",
    general: "I'm here to assist with your AI projects ✨"
}

export function ChatCharacterHeader({
    activeTool = 'general',
    customSubtitle
}: ChatCharacterHeaderProps) {
    const subtitle = customSubtitle || toolSubtitles[activeTool]

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 backdrop-blur-sm">
                {/* Avatar with glow ring */}
                <motion.div
                    key={activeTool}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="relative"
                >
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-lg opacity-50" />

                    {/* Avatar */}
                    <div className="relative rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-2 border-2 border-purple-400/30">
                        <AnimeAssistantAvatar mood="happy" size="md" />
                    </div>
                </motion.div>

                {/* Text Content */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Nova – Your AI Prompt Mentor
                        </h3>
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs">
                            Online
                        </Badge>
                    </div>
                    <motion.p
                        key={subtitle}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-gray-400"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                {/* Tool indicator */}
                <div className="hidden sm:flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-gray-500 capitalize">{activeTool} Mode</span>
                </div>
            </div>
        </motion.div>
    )
}
