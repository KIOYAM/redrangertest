'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimeAssistantAvatar } from './AnimeAssistantAvatar'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/button'
import { X, Sparkles, Code2, Mail } from 'lucide-react'
import Link from 'next/link'

export function AssistantDock() {
    const [isOpen, setIsOpen] = useState(false)
    const [showTeaser, setShowTeaser] = useState(true)

    return (
        <>
            {/* Floating Dock Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
            >
                <motion.button
                    onClick={() => {
                        setIsOpen(true)
                        setShowTeaser(false)
                    }}
                    className="relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Speech bubble teaser */}
                    <AnimatePresence>
                        {showTeaser && !isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute bottom-full right-0 mb-2 pointer-events-none"
                            >
                                <GlassPanel className="px-4 py-2 whitespace-nowrap">
                                    <p className="text-sm text-white font-medium">
                                        Need help? 👋
                                    </p>
                                    {/* Speech bubble tail */}
                                    <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/10" />
                                </GlassPanel>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Avatar with glow */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-gradient-to-br from-purple-600/90 to-blue-600/90 rounded-full p-2 backdrop-blur-sm border-2 border-white/20">
                            <AnimeAssistantAvatar mood="happy" size="md" />
                        </div>
                    </div>
                </motion.button>
            </motion.div>

            {/* Side Panel Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50"
                        >
                            <GlassPanel className="h-full p-8 rounded-l-3xl border-l-2 border-t-2 border-b-2 border-r-0">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">
                                            Nova Assistant
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            Your AI Guide
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>

                                {/* Character */}
                                <div className="flex justify-center mb-8">
                                    <AnimeAssistantAvatar mood="happy" size="lg" />
                                </div>

                                {/* Message */}
                                <div className="mb-8 text-center">
                                    <p className="text-white text-lg font-medium mb-2">
                                        Hello! I'm Nova ✨
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        I'm here to help you create amazing AI-powered projects.
                                        What would you like to do today?
                                    </p>
                                </div>

                                {/* Quick Actions */}
                                <div className="space-y-3">
                                    <Link href="/projects" onClick={() => setIsOpen(false)}>
                                        <Button
                                            className="w-full justify-start text-left bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600"
                                        >
                                            <Sparkles className="mr-3 h-5 w-5" />
                                            <div>
                                                <div className="font-medium">Create New Project</div>
                                                <div className="text-xs opacity-80">Start a fresh AI workspace</div>
                                            </div>
                                        </Button>
                                    </Link>

                                    <Link href="/prompt-builder?tool=developer" onClick={() => setIsOpen(false)}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left border-white/20 hover:bg-white/10"
                                        >
                                            <Code2 className="mr-3 h-5 w-5 text-purple-400" />
                                            <div>
                                                <div className="font-medium text-white">Developer Prompt Tool</div>
                                                <div className="text-xs text-gray-400">Generate coding prompts</div>
                                            </div>
                                        </Button>
                                    </Link>

                                    <Link href="/prompt-builder?tool=email" onClick={() => setIsOpen(false)}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left border-white/20 hover:bg-white/10"
                                        >
                                            <Mail className="mr-3 h-5 w-5 text-blue-400" />
                                            <div>
                                                <div className="font-medium text-white">Email Help</div>
                                                <div className="text-xs text-gray-400">Craft perfect emails</div>
                                            </div>
                                        </Button>
                                    </Link>
                                </div>

                                {/* Tips */}
                                <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-xs text-gray-400 mb-2">💡 Pro Tip</p>
                                    <p className="text-sm text-gray-300">
                                        Attach tools to projects to build contextual memory over time!
                                    </p>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
