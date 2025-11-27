'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassPanelProps {
    children: ReactNode
    className?: string
    hover?: boolean
}

export function GlassPanel({ children, className = '', hover = true }: GlassPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -4, scale: 1.02 } : {}}
            transition={{ duration: 0.3 }}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8_32px_0_rgba(139,92,246,0.2)] ${className}`}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5" />

            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />

            {/* Content */}
            <div className="relative">
                {children}
            </div>
        </motion.div>
    )
}
