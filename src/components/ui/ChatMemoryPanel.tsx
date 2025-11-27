'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import { MessageSquare } from 'lucide-react'

interface MemoryEntry {
    id?: string
    role: 'user' | 'assistant'
    content: string
    tool_name?: string
    created_at?: string
}

interface ChatMemoryPanelProps {
    messages: MemoryEntry[]
    isTyping?: boolean
}

export function ChatMemoryPanel({ messages, isTyping }: ChatMemoryPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0 px-6 py-4 border-b border-white/10"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/50">
                        <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Conversation History</h3>
                        <p className="text-xs text-gray-400">{messages.length} messages</p>
                    </div>
                </div>
            </motion.div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                <AnimatePresence mode="popLayout">
                    {messages.length === 0 && !isTyping ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center h-full text-center py-12"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-teal-600/20 to-emerald-600/20 flex items-center justify-center"
                            >
                                <MessageSquare className="h-8 w-8 text-teal-400" />
                            </motion.div>
                            <p className="text-gray-400 text-sm">
                                Start a conversation with your AI assistant
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={message.id || index}
                                    role={message.role}
                                    content={message.content}
                                    toolName={message.tool_name}
                                />
                            ))}

                            {isTyping && (
                                <ChatMessage
                                    role="assistant"
                                    content=""
                                    isTyping={true}
                                />
                            )}
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
