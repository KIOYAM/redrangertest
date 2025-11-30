'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Zap, Briefcase, GraduationCap, Palette, Heart, Code, Crown,
    ArrowRight, Plus, Flame, Star
} from 'lucide-react'
import type { RangerGroup } from '@/types/ranger-groups'
import { LiquidEnergy } from '@/components/dashboard/LiquidEnergy'

// Icon mapping for dynamic groups
const ICON_MAP: Record<string, any> = {
    'red_ranger': Briefcase,
    'blue_ranger': GraduationCap,
    'yellow_ranger': Palette,
    'green_ranger': Heart,
    'black_ranger': Code,
    'white_ranger': Crown
}

interface DashboardClientProps {
    groups: RangerGroup[]
    userCredits: any
    recentActivity: any[]
    totalPrompts: number
}

export function DashboardClient({ groups, userCredits, recentActivity, totalPrompts }: DashboardClientProps) {
    // Default values if credits are missing
    const balance = userCredits?.balance ?? 0
    const totalEarned = userCredits?.total_earned ?? 0
    const totalSpent = userCredits?.total_spent ?? 0
    const maxEnergy = userCredits?.max_capacity ?? 100

    return (
        <div className="p-4 max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>Welcome Back, Ranger!</h1>
                        <p className="text-sm text-gray-400">Ready to generate some powerful prompts?</p>
                    </div>
                    <Link href="/prompt-builder" className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center text-sm">
                        <Plus className="mr-2 h-4 w-4" /> New Prompt
                    </Link>
                </div>
            </div>

            {/* Energy Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

                {/* Liquid Energy Visualizer */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold mb-0.5 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>Morphin Energy</h2>
                            <p className="text-xs text-gray-400">Your current power level</p>
                        </div>
                        <Link href="/pricing" className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-red-600 rounded-md hover:from-yellow-600 hover:to-red-700 transition-all font-semibold text-xs text-white flex items-center">
                            <Zap className="mr-1.5 h-3.5 w-3.5" /> Recharge
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Liquid Container */}
                        <LiquidEnergy current={balance} max={maxEnergy} />

                        {/* Stats */}
                        <div className="flex-1 space-y-3 w-full">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs text-gray-400">Total Earned</span>
                                    <span className="font-bold text-green-400 text-sm" style={{ fontFamily: 'var(--font-orbitron)' }}>+{totalEarned} ⚡</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs text-gray-400">Total Used</span>
                                    <span className="font-bold text-red-400 text-sm" style={{ fontFamily: 'var(--font-orbitron)' }}>-{totalSpent} ⚡</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full" style={{ width: `${Math.min((totalSpent / (totalEarned || 1)) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                                <Flame className="text-white h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-semibold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                        <div className="text-2xl font-bold mb-0.5 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>{totalPrompts}</div>
                        <div className="text-xs text-gray-400">Prompts Generated</div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center">
                                <Star className="text-white h-5 w-5" />
                            </div>
                            {totalPrompts > 0 && <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">Top 10%</span>}
                        </div>
                        <div className="text-2xl font-bold mb-0.5 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                            {totalPrompts > 0 ? '8.4' : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Avg. Quality Score</div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Access Rangers */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>Quick Access</h2>
                    <Link href="/rangers" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center">
                        View All <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {groups.slice(0, 4).map((group) => {
                        const Icon = ICON_MAP[group.name] || Zap
                        return (
                            <Link key={group.id} href={`/groups/${group.name.replace('_ranger', '')}`}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition-all group"
                                >
                                    <div
                                        className="w-10 h-10 rounded-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                                        style={{ backgroundColor: `${group.color_primary}33` }}
                                    >
                                        <Icon className="h-5 w-5" style={{ color: group.color_primary }} />
                                    </div>
                                    <h3 className="font-bold text-base mb-0.5" style={{ fontFamily: 'var(--font-orbitron)', color: group.color_primary }}>
                                        {group.display_name}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 mb-2">{group.tagline}</p>
                                    <div className="text-[10px] text-gray-500">{group.tool_count || 0} Tools Available</div>
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>Recent Activity</h2>
                    <Link href="/history" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center">
                        View All <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/10 bg-white/5">
                                <tr>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-400">Tool</th>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-400">Ranger</th>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-400">Energy Used</th>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-400">Date</th>
                                    <th className="text-left p-3 text-xs font-semibold text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentActivity.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Zap className="w-12 h-12 text-gray-600 mb-3" />
                                                <p className="text-sm">No activity yet</p>
                                                <p className="text-xs mt-1">Start generating prompts to see your history here!</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    recentActivity.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 bg-purple-600/20 rounded-md flex items-center justify-center">
                                                        <Zap className="text-purple-500 h-3 w-3" />
                                                    </div>
                                                    <span className="font-medium text-sm text-white truncate max-w-[200px]">{activity.tool_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-xs text-gray-400 font-semibold">-</span>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-bold text-yellow-400 text-xs" style={{ fontFamily: 'var(--font-orbitron)' }}>⚡ {activity.credits_used}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-xs text-gray-400">
                                                    {new Date(activity.created_at).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {activity.success ? (
                                                    <span className="text-xs text-green-400">✓ Success</span>
                                                ) : (
                                                    <span className="text-xs text-red-400">✗ Failed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}
