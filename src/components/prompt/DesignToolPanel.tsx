'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { UserProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface DesignToolPanelProps {
    user: UserProfile | null
    onClose: () => void
}

export function DesignToolPanel({ user, onClose }: DesignToolPanelProps) {
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState('')

    const handleGenerate = async () => {
        if (!description.trim()) {
            toast.error('Please enter a design description')
            return
        }

        setIsLoading(true)
        try {
            // TODO: Implement design generation API
            toast.info('Design generation coming soon!')
            setResult(`Design for: ${description}\n\nThis is a placeholder. Real design generation will be implemented soon.`)
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate design')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
            <div className="flex min-h-screen items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-4xl rounded-3xl border border-purple-500/20 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl"
                >
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Design Tool
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="description" className="text-white">Design Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the design you need..."
                                className="mt-2 min-h-[120px] bg-gray-900/50 border-gray-700 text-white"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                            {isLoading ? (
                                <>Generating...</>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Design
                                </>
                            )}
                        </Button>

                        {/* Result */}
                        {result && (
                            <div className="mt-6 rounded-lg bg-gray-900/50 p-4 border border-gray-700">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Generated Design:</h3>
                                <pre className="whitespace-pre-wrap text-white text-sm">{result}</pre>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
