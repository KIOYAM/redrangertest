'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Zap, ChevronRight, Search, ArrowLeft,
    Briefcase, GraduationCap, Palette, Heart, Code, Crown
} from 'lucide-react'
import Link from 'next/link'
import { ToolCard } from '@/components/rangers/ToolCard'
import type { RangerGroup, ToolCategory } from '@/types/ranger-groups'

// Icon mapping for dynamic groups
const GROUP_ICONS: Record<string, any> = {
    'red_ranger': Briefcase,
    'blue_ranger': GraduationCap,
    'yellow_ranger': Palette,
    'green_ranger': Heart,
    'black_ranger': Code,
    'white_ranger': Crown
}

interface GroupPageClientProps {
    group: RangerGroup
    tools: ToolCategory[]
}

export function GroupPageClient({ group, tools }: GroupPageClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<'all' | 'featured' | 'popular'>('all')

    const GroupIcon = GROUP_ICONS[group.name] || Zap

    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === 'all' ? true :
            filter === 'featured' ? tool.is_featured : true // 'popular' logic can be added later
        return matchesSearch && matchesFilter
    })

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
            {/* Hero Section with Dynamic Theme */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ background: `linear-gradient(to bottom right, ${group.color_primary}15, #0a0a0a, #0a0a0a)` }}
                    />
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl"
                        style={{ backgroundColor: `${group.color_primary}20` }}
                    />
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl"
                        style={{ backgroundColor: `${group.color_secondary}10` }}
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Breadcrumb & Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            href="/"
                            className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
                            <Link href="/" className="hover:text-white transition">Home</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span style={{ color: group.color_primary }}>{group.display_name}</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
                        <div className="flex items-center space-x-6 mb-6 md:mb-0">
                            <motion.div
                                animate={{ y: [-15, 0, -15] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
                                style={{
                                    background: `linear-gradient(to bottom right, ${group.color_primary}, ${group.color_secondary})`,
                                    boxShadow: `0 25px 50px -12px ${group.color_primary}50`
                                }}
                            >
                                <GroupIcon className="text-white h-10 w-10" />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-bold mb-2" style={{ color: group.color_primary }}>
                                    {group.display_name}
                                </h1>
                                <p className="text-xl text-gray-300 mb-2">{group.tagline}</p>
                                <p className="text-gray-400">
                                    {group.description || 'Power up your work with enterprise-grade prompt tools'}
                                </p>
                            </div>
                        </div>
                        <div
                            className="px-6 py-4 rounded-xl border backdrop-blur-xl bg-white/5"
                            style={{ borderColor: `${group.color_primary}30` }}
                        >
                            <div className="text-center">
                                <p className="text-gray-400 text-sm mb-1">Available Tools</p>
                                <p className="text-3xl font-bold" style={{ color: group.color_primary }}>
                                    {tools.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">

                    {/* Filter/Sort Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg border font-semibold transition-colors ${filter === 'all' ? 'bg-opacity-20' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                style={filter === 'all' ? {
                                    backgroundColor: `${group.color_primary}20`,
                                    color: group.color_primary,
                                    borderColor: `${group.color_primary}30`
                                } : {}}
                            >
                                All Tools
                            </button>
                            <button
                                onClick={() => setFilter('featured')}
                                className={`px-4 py-2 rounded-lg border font-semibold transition-colors ${filter === 'featured' ? 'bg-opacity-20' : 'bg-white/5 border-white/10 text-gray-400'}`}
                                style={filter === 'featured' ? {
                                    backgroundColor: `${group.color_primary}20`,
                                    color: group.color_primary,
                                    borderColor: `${group.color_primary}30`
                                } : {}}
                            >
                                Featured
                            </button>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
                            <Search className="text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search tools..."
                                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-48 focus:ring-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tools Grid */}
                    {filteredTools.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No tools found matching your search.</p>
                            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTools.map((tool) => (
                                <ToolCard
                                    key={tool.tool_name}
                                    tool={tool}
                                    groupColor={group.color_primary}
                                    groupName={group.name}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        className="rounded-3xl p-12 border backdrop-blur-xl bg-white/5"
                        style={{ borderColor: `${group.color_primary}20` }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: group.color_primary }}>
                            Need More Energy?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Recharge your Morphin Energy to unlock unlimited access to all {group.display_name} tools.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/pricing"
                                className="w-full sm:w-auto px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105 text-white"
                                style={{
                                    background: `linear-gradient(to right, ${group.color_primary}, ${group.color_secondary})`,
                                    boxShadow: `0 10px 30px -10px ${group.color_primary}50`
                                }}
                            >
                                Recharge Energy
                            </Link>
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-lg text-lg font-semibold hover:bg-white/10 transition text-white"
                            >
                                Explore Other Rangers
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Zap className="text-white h-5 w-5" />
                                </div>
                                <span className="text-xl font-bold text-white">RedRanger</span>
                            </div>
                            <p className="text-gray-400">AI-powered prompt generation platform</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Rangers</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/groups/red" className="hover:text-white transition">Red Ranger</Link></li>
                                <li><Link href="/groups/blue" className="hover:text-white transition">Blue Ranger</Link></li>
                                <li><Link href="/groups/yellow" className="hover:text-white transition">Yellow Ranger</Link></li>
                                <li><Link href="/groups/green" className="hover:text-white transition">Green Ranger</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Resources</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
                                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Support</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 RedRanger. All rights reserved. We generate prompts, not final products.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
