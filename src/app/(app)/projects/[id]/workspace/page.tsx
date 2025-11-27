'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { GradientBackgroundWrapper } from '@/components/ui/GradientBackgroundWrapper'
import { AnimatedNavbar } from '@/components/ui/AnimatedNavbar'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ChatMemoryPanel } from '@/components/ui/ChatMemoryPanel'
import { ToolDrawer } from '@/components/ui/ToolDrawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Trash2,
    Download,
    Sparkles,
    Send,
    Menu,
    Clock,
    Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'

export default function WorkspacePage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string

    const [project, setProject] = useState<any>(null)
    const [memory, setMemory] = useState<any[]>([])
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedTool, setSelectedTool] = useState('email')
    const [showToolDrawer, setShowToolDrawer] = useState(false)

    useEffect(() => {
        loadProject()
        loadMemory()
    }, [projectId])

    async function loadProject() {
        try {
            const response = await fetch(`/api/projects/${projectId}`)
            if (response.ok) {
                const data = await response.json()
                setProject(data.project)
            } else {
                notFound()
            }
        } catch (error) {
            console.error('Error loading project:', error)
        }
    }

    async function loadMemory() {
        try {
            const response = await fetch(`/api/projects/${projectId}/memory`)
            if (response.ok) {
                const data = await response.json()
                setMemory(data.memory)
            }
        } catch (error) {
            console.error('Error loading memory:', error)
        }
    }

    async function handleSendMessage() {
        if (!prompt.trim()) return

        const userMessage = { role: 'user' as const, content: prompt }
        setMemory(prev => [...prev, userMessage])
        setPrompt('')
        setIsGenerating(true)

        try {
            const response = await fetch(`/api/projects/${projectId}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt.trim() })
            })

            if (response.ok) {
                const data = await response.json()
                setMemory(prev => [...prev, {
                    role: 'assistant' as const,
                    content: data.response,
                    tool_name: 'AI Assistant'
                }])
            } else {
                throw new Error('Failed to generate response')
            }
        } catch (error) {
            toast.error('Failed to generate AI response')
            setMemory(prev => prev.slice(0, -1))
        } finally {
            setIsGenerating(false)
        }
    }

    async function handleClearMemory() {
        if (!confirm('Clear all conversation history?')) return

        try {
            const response = await fetch(`/api/projects/${projectId}/memory`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setMemory([])
                toast.success('Memory cleared')
            }
        } catch (error) {
            toast.error('Failed to clear memory')
        }
    }

    if (!project) {
        return (
            <GradientBackgroundWrapper>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600/20 border-t-purple-600" />
                </div>
            </GradientBackgroundWrapper>
        )
    }

    return (
        <GradientBackgroundWrapper variant="blue">
            <AnimatedNavbar />

            <div className="min-h-screen pt-24 pb-6 px-4">
                <div className="mx-auto max-w-7xl">
                    {/* Project Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <GlassPanel hover={false}>
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    {/* Left: Back + Title */}
                                    <div className="flex items-center gap-4">
                                        <Link href="/projects">
                                            <motion.button
                                                whileHover={{ scale: 1.05, x: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="h-10 w-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                            >
                                                <ArrowLeft className="h-5 w-5" />
                                            </motion.button>
                                        </Link>

                                        <div>
                                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                                {project.title}
                                            </h1>
                                            {project.description && (
                                                <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Badges + Actions */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Clock className="h-4 w-4" />
                                            <span>{format(new Date(project.updated_at), 'MMM d, h:mm a')}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-600/20 to-emerald-600/20 border border-teal-500/30">
                                            <Zap className="h-3.5 w-3.5 text-teal-400" />
                                            <span className="text-xs font-medium text-teal-400">AI Active</span>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleClearMemory}
                                            className="h-9 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors flex items-center gap-2 text-sm border border-red-500/30"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="hidden sm:inline">Clear</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </motion.div>

                    {/* Main Workspace */}
                    <div className="grid lg:grid-cols-[1fr,400px] gap-6 h-[calc(100vh-280px)]">
                        {/* Left: Chat Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <GlassPanel className="flex-1 flex flex-col overflow-hidden" hover={false}>
                                {/* Chat Messages */}
                                <div className="flex-1 overflow-hidden">
                                    <ChatMemoryPanel messages={memory} isTyping={isGenerating} />
                                </div>

                                {/* Input Box */}
                                <div className="flex-shrink-0 p-4 border-t border-white/10">
                                    <div className="flex gap-2">
                                        <Input
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                            placeholder="Ask your AI assistant..."
                                            disabled={isGenerating}
                                            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                        />

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSendMessage}
                                            disabled={isGenerating || !prompt.trim()}
                                            className="h-10 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/30"
                                        >
                                            <Send className="h-4 w-4" />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowToolDrawer(true)}
                                            className="lg:hidden h-10 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center gap-2"
                                        >
                                            <Menu className="h-4 w-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </GlassPanel>
                        </motion.div>

                        {/* Right: Tools Panel (Desktop) / Drawer (Mobile) */}
                        <div className="hidden lg:block">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="h-full"
                            >
                                <ToolDrawer
                                    isOpen={true}
                                    onClose={() => { }}
                                    selectedTool={selectedTool}
                                    onToolChange={setSelectedTool}
                                >
                                    <div className="p-6 h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                                                    <Sparkles className="h-8 w-8 text-blue-400" />
                                                </div>
                                            </div>
                                            <p className="text-gray-400">Tool panel content</p>
                                            <p className="text-xs text-gray-500 mt-2">Selected: {selectedTool}</p>
                                        </div>
                                    </div>
                                </ToolDrawer>
                            </motion.div>
                        </div>

                        {/* Mobile Tool Drawer */}
                        <ToolDrawer
                            isOpen={showToolDrawer}
                            onClose={() => setShowToolDrawer(false)}
                            selectedTool={selectedTool}
                            onToolChange={setSelectedTool}
                        >
                            <div className="p-6 h-full flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-gray-400">Tool panel content</p>
                                    <p className="text-xs text-gray-500 mt-2">Selected: {selectedTool}</p>
                                </div>
                            </div>
                        </ToolDrawer>
                    </div>
                </div>
            </div>
        </GradientBackgroundWrapper>
    )
}
