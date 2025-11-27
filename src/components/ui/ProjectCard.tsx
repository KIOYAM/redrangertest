'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { GlassPanel } from './GlassPanel'

interface ProjectCardProps {
    project: {
        id: string
        title: string
        description?: string
        updated_at: string
        message_count?: number
    }
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.id}/workspace`}>
            <GlassPanel className="group cursor-pointer">
                <div className="p-6">
                    {/* Title with gradient */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        {project.title}
                    </h3>

                    {/* Description */}
                    {project.description && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {project.description}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(project.updated_at), 'MMM d, yyyy')}</span>
                        </div>

                        {project.message_count !== undefined && (
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{project.message_count} messages</span>
                            </div>
                        )}
                    </div>

                    {/* Hover glow effect */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 70%)',
                        }}
                    />
                </div>
            </GlassPanel>
        </Link>
    )
}
