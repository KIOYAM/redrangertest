'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientBackgroundWrapperProps {
    children: ReactNode
    variant?: 'default' | 'purple' | 'blue' | 'teal'
}

export function GradientBackgroundWrapper({
    children,
    variant = 'default'
}: GradientBackgroundWrapperProps) {
    const gradients = {
        default: 'from-gray-950 via-gray-900 to-black',
        purple: 'from-purple-950 via-gray-900 to-black',
        blue: 'from-blue-950 via-gray-900 to-black',
        teal: 'from-teal-950 via-gray-900 to-black'
    }

    return (
        <div className={`relative min-h-screen bg-gradient-to-br ${gradients[variant]} overflow-hidden`}>
            {/* Animated gradient orbs */}
            <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"
                animate={{
                    x: [-50, 50, -50],
                    y: [-50, 50, -50],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
