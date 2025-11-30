'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientBackgroundWrapperProps {
    children: ReactNode
    variant?: 'default' | 'purple' | 'blue' | 'teal' | 'cyan'
}

export function GradientBackgroundWrapper({
    children,
    variant = 'default'
}: GradientBackgroundWrapperProps) {
    const getGradient = () => {
        switch (variant) {
            case 'purple':
                return 'from-purple-900/20 via-black to-purple-900/20'
            case 'blue':
                return 'from-blue-900/20 via-black to-blue-900/20'
            case 'teal':
                return 'from-teal-900/20 via-black to-teal-900/20'
            case 'cyan':
                return 'from-cyan-900/20 via-black to-cyan-900/20'
            default:
                return 'from-gray-900/20 via-black to-gray-900/20'
        }
    }

    const getAccentColor = () => {
        switch (variant) {
            case 'purple':
                return 'rgba(139, 92, 246, 0.15)'
            case 'blue':
                return 'rgba(59, 130, 246, 0.15)'
            case 'teal':
                return 'rgba(20, 184, 166, 0.15)'
            case 'cyan':
                return 'rgba(6, 182, 212, 0.15)'
            default:
                return 'rgba(100, 100, 100, 0.15)'
        }
    }

    return (
        <div className={`relative min-h-screen bg-gradient-to-br ${getGradient()}`}>
            {/* Animated orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl"
                    style={{ background: getAccentColor() }}
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl"
                    style={{ background: getAccentColor() }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
