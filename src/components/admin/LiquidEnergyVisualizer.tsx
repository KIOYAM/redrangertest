'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LiquidEnergyVisualizerProps {
    amount: number
    maxAmount?: number
}

export function LiquidEnergyVisualizer({ amount, maxAmount = 1000 }: LiquidEnergyVisualizerProps) {
    const [bubbles, setBubbles] = useState<{ id: number; x: number; delay: number; duration: number }[]>([])

    // Calculate fill percentage
    const fillPercentage = Math.min((amount / maxAmount) * 100, 100)

    // Generate bubbles only client-side to avoid hydration mismatch
    useEffect(() => {
        const newBubbles = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            x: Math.random() * 80 + 10,
            delay: Math.random() * 2,
            duration: 3 + Math.random() * 2
        }))
        setBubbles(newBubbles)
    }, [amount])

    return (
        <div className="relative w-full h-64 bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-red-600/30">
            {/* Liquid Container */}
            <div className="absolute inset-0">
                {/* Liquid Fill */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 via-red-500 to-yellow-500"
                    initial={{ height: '0%' }}
                    animate={{ height: `${fillPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    {/* Wave Effect */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-8"
                        animate={{
                            transform: ['translateX(0%) scaleY(1)', 'translateX(-50%) scaleY(1.1)', 'translateX(-100%) scaleY(1)']
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            filter: 'blur(2px)'
                        }}
                    />

                    {/* Second Wave (opposite direction) */}
                    <motion.div
                        className="absolute top-2 left-0 right-0 h-6"
                        animate={{
                            transform: ['translateX(-100%) scaleY(1)', 'translateX(-50%) scaleY(1.15)', 'translateX(0%) scaleY(1)']
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            filter: 'blur(3px)'
                        }}
                    />

                    {/* Bubbles */}
                    {bubbles.map((bubble) => (
                        <motion.div
                            key={bubble.id}
                            className="absolute w-3 h-3 bg-white/40 rounded-full"
                            style={{
                                left: `${bubble.x}%`,
                                bottom: 0
                            }}
                            animate={{
                                y: [0, -250],
                                opacity: [0, 0.6, 0.8, 0],
                                scale: [0.5, 1, 0.8, 0.3]
                            }}
                            transition={{
                                duration: bubble.duration,
                                delay: bubble.delay,
                                repeat: Infinity,
                                ease: 'easeOut'
                            }}
                        />
                    ))}

                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                            x: ['-100%', '200%']
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                </motion.div>
            </div>

            {/* Amount Display */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="text-center"
                >
                    <div className="text-6xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                        {amount.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-yellow-200 drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
                        Morphin Energy
                    </div>
                </motion.div>
            </div>

            {/* Glow effect at top */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-yellow-500/20 to-transparent"
                animate={{
                    opacity: fillPercentage > 70 ? [0.3, 0.6, 0.3] : 0
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity
                }}
            />
        </div>
    )
}
