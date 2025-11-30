'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
    title: string
    description?: string
    icon?: LucideIcon
    iconColor?: string
    className?: string
    children?: ReactNode
}

/**
 * Consistent page header component for all pages
 */
export function PageHeader({ 
    title, 
    description, 
    icon: Icon,
    iconColor = 'text-purple-400',
    className = '',
    children
}: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-12 text-center ${className}`}
        >
            {Icon && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="mb-4 inline-flex"
                >
                    <div className={`rounded-full bg-gradient-to-r p-4 shadow-lg ${
                        iconColor.includes('red') || iconColor.includes('yellow') 
                            ? 'from-red-600/20 to-yellow-600/20' 
                            : iconColor.includes('green') || iconColor.includes('emerald')
                            ? 'from-green-600/20 to-emerald-600/20'
                            : iconColor.includes('cyan')
                            ? 'from-cyan-600/20 to-blue-600/20'
                            : 'from-purple-600/20 to-blue-600/20'
                    }`}>
                        <Icon className={`h-8 w-8 ${iconColor}`} />
                    </div>
                </motion.div>
            )}

            <h1 className={`text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent ${
                iconColor.includes('red') || iconColor.includes('yellow')
                    ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-red-500'
                    : iconColor.includes('cyan')
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'
                    : 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400'
            }`}>
                {title}
            </h1>

            {description && (
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    {description}
                </p>
            )}

            {children}
        </motion.div>
    )
}

