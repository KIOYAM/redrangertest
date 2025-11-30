'use client'

import { motion } from 'framer-motion'
import { AnimeAssistantAvatar } from './AnimeAssistantAvatar'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/button'

interface EmptyStateCharacterProps {
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
    mood?: 'idle' | 'thinking' | 'happy' | 'error'
}

export function EmptyStateCharacter({
    title,
    description,
    actionLabel,
    onAction,
    mood = 'idle'
}: EmptyStateCharacterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <GlassPanel className="p-12 text-center" hover={false}>
                {/* Chibi Character */}
                <div className="mb-6 flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                    >
                        <AnimeAssistantAvatar mood={mood} size="lg" />
                    </motion.div>
                </div>

                {/* Title */}
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white mb-3"
                >
                    {title}
                </motion.h3>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 mb-6 max-w-md mx-auto"
                >
                    {description}
                </motion.p>

                {/* Action Button */}
                {actionLabel && onAction && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            onClick={onAction}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/30"
                        >
                            {actionLabel}
                        </Button>
                    </motion.div>
                )}

                {/* Decorative Elements */}
                <div className="mt-8 flex justify-center gap-3">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-purple-400/30"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </GlassPanel>
        </motion.div>
    )
}
