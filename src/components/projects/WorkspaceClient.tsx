'use client'

import { useState, useEffect, useRef } from 'react'
import type { Project, MemoryEntry } from '@/types/project'
import { ProjectHeader } from './ProjectHeader'
import { ChatMemoryPanel } from './ChatMemoryPanel'
import { PromptInputBox } from './PromptInputBox'

interface WorkspaceClientProps {
    project: Project
}

export function WorkspaceClient({ project }: WorkspaceClientProps) {
    const [memory, setMemory] = useState<MemoryEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        loadMemory()
    }, [project.id])

    const loadMemory = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/projects/${project.id}/memory?limit=50`)
            const data = await response.json()
            setMemory(data.memory || [])
        } catch (error) {
            console.error('Failed to load memory:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSend = async (prompt: string, toolName?: string) => {
        setIsGenerating(true)

        // Optimistic update
        const userMessage: MemoryEntry = {
            id: 'temp-user',
            project_id: project.id,
            role: 'user',
            content: prompt,
            tool_name: toolName || null,
            created_at: new Date().toISOString()
        }
        setMemory(prev => [...prev, userMessage])

        try {
            const response = await fetch(`/api/projects/${project.id}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, toolName })
            })

            if (!response.ok) {
                throw new Error('Failed to generate response')
            }

            const data = await response.json()

            // Reload full memory to get real IDs
            await loadMemory()
        } catch (error) {
            console.error('Send error:', error)
            // Revert optimistic update
            setMemory(prev => prev.filter(m => m.id !== 'temp-user'))
        } finally {
            setIsGenerating(false)
        }
    }

    const handleClearMemory = async () => {
        if (!confirm('Clear all conversation history?')) return

        try {
            const response = await fetch(`/api/projects/${project.id}/memory`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setMemory([])
            }
        } catch (error) {
            console.error('Clear memory error:', error)
        }
    }

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            <ProjectHeader project={project} onClearMemory={handleClearMemory} />

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                    <ChatMemoryPanel memory={memory} isLoading={isLoading} />
                </div>
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
                <PromptInputBox onSend={handleSend} isGenerating={isGenerating} />
            </div>
        </div>
    )
}
