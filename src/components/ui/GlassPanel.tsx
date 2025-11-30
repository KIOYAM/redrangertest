'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassPanelProps {
    children: ReactNode
    className?: string
    hover?: boolean
    glowColor?: 'red' | 'cyan' | 'gold' | 'none'
}

/**
 * Premium glassmorphic panel with professional depth and shadows
 */
export function GlassPanel({ 
    children, 
    className = '', 
    hover = true,
    glowColor = 'none'
}: GlassPanelProps) {
    const getGlowShadow = () => {
        if (glowColor === 'none') return 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
        
        const glows = {
            red: 'shadow-[0_8px_32px_rgba(255,0,61,0.15)]',
            cyan: 'shadow-[0_8px_32px_rgba(0,196,255,0.15)]',
            gold: 'shadow-[0_8px_32px_rgba(255,199,0,0.15)]'
        }
        return glows[glowColor]
    }

    const getBorderGlow = () => {
        if (glowColor === 'none') return ''
        
        const borders = {
            red: 'border-[#FF003D]/20',
            cyan: 'border-[#00C4FF]/20',
            gold: 'border-[#FFC700]/20'
        }
        return borders[glowColor]
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { 
                y: -2, 
                scale: 1.01,
                transition: { duration: 0.2 }
            } : {}}
            transition={{ duration: 0.3 }}
            className={`relative overflow-hidden rounded-xl border ${getBorderGlow() || 'border-white/[0.08]'} bg-[#1A1A22]/80 backdrop-blur-xl ${getGlowShadow()} ${className}`}
        >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative">
                {children}
            </div>
        </motion.div>
    )
}
