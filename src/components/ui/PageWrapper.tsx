'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageWrapperProps {
    children: ReactNode
    variant?: 'default' | 'dark' | 'gradient' | 'light'
    gradientVariant?: 'red' | 'cyan' | 'gold'
    className?: string
}

/**
 * Professional page wrapper with clean dark theme and subtle Power Rangers energy
 */
export function PageWrapper({ 
    children, 
    variant = 'dark',
    gradientVariant = 'red',
    className = ''
}: PageWrapperProps) {
    const getBackgroundClasses = () => {
        switch (variant) {
            case 'light':
                return 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
            case 'gradient':
                const gradients = {
                    red: 'from-[#0D0D10] via-[#1A0D15] to-[#0D0D10]',
                    cyan: 'from-[#0D0D10] via-[#0D151A] to-[#0D0D10]',
                    gold: 'from-[#0D0D10] via-[#1A150D] to-[#0D0D10]'
                }
                return `bg-gradient-to-br ${gradients[gradientVariant]}`
            case 'dark':
            default:
                return 'bg-[#0D0D10]'
        }
    }

    const getAccentGlow = () => {
        if (variant !== 'gradient') return 'rgba(255, 0, 61, 0.03)'
        
        const glows = {
            red: 'rgba(255, 0, 61, 0.05)',
            cyan: 'rgba(0, 196, 255, 0.05)',
            gold: 'rgba(255, 199, 0, 0.05)'
        }
        return glows[gradientVariant]
    }

    return (
        <div className={`relative min-h-screen ${getBackgroundClasses()} ${className}`}>
            {/* Subtle radial glow for depth */}
            {(variant === 'gradient' || variant === 'dark') && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full blur-3xl"
                        style={{ background: getAccentGlow() }}
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

