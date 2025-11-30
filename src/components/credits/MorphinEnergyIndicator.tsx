'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { CreditStats } from '@/types/credits'

interface MorphinEnergyIndicatorProps {
    userId?: string
    showDetails?: boolean
}

export function MorphinEnergyIndicator({ userId, showDetails = true }: MorphinEnergyIndicatorProps) {
    const [credits, setCredits] = useState<CreditStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!userId) {
            setIsLoading(false)
            return
        }
        fetchCredits()
    }, [userId])

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

    // Don't show if no userId, still loading, no credits data, or invalid structure
    if (!userId || isLoading || !credits || typeof credits.balance !== 'number') {
        return null
    }

    const isLow = credits.percentage_remaining < 20
    const isCritical = credits.percentage_remaining < 10

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative overflow-hidden rounded-lg border-2 ${isCritical ? 'border-red-500 bg-red-950/50' :
                isLow ? 'border-yellow-500 bg-yellow-950/30' :
                    'border-red-600 bg-gradient-to-r from-red-600 to-red-700'
                } px-4 py-2 shadow-lg`}
        >
            {/* Animated background effect */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
                    animate={{
                        x: ['-100%', '200%']
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                />
            </div>

            <div className="relative flex items-center gap-3">
                {/* Icon */}
                <div className="relative">
                    {isCritical ? (
                        <Flame className="h-6 w-6 text-red-400 animate-pulse" />
                    ) : isLow ? (
                        <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
                    ) : (
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                        >
                            {Math.round(credits.percentage_remaining)}%
                        </div>
                        <div className="relative h-2 bg-gray-900/50 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${isCritical ? 'bg-red-500' :
                                    isLow ? 'bg-yellow-500' :
                                        'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400'
                                    }`}
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${credits.percentage_remaining}%`,
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                }}
                                transition={{
                                    width: { duration: 0.5 },
                                    backgroundPosition: { duration: 3, repeat: Infinity }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Recharge Button */}
                <Button
                    size="sm"
                    variant={isCritical ? "destructive" : isLow ? "secondary" : "ghost"}
                    className={`${isCritical || isLow ? 'animate-pulse' : ''
                        } text-white hover:bg-white/20`}
                    onClick={() => router.push('/pricing')}
                >
                    {isCritical ? '🚨 Recharge!' : isLow ? '⚡ Low!' : 'Recharge'}
                </Button>
            </div>

            {/* Low Energy Warning */}
            {isLow && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-yellow-200 flex items-center gap-1"
                >
                    <TrendingUp className="h-3 w-3" />
                    {isCritical ? 'Critical! Recharge now to continue' : 'Running low on energy'}
                </motion.div>
            )}
        </motion.div>
    )
}
