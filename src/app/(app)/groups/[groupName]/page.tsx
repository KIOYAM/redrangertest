'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { motion } from 'framer-motion'
import { Zap, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ToolCard } from '@/components/rangers/ToolCard'
import type { RangerGroup, ToolCategory } from '@/types/ranger-groups'

export default function GroupPage({ params }: { params: Promise<{ groupName: string }> }) {
    const { groupName } = use(params)
    const [group, setGroup] = useState<RangerGroup | null>(null)
    const [tools, setTools] = useState<ToolCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchGroupData()
    }, [groupName])

    const fetchGroupData = async () => {
        try {
            const response = await fetch(`/api/ranger-groups/${groupName}_ranger`)
            if (response.ok) {
                const data = await response.json()
                setGroup(data.group)
                setTools(data.tools || [])
            }
        } catch (error) {
            console.error('Failed to fetch group data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <PageWrapper variant="dark">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-600"></div>
                        <p className="text-gray-400 mt-4">Loading...</p>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    if (!group) {
        return (
            <PageWrapper variant="dark">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Group Not Found</h1>
                        <Link href="/" className="text-red-500 hover:text-red-400">
                            Return Home
                        </Link>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    const isLightText = group.name === 'white_ranger'

    return (
        <PageWrapper variant="dark">
            <div
                className="min-h-screen"
                style={{
                    background: `linear-gradient(135deg, ${group.color_primary}15 0%, rgba(0,0,0,1) 50%, ${group.color_secondary}10 100%)`
                }}
            >
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white">{group.display_name}</span>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="relative py-16">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row items-center gap-8"
                        >
                            {/* Group Icon */}
                            <motion.div
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity
                                }}
                                className="shrink-0"
                            >
                                <div
                                    className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${group.color_primary} 0%, ${group.color_secondary} 100%)`,
                                        boxShadow: `0 20px 50px ${group.color_primary}40`
                                    }}
                                >
                                    <Zap className="h-16 w-16 text-yellow-400" />
                                </div>
                            </motion.div>

                            {/* Group Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-6xl md:text-7xl font-bold mb-4" style={{ color: group.color_primary }}>
                                    {group.display_name}
                                </h1>
                                <p className="text-2xl text-gray-300 mb-2">{group.tagline}</p>
                                {group.description && (
                                    <p className="text-gray-500">{group.description}</p>
                                )}
                                <div className="mt-4 flex items-center gap-3 justify-center md:justify-start">
                                    <span className="text-gray-400 text-sm">
                                        {tools.length} {tools.length === 1 ? 'tool' : 'tools'} available
                                    </span>
                                    {group.is_premium && (
                                        <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                            ⭐ PREMIUM
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Tools Grid */}
                <section className="py-12 pb-20">
                    <div className="container mx-auto px-4">
                        {tools.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">No tools available in this group yet.</p>
                                <p className="text-gray-500 text-sm mt-2">Check back soon for new tools!</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-white mb-8">Available Tools</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tools.map((tool) => (
                                        <ToolCard
                                            key={tool.tool_name}
                                            tool={tool}
                                            groupColor={group.color_primary}
                                            groupName={group.name}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </PageWrapper>
    )
}
