'use client'

import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import { TypingDots } from './TypingDots'

interface ChatMessageProps {
    role: 'user' | 'assistant'
    content: string
    isTyping?: boolean
    toolName?: string
}

export function ChatMessage({ role, content, isTyping, toolName }: ChatMessageProps) {
    const isUser = role === 'user'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isUser
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50'
                        : 'bg-gradient-to-br from-teal-600 to-emerald-600 shadow-lg shadow-teal-500/50'
                    }`}
            >
                {isUser ? (
                    <User className="h-5 w-5 text-white" />
                ) : (
                    <Bot className="h-5 w-5 text-white" />
                )}
            </motion.div>

            {/* Message Bubble */}
            <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Tool Badge */}
                {toolName && !isUser && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-2 py-1 rounded-full bg-teal-600/20 border border-teal-500/30 text-xs text-teal-400 font-medium"
                    >
                        {toolName}
                    </motion.div>
                )}

                {/* Bubble */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative overflow-hidden rounded-2xl px-4 py-3 ${isUser
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                            : 'border border-white/10 bg-black/40 backdrop-blur-xl text-gray-100'
                        }`}
                >
                    {/* Glass effect for AI messages */}
                    {!isUser && (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 via-transparent to-emerald-600/5" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
                        </>
                    )}

                    {/* Content */}
                    <div className="relative">
                        {isTyping ? (
                            <TypingDots />
                        ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
