'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface CreateProjectDialogProps {
    toolName: string
    toolDisplayName?: string
    isOpen: boolean
    onClose: () => void
    onProjectCreated: (project: any) => void
}

export function CreateProjectDialog({
    toolName,
    toolDisplayName,
    isOpen,
    onClose,
    onProjectCreated
}: CreateProjectDialogProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            setError('Project title is required')
            return
        }

        setIsCreating(true)
        setError(null)

        try {
            const response = await fetch('/api/projects/create-tool-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    toolName
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create project')
            }

            toast.success(`Project "${title}" created!`)
            onProjectCreated(data.project)
            handleClose()
        } catch (error: any) {
            setError(error.message)
            toast.error(error.message)
        } finally {
            setIsCreating(false)
        }
    }

    const handleClose = () => {
        setTitle('')
        setDescription('')
        setError(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Create New Project
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    {toolDisplayName || toolName} Tool
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClose}
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title Input */}
                            <div>
                                <Label htmlFor="project-title" className="text-sm font-medium">
                                    Project Title *
                                </Label>
                                <Input
                                    id="project-title"
                                    placeholder="e.g., Login Feature"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                        setError(null)
                                    }}
                                    className="mt-1.5"
                                    autoFocus
                                    disabled={isCreating}
                                />
                            </div>

                            {/* Description Input */}
                            <div>
                                <Label htmlFor="project-description" className="text-sm font-medium">
                                    Description (optional)
                                </Label>
                                <Textarea
                                    id="project-description"
                                    placeholder="Brief description of what this project is about..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1.5 min-h-[80px] resize-none"
                                    disabled={isCreating}
                                />
                            </div>

                            {/* Error Display */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800"
                                >
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    className="flex-1"
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isCreating || !title.trim()}
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Project'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
