'use client'

import { motion } from 'framer-motion'
import { AnimeWorkspaceShell } from '@/components/layout/AnimeWorkspaceShell'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * DEMO ONLY - Shows how the existing Projects page would look 
 * with AnimeWorkspaceShell wrapper (without touching the real /projects route)
 * 
 * This demonstrates the visual transformation without breaking production.
 */
export default function ProjectsAnimePreviewPage() {
    // Mock data matching the real Projects page structure
    const mockProjects = [
        {
            id: '1',
            title: 'Marketing Campaign AI',
            description: 'Generate marketing content and social media posts',
            created_at: new Date().toISOString(),
            messageCount: 45,
            lastActivity: '2 hours ago'
        },
        {
            id: '2',
            title: 'Customer Support Bot',
            description: 'Automated customer inquiry responses',
            created_at: new Date().toISOString(),
            messageCount: 128,
            lastActivity: '1 day ago'
        },
        {
            id: '3',
            title: 'Code Documentation',
            description: 'Auto-generate technical documentation',
            created_at: new Date().toISOString(),
            messageCount: 67,
            lastActivity: '3 days ago'
        }
    ]

    return (
        <AnimeWorkspaceShell>
            <div className="mx-auto max-w-7xl">
                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <GlassPanel className="p-4 border-blue-500/30 bg-blue-600/10">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-400" />
                            <div className="flex-1">
                                <p className="text-blue-300 text-sm font-medium">
                                    Demo Preview: This shows how /projects would look with AnimeWorkspaceShell
                                </p>
                                <p className="text-blue-400/70 text-xs">
                                    The actual /projects page remains unchanged. This is just a visual preview.
                                </p>
                            </div>
                            <Link href="/ui/anime-showcase">
                                <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-600/20">
                                    <ArrowLeft className="mr-2 h-3 w-3" />
                                    Back to Showcase
                                </Button>
                            </Link>
                        </div>
                    </GlassPanel>
                </motion.div>

                {/* Header - Same structure as real Projects page */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="mb-4 inline-flex"
                    >
                        <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-4 shadow-lg shadow-purple-500/50">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                    </motion.div>

                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Your AI Projects
                    </h1>

                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Each project has its own isolated AI memory. Create, manage, and organize your AI workflows.
                    </p>
                </motion.div>

                {/* Create Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 flex justify-center"
                >
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/30"
                    >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Create New Project
                    </Button>
                </motion.div>

                {/* Projects Grid - Using same structure as ProjectCard */}
                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {mockProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={{
                                hidden: { opacity: 0, y: 20, scale: 0.9 },
                                visible: { opacity: 1, y: 0, scale: 1 }
                            }}
                        >
                            <GlassPanel hover className="p-6 h-full">
                                {/* Project Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                                        <Sparkles className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <Badge className="bg-white/10 text-gray-300 border-white/20">
                                        {project.messageCount} messages
                                    </Badge>
                                </div>

                                {/* Project Info */}
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="text-xs text-gray-500 mb-4">
                                    Last activity: {project.lastActivity}
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 text-white"
                                    >
                                        Open
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-white/20 text-gray-300 hover:bg-white/10"
                                    >
                                        Settings
                                    </Button>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State Example (commented) */}
                {/* 
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <GlassPanel className="p-12 text-center" hover={false}>
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-purple-600/20 p-6">
                                <AlertCircle className="h-12 w-12 text-purple-400" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Projects Yet</h3>
                        <p className="text-gray-400 mb-6">
                            Create your first AI project to get started
                        </p>
                    </GlassPanel>
                </motion.div>
                */}
            </div>
        </AnimeWorkspaceShell>
    )
}
