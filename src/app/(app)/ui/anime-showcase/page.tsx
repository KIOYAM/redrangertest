'use client'

import { motion } from 'framer-motion'
import { AnimeWorkspaceShell } from '@/components/layout/AnimeWorkspaceShell'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, MessageSquare, Rocket, Star, Code2 } from 'lucide-react'

export default function AnimeShowcasePage() {
    // Mock project data for demo
    const mockProjects = [
        {
            id: '1',
            title: 'AI Chat Assistant',
            description: 'Intelligent conversational AI with memory',
            messageCount: 142,
            toolsUsed: ['email', 'developer']
        },
        {
            id: '2',
            title: 'Code Review Bot',
            description: 'Automated code analysis and suggestions',
            messageCount: 89,
            toolsUsed: ['developer']
        },
        {
            id: '3',
            title: 'Content Generator',
            description: 'Generate marketing copy and blog posts',
            messageCount: 256,
            toolsUsed: ['email']
        }
    ]

    return (
        <AnimeWorkspaceShell>
            <div className="mx-auto max-w-7xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="mb-6 inline-flex"
                    >
                        <div className="rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-5 shadow-2xl shadow-purple-500/50">
                            <Sparkles className="h-12 w-12 text-white" />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                    >
                        Futuristic Anime UI
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
                    >
                        Experience the next generation of AI workspace design with animated nebula backgrounds,
                        holographic borders, and premium glassmorphism components.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-4 justify-center"
                    >
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg shadow-purple-500/30">
                            <Rocket className="mr-2 h-5 w-5" />
                            Get Started
                        </Button>
                        <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 px-8 py-6 text-lg">
                            <Star className="mr-2 h-5 w-5" />
                            Learn More
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-3 gap-6 mb-16"
                >
                    <GlassPanel className="p-8 text-center">
                        <div className="mb-4 inline-flex p-4 rounded-full bg-purple-600/20">
                            <Zap className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Animated Nebula</h3>
                        <p className="text-gray-400">
                            Dynamic particle system with floating shapes and shooting stars
                        </p>
                    </GlassPanel>

                    <GlassPanel className="p-8 text-center">
                        <div className="mb-4 inline-flex p-4 rounded-full bg-pink-600/20">
                            <MessageSquare className="h-8 w-8 text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Holo Borders</h3>
                        <p className="text-gray-400">
                            Neon glowing edges with animated corner accents
                        </p>
                    </GlassPanel>

                    <GlassPanel className="p-8 text-center">
                        <div className="mb-4 inline-flex p-4 rounded-full bg-blue-600/20">
                            <Code2 className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Premium Glass</h3>
                        <p className="text-gray-400">
                            Glassmorphism panels with backdrop blur effects
                        </p>
                    </GlassPanel>
                </motion.div>

                {/* Sample Projects Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Your AI Projects
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {mockProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                            >
                                <GlassPanel hover className="p-6 h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                                            <Sparkles className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <Badge className="bg-purple-600/30 text-purple-300 border-purple-500/30">
                                            {project.messageCount} msgs
                                        </Badge>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-400 mb-4 text-sm">
                                        {project.description}
                                    </p>

                                    <div className="flex gap-2 mb-4">
                                        {project.toolsUsed.map(tool => (
                                            <Badge
                                                key={tool}
                                                variant="outline"
                                                className="text-xs text-gray-400 border-gray-600 capitalize"
                                            >
                                                {tool}
                                            </Badge>
                                        ))}
                                    </div>

                                    <Button
                                        size="sm"
                                        className="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 text-white"
                                    >
                                        Open Project
                                    </Button>
                                </GlassPanel>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Chat Preview Block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        AI Chat Preview
                    </h2>
                    <GlassPanel className="p-8 max-w-3xl mx-auto">
                        <div className="space-y-4">
                            {/* User Message */}
                            <div className="flex gap-3">
                                <div className="p-2 rounded-full bg-blue-600/20 h-fit">
                                    <MessageSquare className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <Badge className="mb-2 bg-blue-600/20 text-blue-300 border-blue-500/30">
                                        You
                                    </Badge>
                                    <p className="text-gray-300">
                                        Generate a professional email for requesting a project deadline extension.
                                    </p>
                                </div>
                            </div>

                            {/* AI Message */}
                            <div className="flex gap-3">
                                <div className="p-2 rounded-full bg-purple-600/20 h-fit">
                                    <Sparkles className="h-4 w-4 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <Badge className="mb-2 bg-purple-600/20 text-purple-300 border-purple-500/30">
                                        AI Assistant
                                    </Badge>
                                    <p className="text-gray-300">
                                        I'll help you craft a polite and professional email. Here's a template
                                        requesting a deadline extension while maintaining professionalism...
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10">
                                    Copy Response
                                </Button>
                                <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:bg-white/10">
                                    Regenerate
                                </Button>
                            </div>
                        </div>
                    </GlassPanel>
                </motion.div>
            </div>
        </AnimeWorkspaceShell>
    )
}
