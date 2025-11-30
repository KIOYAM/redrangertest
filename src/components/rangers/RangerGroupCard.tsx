'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import type { RangerGroup } from '@/types/ranger-groups'

interface RangerGroupCardProps {
    group: RangerGroup
    index: number
}

export function RangerGroupCard({ group, index }: RangerGroupCardProps) {
    const isLightText = group.name === 'white_ranger'

    return (
        <Link href={`/groups/${group.name.replace('_ranger', '')}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative cursor-pointer"
            >
                <div className="relative overflow-hidden rounded-3xl border-2 border-transparent hover:border-white/20 transition-all duration-300 h-full">
                    {/* Background gradient */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${group.gradient_class}`}
                        style={{
                            background: `linear-gradient(135deg, ${group.color_primary} 0%, ${group.color_secondary} 100%)`
                        }}
                    />

                    {/* Animated energy effect */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20"
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%']
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: 'reverse'
                        }}
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}
                    />

                    {/* Glow effect on hover */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"
                        style={{
                            background: `radial-gradient(circle at center, ${group.color_primary} 0%, transparent 70%)`
                        }}
                    />

                    {/* Content */}
                    <div className="relative p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                        {/* Helmet Icon placeholder (animated) */}
                        <motion.div
                            className="mb-6"
                            whileHover={{
                                rotate: [0, -10, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <div
                                className={`w-24 h-24 rounded-full flex items-center justify-center ${isLightText ? 'bg-gray-800' : 'bg-white/20'
                                    }`}
                            >
                                <Zap
                                    className="h-12 w-12"
                                    style={{ color: isLightText ? group.color_primary : 'white' }}
                                />
                            </div>
                        </motion.div>

                        {/* Group Name */}
                        <h3 className={`text-4xl font-bold mb-3 ${isLightText ? 'text-gray-900' : 'text-white'}`}>
                            {group.display_name}
                        </h3>

                        {/* Tag line */}
                        <p className={`text-base mb-4 ${isLightText ? 'text-gray-700' : 'text-white/80'}`}>
                            {group.tagline}
                        </p>

                        {/* Tool Count */}
                        {group.tool_count !== undefined && (
                            <div className={`flex items-center gap-2 ${isLightText ? 'text-gray-600' : 'text-white/60'}`}>
                                <Zap className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {group.tool_count} {group.tool_count === 1 ? 'tool' : 'tools'}
                                </span>
                            </div>
                        )}

                        {/* Premium badge */}
                        {group.is_premium && (
                            <div className="mt-4">
                                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                    ⭐ PREMIUM
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Hover indicator */}
                    <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-1 ${isLightText ? 'bg-gray-900' : 'bg-white'}`}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </motion.div>
        </Link>
    )
}
