'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Copy, Check, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ToolCategory } from '@/types/ranger-groups'

interface GenericToolProps {
    tool: ToolCategory
    groupColor: string
    groupName: string
}

export function GenericTool({ tool, groupColor, groupName }: GenericToolProps) {
    const [input, setInput] = useState('')
    const [generatedContent, setGeneratedContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        if (!input) {
            toast.error('Please describe what you want to generate')
            return
        }

        setIsLoading(true)
        setGeneratedContent('')

        try {
            // We'll reuse the generate-prompt API for now, but contextually adapted
            const response = await fetch('/api/generate-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: input,
                    context: `Tool: ${tool.display_name}. Description: ${tool.description}.`,
                    format: 'Markdown'
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate content')
            }

            const data = await response.json()
            setGeneratedContent(data.prompt)
            toast.success('Generated successfully!')
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        if (!generatedContent) return
        navigator.clipboard.writeText(generatedContent)
        setCopied(true)
        toast.success('Copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Sticky Header */}
            <div className="sticky top-20 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 -mx-4 px-4 py-4 mb-8 flex items-center justify-between">
                <Link
                    href={`/groups/${groupName.replace('_ranger', '')}`}
                    className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to {groupName.replace('_ranger', '').replace(/^\w/, c => c.toUpperCase())} Ranger
                </Link>
                <h1 className="text-xl font-bold text-white hidden sm:block">
                    <span style={{ color: groupColor }}>{tool.display_name}</span>
                </h1>
            </div>

            {/* Tool Info */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-4 sm:hidden">
                    <span style={{ color: groupColor }}>{tool.display_name}</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">{tool.description}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                        <label className="block text-sm font-semibold text-gray-300 mb-4">
                            What would you like to create?
                        </label>
                        <Textarea
                            placeholder={`Describe your ${tool.display_name.toLowerCase()} requirements...`}
                            className="min-h-[200px] bg-black/20 border-white/10 text-white placeholder-gray-500 focus:border-opacity-50 transition resize-none"
                            style={{ ['--tw-ring-color' as any]: groupColor }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full sm:w-auto font-bold text-white transition-all transform hover:scale-105"
                                style={{
                                    backgroundColor: groupColor,
                                    boxShadow: `0 0 20px ${groupColor}40`
                                }}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Generating...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Output Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-300">Generated Result</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                disabled={!generatedContent}
                                className="hover:bg-white/10 text-gray-400 hover:text-white"
                            >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>

                        <div className="flex-1 bg-black/20 rounded-xl p-4 border border-white/5 overflow-y-auto min-h-[200px] max-h-[600px]">
                            {generatedContent ? (
                                <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                                    {generatedContent}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 opacity-50">
                                    <Sparkles className="h-8 w-8" />
                                    <p>Result will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
