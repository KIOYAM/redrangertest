'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { PageHeader } from '@/components/ui/PageHeader'
import { useRouter } from 'next/navigation'
import { LiquidEnergyVisualizer } from '@/components/admin/LiquidEnergyVisualizer'
import type { CreditStats } from '@/types/credits'

export default function MyEnergyPage() {
    const [credits, setCredits] = useState<CreditStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchCredits()
    }, [])

    const fetchCredits = async () => {
        try {
            const response = await fetch('/api/credits/balance')
            if (response.ok) {
                const data = await response.json()
                setCredits(data.stats)
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <PageWrapper variant="gradient" gradientVariant="red">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-600"></div>
                        <p className="text-gray-400 mt-4">Loading your energy...</p>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    const balance = credits?.balance || 0
    const totalEarned = credits?.total_earned || 0
    const totalSpent = credits?.total_spent || 0
    const percentageRemaining = credits?.percentage_remaining || 0

    return (
        <PageWrapper variant="gradient" gradientVariant="red">
            <div className="max-w-6xl mx-auto px-4 py-12 pt-32">
                {/* Header */}
                <PageHeader
                    title="⚡ My Morphin Energy ⚡"
                    description="Power up your AI tools with energy"
                    icon={Zap}
                    iconColor="gold"
                />

                {/* Main Energy Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Liquid Visualizer */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <LiquidEnergyVisualizer amount={balance} maxAmount={totalEarned || 1000} />
                        <div className="mt-6 text-center">
                            <div className="text-4xl font-bold text-white mb-2">
                                {percentageRemaining.toFixed(1)}%
                            </div>
                            <div className="text-gray-400">Energy Remaining</div>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        {/* Current Balance */}
                        <GlassPanel className="bg-gradient-to-br from-red-950/50 to-red-900/50 border-red-600/50 p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-red-600 p-3 rounded-lg">
                                    <Zap className="h-6 w-6 text-yellow-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-red-200">Current Balance</div>
                                    <div className="text-3xl font-bold text-white">
                                        {balance.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentageRemaining}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </GlassPanel>

                        {/* Total Earned */}
                        <GlassPanel className="bg-gradient-to-br from-green-950/50 to-green-900/50 border-green-600/50 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-6 w-6 text-green-400" />
                                    <div>
                                        <div className="text-sm text-green-200">Total Earned</div>
                                        <div className="text-2xl font-bold text-white">
                                            {totalEarned.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Total Spent */}
                        <GlassPanel className="bg-gradient-to-br from-orange-950/50 to-orange-900/50 border-orange-600/50 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TrendingDown className="h-6 w-6 text-orange-400" />
                                    <div>
                                        <div className="text-sm text-orange-200">Total Used</div>
                                        <div className="text-2xl font-bold text-white">
                                            {totalSpent.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Recharge Button */}
                        <Button
                            onClick={() => router.push('/pricing')}
                            className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white py-6 text-lg font-bold"
                        >
                            <Zap className="mr-2 h-5 w-5" />
                            Recharge Energy
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                </div>

                {/* Energy Usage Info */}
                <GlassPanel className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-yellow-400" />
                        How Energy Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Use AI Tools</h3>
                            <p className="text-gray-400 text-sm">
                                Each AI tool requires Morphin Energy to generate prompts
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Energy Costs</h3>
                            <p className="text-gray-400 text-sm">
                                Different tools use different amounts (5-15 energy per use)
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Recharge</h3>
                            <p className="text-gray-400 text-sm">
                                Buy more Energy Cells when you run low to keep using tools
                            </p>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </PageWrapper>
    )
}
