'use client'

import { ArrowLeft, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/types/project'
import { Button } from '@/components/ui/button'

interface ProjectHeaderProps {
    project: Project
    onClearMemory: () => void
}

export function ProjectHeader({ project, onClearMemory }: ProjectHeaderProps) {
    const router = useRouter()

    return (
        <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{project.title}</h1>
                        {project.description && (
                            <p className="text-sm text-gray-600">{project.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onClearMemory}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Memory
                    </Button>
                </div>
            </div>
        </div>
    )
}
