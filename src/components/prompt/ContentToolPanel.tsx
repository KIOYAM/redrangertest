'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, } from 'lucide-react'
import { UserProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface ContentToolPanelProps {
    user: UserProfile | null
    onClose: () => void
}

export function ContentToolPanel({ user, onClose }: ContentToolPanelProps) {
    const [topic, setTopic] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState('')

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic')
            return
        }

        setIsLoading(true)
        try {
            // TODO: Implement content generation API
            toast.info('Content generation coming soon!')
            setResult(`Content about: ${topic}\n\nThis is a placeholder. Real content generation will be implemented soon.`)
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate content')
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
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            Content Tool
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
                            <Label htmlFor="topic" className="text-white">Topic</Label>
                            <Textarea
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter your content topic..."
                                className="mt-2 min-h-[120px] bg-gray-900/50 border-gray-700 text-white"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        >
                            {isLoading ? (
                                <>Generating...</>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Content
                                </>
                            )}
                        </Button>

                        {/* Result */}
                        {result && (
                            <div className="mt-6 rounded-lg bg-gray-900/50 p-4 border border-gray-700">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Generated Content:</h3>
                                <pre className="whitespace-pre-wrap text-white text-sm">{result}</pre>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
