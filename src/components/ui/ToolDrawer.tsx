'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Code, Wand2, X } from 'lucide-react'
import { GlassPanel } from './GlassPanel'
import { useState } from 'react'

interface ToolDrawerProps {
    isOpen: boolean
    onClose: () => void
    selectedTool: string
    onToolChange: (tool: string) => void
    children: React.ReactNode
}

const tools = [
    { id: 'email', label: 'Email Tool', icon: Mail, color: 'from-blue-600 to-cyan-600' },
    { id: 'developer', label: 'Developer', icon: Code, color: 'from-purple-600 to-pink-600' },
    { id: 'prompt', label: 'Prompt Builder', icon: Wand2, color: 'from-teal-600 to-emerald-600' },
]

export function ToolDrawer({ isOpen, onClose, selectedTool, onToolChange, children }: ToolDrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 lg:relative lg:w-full"
                    >
                        <GlassPanel className="h-full flex flex-col" hover={false}>
                            {/* Header */}
                            <div className="flex-shrink-0 px-6 py-4 border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-white">AI Tools</h3>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={onClose}
                                        className="lg:hidden h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </motion.button>
                                </div>

                                {/* Tool Selector */}
                                <div className="mt-4 flex gap-2">
                                    {tools.map((tool) => {
                                        const Icon = tool.icon
                                        const isSelected = selectedTool === tool.id

                                        return (
                                            <motion.button
                                                key={tool.id}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => onToolChange(tool.id)}
                                                className={`relative flex-1 px-3 py-2 rounded-lg transition-all ${isSelected
                                                        ? 'bg-gradient-to-r ' + tool.color + ' text-white shadow-lg'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="tool-indicator"
                                                        className="absolute inset-0 rounded-lg border border-white/20"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <div className="relative flex items-center justify-center gap-1.5">
                                                    <Icon className="h-4 w-4" />
                                                    <span className="text-xs font-medium hidden sm:inline">{tool.label}</span>
                                                </div>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Tool Content */}
                            <div className="flex-1 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedTool}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full"
                                    >
                                        {children}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </GlassPanel>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
