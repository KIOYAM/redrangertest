'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Bot } from 'lucide-react'
import type { MemoryEntry } from '@/types/project'
import { formatDistanceToNow } from 'date-fns'

interface ChatMemoryPanelProps {
    memory: MemoryEntry[]
    isLoading: boolean
}

export function ChatMemoryPanel({ memory, isLoading }: ChatMemoryPanelProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [memory])

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-sm text-gray-600">Loading conversation...</p>
                </div>
            </div>
        )
    }

    if (memory.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <Bot className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">Start a conversation</p>
                    <p className="mt-2 text-sm text-gray-600">Type your message below to begin</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {memory.map((entry, index) => (
                <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-4 ${entry.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${entry.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                        }`}>
                        {entry.role === 'user' ? (
                            <User className="h-5 w-5 text-blue-600" />
                        ) : (
                            <Bot className="h-5 w-5 text-gray-600" />
                        )}
                    </div>

                    <div className={`flex-1 ${entry.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block max-w-3xl rounded-2xl px-4 py-3 ${entry.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200'
                            }`}>
                            <p className={`whitespace-pre-wrap ${entry.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                                {entry.content}
                            </p>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            {entry.tool_name && (
                                <span className="rounded bg-gray-100 px-2 py-0.5">{entry.tool_name}</span>
                            )}
                            <span>{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
            <div ref={bottomRef} />
        </div>
    )
}
