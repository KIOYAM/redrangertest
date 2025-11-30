'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GradientBackgroundWrapper } from '@/components/ui/GradientBackgroundWrapper'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Mail,
    Code2,
    Clock,
    MessageSquare,
    TrendingUp,
    Copy
} from 'lucide-react'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'

export default function ProjectOverviewPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string

    const [project, setProject] = useState<any>(null)
    const [toolStats, setToolStats] = useState<any[]>([])
    const [projectStats, setProjectStats] = useState<any>(null)
    const [timeline, setTimeline] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedTool, setSelectedTool] = useState<string>('all')

    useEffect(() => {
        loadOverview()
    }, [projectId])

    async function loadOverview() {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/projects/${projectId}/overview`)
            if (response.ok) {
                const data = await response.json()
                setProject(data.project)
                setToolStats(data.toolStats)
                setProjectStats(data.projectStats)
                setTimeline(data.timeline)
            } else {
                toast.error('Failed to load project overview')
            }
        } catch (error) {
            console.error('Error loading overview:', error)
            toast.error('Failed to load project overview')
        } finally {
            setIsLoading(false)
        }
    }

    const getToolIcon = (toolName: string) => {
        switch (toolName?.toLowerCase()) {
            case 'email':
                return <Mail className="h-5 w-5" />
            case 'developer':
                return <Code2 className="h-5 w-5" />
            default:
                return <MessageSquare className="h-5 w-5" />
        }
    }

    const getToolColor = (toolName: string) => {
        switch (toolName?.toLowerCase()) {
            case 'email':
                return 'from-blue-600 to-cyan-600'
            case 'developer':
                return 'from-purple-600 to-pink-600'
            default:
                return 'from-gray-600 to-gray-700'
        }
    }

    const filteredTimeline = selectedTool === 'all'
        ? timeline
        : timeline.filter(entry => entry.tool_name === selectedTool)

    if (isLoading) {
        return (
            <GradientBackgroundWrapper variant="purple">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600/20 border-t-purple-600" />
                </div>
            </GradientBackgroundWrapper>
        )
    }

    return (
        <GradientBackgroundWrapper variant="purple">
            <div className="min-h-screen pt-12 pb-20 px-4">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Link href="/projects">
                            <Button variant="ghost" size="sm" className="mb-4 text-gray-300 hover:text-white">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Projects
                            </Button>
                        </Link>

                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                    {project?.title}
                                </h1>
                                {project?.description && (
                                    <p className="text-gray-400 max-w-2xl">{project.description}</p>
                                )}
                            </div>
                            <Button
                                onClick={() => router.push(`/projects/${projectId}/workspace`)}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                Open Workspace
                            </Button>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <GlassPanel hover={false} className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-lg bg-purple-600/20">
                                        <MessageSquare className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{projectStats?.messageCount || 0}</p>
                                        <p className="text-sm text-gray-400">Total Messages</p>
                                    </div>
                                </div>
                            </GlassPanel>

                            <GlassPanel hover={false} className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-lg bg-blue-600/20">
                                        <TrendingUp className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{toolStats.length}</p>
                                        <p className="text-sm text-gray-400">Tools Used</p>
                                    </div>
                                </div>
                            </GlassPanel>

                            <GlassPanel hover={false} className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-lg bg-cyan-600/20">
                                        <Clock className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {projectStats?.lastActivity
                                                ? formatDistanceToNow(new Date(projectStats.lastActivity), { addSuffix: true })
                                                : 'No activity'}
                                        </p>
                                        <p className="text-sm text-gray-400">Last Activity</p>
                                    </div>
                                </div>
                            </GlassPanel>
                        </div>
                    </motion.div>

                    {/* Tool Statistics */}
                    {toolStats.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">Tools Used</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {toolStats.map((tool, index) => (
                                    <motion.div
                                        key={tool.toolName}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <GlassPanel className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-lg bg-gradient-to-br ${getToolColor(tool.toolName)}/20`}>
                                                    {getToolIcon(tool.toolName)}
                                                </div>
                                                <Badge variant="secondary" className="bg-white/10 text-white">
                                                    {tool.count} interactions
                                                </Badge>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white capitalize mb-1">
                                                {tool.toolName}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Last used {formatDistanceToNow(new Date(tool.lastUsed), { addSuffix: true })}
                                            </p>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="mt-4 w-full text-gray-300 hover:text-white hover:bg-white/10"
                                                onClick={() => setSelectedTool(tool.toolName)}
                                            >
                                                View History
                                            </Button>
                                        </GlassPanel>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">Memory Timeline</h2>
                            {selectedTool !== 'all' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedTool('all')}
                                    className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
                                >
                                    Show All Tools
                                </Button>
                            )}
                        </div>

                        {filteredTimeline.length === 0 ? (
                            <GlassPanel hover={false} className="p-12 text-center">
                                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400">
                                    {selectedTool === 'all'
                                        ? 'No activity yet. Start using tools with this project!'
                                        : `No activity for ${selectedTool} tool yet.`}
                                </p>
                            </GlassPanel>
                        ) : (
                            <div className="space-y-4">
                                {filteredTimeline.map((entry, index) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <GlassPanel className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${getToolColor(entry.tool_name)}/20 flex-shrink-0`}>
                                                    {getToolIcon(entry.tool_name)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge
                                                            className={`capitalize ${entry.role === 'user'
                                                                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                                                    : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                                                                }`}
                                                        >
                                                            {entry.role}
                                                        </Badge>
                                                        <Badge variant="outline" className="capitalize text-gray-400 border-gray-600">
                                                            {entry.tool_name || 'unknown'}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500 ml-auto">
                                                            {format(new Date(entry.created_at), 'MMM d, h:mm a')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-300 line-clamp-3">
                                                        {entry.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </GlassPanel>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </GradientBackgroundWrapper>
    )
}
