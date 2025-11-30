'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
    title: string
    description?: string
    icon?: LucideIcon
    iconColor?: 'red' | 'cyan' | 'gold'
    className?: string
    children?: ReactNode
}

/**
 * Professional page header with strong typography and clean design
 */
export function PageHeader({ 
    title, 
    description, 
    icon: Icon,
    iconColor = 'red',
    className = '',
    children
}: PageHeaderProps) {
    const iconConfig = {
        red: {
            bg: 'bg-[#FF003D]/10',
            icon: 'text-[#FF003D]',
            gradient: 'from-[#FF003D] via-[#FF4D6D] to-[#FF003D]'
        },
        cyan: {
            bg: 'bg-[#00C4FF]/10',
            icon: 'text-[#00C4FF]',
            gradient: 'from-[#00C4FF] via-[#4DD4FF] to-[#00C4FF]'
        },
        gold: {
            bg: 'bg-[#FFC700]/10',
            icon: 'text-[#FFC700]',
            gradient: 'from-[#FFC700] via-[#FFD84D] to-[#FFC700]'
        }
    }

    const config = iconConfig[iconColor]

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-16 text-center ${className}`}
        >
            {Icon && (
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                    className="mb-6 inline-flex"
                >
                    <div className={`rounded-2xl ${config.bg} p-4 border border-white/[0.08] shadow-lg`}>
                        <Icon className={`h-8 w-8 ${config.icon}`} />
                    </div>
                </motion.div>
            )}

            <h1 className={`text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${config.gradient}`}>
                {title}
            </h1>

            {description && (
                <p className="text-[#B3B3B8] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            )}

            {children}
        </motion.div>
    )
}

