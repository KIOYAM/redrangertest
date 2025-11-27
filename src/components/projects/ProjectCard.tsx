'use client'

import { motion } from 'framer-motion'
import { Folder, Calendar, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/types/project'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter()
    const [stats, setStats] = useState({ messageCount: 0 })

    useEffect(() => {
        fetch(`/api/projects/${project.id}/memory?limit=1`)
            .then(res => res.json())
            .then(data => {
                if (data.memory) {
                    fetch(`/api/projects/${project.id}/memory?limit=100`)
                        .then(res => res.json())
                        .then(fullData => {
                            setStats({ messageCount: fullData.memory?.length || 0 })
                        })
                }
            })
            .catch(() => { })
    }, [project.id])

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/projects/${project.id}/workspace`)}
            className="cursor-pointer"
        >
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                            <Folder className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{project.title}</h3>
                            {project.description && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{project.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{stats.messageCount} messages</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
