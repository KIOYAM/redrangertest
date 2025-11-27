'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface FloatingCreateButtonProps {
    onClick: () => void
    label?: string
}

export function FloatingCreateButton({ onClick, label = 'Create New' }: FloatingCreateButtonProps) {
    return (
        <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:shadow-[0_0_50px_rgba(139,92,246,0.8)]"
        >
            {/* Animated pulse ring */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-purple-400"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Content */}
            <div className="relative flex items-center gap-2 text-white font-semibold">
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    <Plus className="h-5 w-5" />
                </motion.div>
                <span>{label}</span>
            </div>
        </motion.button>
    )
}
