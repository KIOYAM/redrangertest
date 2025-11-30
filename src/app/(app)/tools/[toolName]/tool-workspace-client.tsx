'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Zap, Sparkles, Loader2 } from 'lucide-react'

interface ToolWorkspaceClientProps {
    tool: any
    userId?: string
}

export function ToolWorkspaceClient({ tool, userId }: ToolWorkspaceClientProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [result, setResult] = useState('')
    const group = tool.ranger_groups

    const handleGenerate = async () => {
        setIsGenerating(true)
        // TODO: Implement actual tool execution logic
        setTimeout(() => {
            setResult('Generated result will appear here...')
            setIsGenerating(false)
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/groups/${group?.name?.replace('_ranger', '')}`}
                            className="flex items-center text-sm text-gray-400 hover:text-white transition"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to {group?.display_name}
                        </Link>
                        <div className="h-6 w-px bg-white/10"></div>
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${group?.color_primary}20` }}
                            >
                                <Zap className="h-4 w-4" style={{ color: group?.color_primary }} />
                            </div>
                            <div>
                                <h1 className="font-bold text-white">{tool.display_name}</h1>
                                <p className="text-xs text-gray-500">{tool.credit_cost} Energy</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-6 py-2 rounded-lg font-semibold text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition"
                        style={{ backgroundColor: group?.color_primary }}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4" style={{ color: group?.color_primary }}>
                                Input
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">{tool.description}</p>

                            <textarea
                                className="w-full h-64 bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 resize-none"
                                placeholder="Enter your input here..."
                            />
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-4">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4" style={{ color: group?.color_primary }}>
                                Result
                            </h2>
                            {result ? (
                                <div className="bg-black/50 border border-white/10 rounded-lg p-4 min-h-64">
                                    <p className="text-white whitespace-pre-wrap">{result}</p>
                                </div>
                            ) : (
                                <div className="bg-black/50 border border-white/10 rounded-lg p-4 min-h-64 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">Your generated result will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
