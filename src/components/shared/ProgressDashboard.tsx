'use client'

import { motion } from 'framer-motion'
import { Check, Circle, Loader2, Clock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { ProjectPhase } from '@/types/wizard'

interface ProgressDashboardProps {
    phases: ProjectPhase[]
    currentPhase: string
    overallProgress: number
    estimatedCompletion?: string
}

export function ProgressDashboard({
    phases,
    currentPhase,
    overallProgress,
    estimatedCompletion
}: ProgressDashboardProps) {
    const getPhaseIcon = (status: ProjectPhase['status']) => {
        switch (status) {
            case 'completed':
                return <Check className="h-5 w-5 text-green-600" />
            case 'in_progress':
                return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            case 'pending':
                return <Circle className="h-5 w-5 text-gray-400" />
        }
    }

    const getPhaseColor = (status: ProjectPhase['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 border-green-500'
            case 'in_progress':
                return 'bg-blue-100 border-blue-500'
            case 'pending':
                return 'bg-gray-100 border-gray-300'
        }
    }

    return (
        <div className="space-y-6">
            {/* Overall Progress Header */}
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold">Project Progress</h3>
                        <p className="mt-1 text-blue-100">
                            {currentPhase}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">
                            {Math.round(overallProgress)}%
                        </div>
                        <p className="text-sm text-blue-100">Complete</p>
                    </div>
                </div>

                <div className="relative h-3 overflow-hidden rounded-full bg-white/20">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>

                {estimatedCompletion && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
                        <Clock className="h-4 w-4" />
                        <span>Estimated completion: {estimatedCompletion}</span>
                    </div>
                )}
            </div>

            {/* Phases List */}
            <div className="space-y-4">
                {phases.map((phase, index) => (
                    <motion.div
                        key={phase.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-lg border-2 p-4 ${getPhaseColor(phase.status)}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                {getPhaseIcon(phase.status)}
                                <div>
                                    <h4 className="font-semibold text-gray-900">{phase.name}</h4>
                                    {phase.estimatedDuration && (
                                        <p className="text-sm text-gray-600">
                                            Duration: {phase.estimatedDuration}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Badge variant={
                                phase.status === 'completed' ? 'default' :
                                    phase.status === 'in_progress' ? 'secondary' :
                                        'outline'
                            }>
                                {phase.status === 'completed' ? 'Done' :
                                    phase.status === 'in_progress' ? 'Active' :
                                        'Pending'}
                            </Badge>
                        </div>

                        {/* Phase Progress */}
                        {phase.status !== 'pending' && (
                            <div className="mt-4">
                                <div className="mb-2 flex justify-between text-sm text-gray-600">
                                    <span>Tasks Progress</span>
                                    <span>{Math.round(phase.completionRate)}%</span>
                                </div>
                                <Progress value={phase.completionRate} className="h-2" />
                            </div>
                        )}

                        {/* Tasks List (for in-progress phase) */}
                        {phase.status === 'in_progress' && phase.tasks.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {phase.tasks.map((task, taskIdx) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        {task.status === 'completed' ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : task.status === 'in_progress' ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-gray-400" />
                                        )}
                                        <span className={
                                            task.status === 'completed'
                                                ? 'text-gray-600 line-through'
                                                : 'text-gray-900'
                                        }>
                                            {task.description}
                                        </span>
                                        {task.estimatedTime && task.status === 'pending' && (
                                            <span className="ml-auto text-xs text-gray-500">
                                                ~{task.estimatedTime}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
