'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ToolCardProps {
    icon: LucideIcon
    title: string
    description: string
    tags: string[]
    onClick: () => void
}

export function ToolCard({ icon: Icon, title, description, tags, onClick }: ToolCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="relative group cursor-pointer"
        >
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                    {/* Icon with float animation on hover */}
                    <motion.div
                        whileHover={{ y: -2 }}
                        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md"
                    >
                        <Icon className="h-6 w-6" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                        {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs font-medium"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
