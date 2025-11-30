'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { GlassPanel } from '@/components/ui/GlassPanel'
import type { RangerGroup } from '@/types/ranger-groups'

interface RangerGroupCardProps {
    group: RangerGroup
    index: number
}

export function RangerGroupCard({ group, index }: RangerGroupCardProps) {
    // Determine glow color based on group color
    const getGlowColor = (): 'red' | 'cyan' | 'gold' | 'none' => {
        const color = group.color_primary.toLowerCase()
        if (color.includes('#ff003d') || color.includes('255,0,61') || color.includes('red')) return 'red'
        if (color.includes('#00c4ff') || color.includes('0,196,255') || color.includes('cyan') || color.includes('blue')) return 'cyan'
        if (color.includes('#ffc700') || color.includes('255,199,0') || color.includes('gold') || color.includes('yellow')) return 'gold'
        return 'none'
    }

    return (
        <Link href={`/groups/${group.name.replace('_ranger', '')}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
            >
                <GlassPanel 
                    className="relative overflow-hidden h-full"
                    hover={true}
                    glowColor={getGlowColor()}
                >
                    {/* Background gradient with opacity */}
                    <div
                        className="absolute inset-0 opacity-90"
                        style={{
                            background: `linear-gradient(135deg, ${group.color_primary}15 0%, ${group.color_secondary}10 100%)`
                        }}
                    />

                    {/* Subtle glow effect on hover */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(circle at center, ${group.color_primary}40 0%, transparent 70%)`
                        }}
                    />

                    {/* Content */}
                    <div className="relative p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                        {/* Icon */}
                        <motion.div
                            className="mb-6"
                            whileHover={{
                                rotate: [0, -10, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center border border-white/[0.08] bg-white/[0.05] backdrop-blur-sm"
                                style={{
                                    boxShadow: `0 8px 32px ${group.color_primary}20`
                                }}
                            >
                                <Zap
                                    className="h-10 w-10"
                                    style={{ color: group.color_primary }}
                                />
                            </div>
                        </motion.div>

                        {/* Group Name */}
                        <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">
                            {group.display_name}
                        </h3>

                        {/* Tag line */}
                        <p className="text-base mb-4 text-[#B3B3B8] leading-relaxed">
                            {group.tagline}
                        </p>

                        {/* Tool Count */}
                        {group.tool_count !== undefined && (
                            <div className="flex items-center gap-2 text-[#B3B3B8]">
                                <Zap className="h-4 w-4" style={{ color: group.color_primary }} />
                                <span className="text-sm font-medium">
                                    {group.tool_count} {group.tool_count === 1 ? 'tool' : 'tools'}
                                </span>
                            </div>
                        )}

                        {/* Premium badge */}
                        {group.is_premium && (
                            <div className="mt-4">
                                <span className="bg-[#FFC700] text-[#0D0D10] text-xs font-bold px-3 py-1.5 rounded-full border border-[#FFC700]/30">
                                    ⭐ PREMIUM
                                </span>
                            </div>
                        )}
                    </div>
                </GlassPanel>
            </motion.div>
        </Link>
    )
}
