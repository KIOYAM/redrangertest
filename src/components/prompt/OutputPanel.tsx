'use client'

import { motion } from 'framer-motion'
import { Copy, Check, FileText } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface OutputPanelProps {
    result: string
    isLoading: boolean
}

export function OutputPanel({ result, isLoading }: OutputPanelProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        if (!result) return
        navigator.clipboard.writeText(result)
        setCopied(true)
        toast.success('Meta-prompt copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                    Generated Meta-Prompt
                </h3>
                {result && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8 gap-2"
                    >
                        {copied ? (
                            <>
                                <Check className="h-3.5 w-3.5" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
                {isLoading ? (
                    /* Loading State - Shimmer Effect */
                    <div className="h-full p-6 space-y-3">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1
                                }}
                                className={`h-4 rounded ${i % 3 === 0 ? 'w-3/4' : 'w-full'
                                    } bg-gradient-to-r from-gray-200 to-gray-300`}
                            />
                        ))}
                    </div>
                ) : result ? (
                    /* Result State */
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-auto p-6"
                    >
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                            {result}
                        </pre>
                    </motion.div>
                ) : (
                    /* Empty State */
                    <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="text-center">
                            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                            <p className="text-sm text-gray-500">
                                Meta-prompt will appear here
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
