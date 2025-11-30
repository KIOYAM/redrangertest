'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageWrapperProps {
    children: ReactNode
    variant?: 'default' | 'dark' | 'gradient' | 'light'
    gradientVariant?: 'purple' | 'blue' | 'red' | 'teal' | 'cyan'
    className?: string
}

/**
 * Unified page wrapper component for consistent layout across all pages
 * Maintains theme variables while providing modern UI enhancements
 */
export function PageWrapper({ 
    children, 
    variant = 'dark',
    gradientVariant = 'purple',
    className = ''
}: PageWrapperProps) {
    const getBackgroundClasses = () => {
        switch (variant) {
            case 'light':
                return 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
            case 'gradient':
                const gradients = {
                    purple: 'from-purple-900/20 via-black to-purple-900/20',
                    blue: 'from-blue-900/20 via-black to-blue-900/20',
                    red: 'from-red-950/30 via-black to-red-950/30',
                    teal: 'from-teal-900/20 via-black to-teal-900/20',
                    cyan: 'from-cyan-900/20 via-black to-cyan-900/20'
                }
                return `bg-gradient-to-br ${gradients[gradientVariant]}`
            case 'dark':
            default:
                return 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
        }
    }

    const getAccentColor = () => {
        if (variant !== 'gradient') return 'rgba(100, 100, 100, 0.1)'
        
        const colors = {
            purple: 'rgba(139, 92, 246, 0.15)',
            blue: 'rgba(59, 130, 246, 0.15)',
            red: 'rgba(220, 38, 38, 0.15)',
            teal: 'rgba(20, 184, 166, 0.15)',
            cyan: 'rgba(6, 182, 212, 0.15)'
        }
        return colors[gradientVariant]
    }

    return (
        <div className={`relative min-h-screen ${getBackgroundClasses()} ${className}`}>
            {/* Animated background effects for gradient and dark variants */}
            {(variant === 'gradient' || variant === 'dark') && (
                <>
                    {/* Animated orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                </>
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

