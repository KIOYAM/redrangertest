'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, XCircle, HelpCircle, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { TaskOutcome } from '@/types/wizard'
import { toast } from 'sonner'

interface OutcomeTrackerProps {
    taskId: string
    taskDescription: string
    aiToolUsed?: string
    projectId: string
    toolName: string
    onSubmit: (outcome: TaskOutcome) => Promise<void>
    enableErrorUpload?: boolean
    suggestNextSteps?: boolean
}

export function OutcomeTracker({
    taskId,
    taskDescription,
    aiToolUsed,
    projectId,
    toolName,
    onSubmit,
    enableErrorUpload = true,
    suggestNextSteps = true
}: OutcomeTrackerProps) {
    const [status, setStatus] = useState<TaskOutcome['status'] | null>(null)
    const [feedback, setFeedback] = useState('')
    const [errorDetails, setErrorDetails] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!status) {
            toast.error('Please select an outcome status')
            return
        }

        setIsSubmitting(true)
        try {
            const outcome: TaskOutcome = {
                project_id: projectId,
                tool_name: toolName,
                task_description: taskDescription,
                status,
                ai_tool_used: aiToolUsed,
                feedback: feedback ? { comment: feedback } : undefined,
                error_details: errorDetails || undefined
            }

            await onSubmit(outcome)
            toast.success('Outcome recorded! Thank you for the feedback.')

            // Reset form
            setStatus(null)
            setFeedback('')
            setErrorDetails('')
        } catch (error: any) {
            toast.error(`Failed to record outcome: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const statusOptions = [
        {
            value: 'success' as const,
            label: 'Success',
            description: 'Task completed successfully',
            icon: CheckCircle2,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            value: 'partial' as const,
            label: 'Partial Success',
            description: 'Partially working, needs refinement',
            icon: AlertCircle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            value: 'failed' as const,
            label: 'Failed',
            description: "Didn't match expectations",
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            value: 'error' as const,
            label: 'Error Encountered',
            description: 'Technical error or bug',
            icon: HelpCircle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ]

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    📊 Task Status Update
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    {taskDescription}
                </p>
                {aiToolUsed && (
                    <p className="mt-1 text-xs text-gray-500">
                        AI Tool: <span className="font-medium">{aiToolUsed}</span>
                    </p>
                )}
            </div>

            {/* Status Selection */}
            <div className="mb-6">
                <Label className="mb-3 text-sm font-medium">How did it go?</Label>
                <RadioGroup value={status || ''} onValueChange={(value) => setStatus(value as TaskOutcome['status'])}>
                    <div className="space-y-3">
                        {statusOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = status === option.value

                            return (
                                <div
                                    key={option.value}
                                    className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-all ${isSelected
                                            ? `${option.bgColor} border-${option.color.replace('text-', '')}`
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <div className="flex-1">
                                        <Label htmlFor={option.value} className="cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <Icon className={`h-5 w-5 ${option.color}`} />
                                                <span className="font-medium">{option.label}</span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {option.description}
                                            </p>
                                        </Label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </RadioGroup>
            </div>

            {/* Conditional Fields Based on Status */}
            {status && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                >
                    {/* Error Details (for failed or error status) */}
                    {(status === 'failed' || status === 'error') && (
                        <div>
                            <Label htmlFor="error-details" className="text-sm font-medium">
                                What went wrong?
                            </Label>
                            <Textarea
                                id="error-details"
                                value={errorDetails}
                                onChange={(e) => setErrorDetails(e.target.value)}
                                placeholder="Describe the error or issue you encountered..."
                                className="mt-2 min-h-[100px]"
                            />
                            {enableErrorUpload && (
                                <p className="mt-2 text-xs text-gray-500">
                                    💡 Paste error messages, stack traces, or describe what didn't work
                                </p>
                            )}
                        </div>
                    )}

                    {/* General Feedback */}
                    <div>
                        <Label htmlFor="feedback" className="text-sm font-medium">
                            Additional feedback (optional)
                        </Label>
                        <Textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Any other notes, observations, or suggestions..."
                            className="mt-2 min-h-[80px]"
                        />
                    </div>
                </motion.div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex justify-end gap-3">
                <Button
                    onClick={handleSubmit}
                    disabled={!status || isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Feedback'
                    )}
                </Button>
            </div>

            {/* Next Steps Suggestion */}
            {suggestNextSteps && status === 'success' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-lg bg-blue-50 p-4"
                >
                    <p className="text-sm text-blue-900">
                        🎯 <strong>Great!</strong> We'll suggest the next logical step based on your progress.
                    </p>
                </motion.div>
            )}
        </div>
    )
}
