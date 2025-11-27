'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, Copy, Check, Code2, MessageSquare } from 'lucide-react'
import { UserProfile } from '@/types'
import type { DevMode, OutputFormat, ExecutionContext } from '@/lib/tools/developer/developer-prompt-engine'
import { DEV_MODE_LABELS, OUTPUT_FORMAT_LABELS, EXECUTION_CONTEXT_LABELS } from '@/lib/tools/developer/developer-prompt-engine'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface DeveloperToolPanelProps {
    user: UserProfile | null
    onClose: () => void
}

// Popular tech stack options
const TECH_STACK_OPTIONS = [
    'React', 'Next.js', 'Vue', 'Angular', 'Svelte',
    'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI',
    'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
    'Tailwind CSS', 'Material-UI', 'Bootstrap', 'Sass',
    'GraphQL', 'REST API', 'WebSocket', 'Docker', 'Kubernetes'
]

export function DeveloperToolPanel({ user, onClose }: DeveloperToolPanelProps) {
    // Form state
    const [description, setDescription] = useState('')
    const [mode, setMode] = useState<DevMode>('code_generation')
    const [stack, setStack] = useState<string[]>([])
    const [customStack, setCustomStack] = useState('')
    const [outputFormat, setOutputFormat] = useState<OutputFormat>('code_only')
    const [executionContext, setExecutionContext] = useState<ExecutionContext>('both')
    const [fileNaming, setFileNaming] = useState(false)
    const [language, setLanguage] = useState<'en' | 'ta' | 'mix'>('en')

    // Output state
    const [idePrompt, setIdePrompt] = useState<string | null>(null)
    const [chatPrompt, setChatPrompt] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Copy state
    const [ideCopied, setIdeCopied] = useState(false)
    const [chatCopied, setChatCopied] = useState(false)

    const handleStackToggle = (tech: string) => {
        setStack(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech]
        )
    }

    const handleAddCustomStack = () => {
        if (customStack.trim() && !stack.includes(customStack.trim())) {
            setStack(prev => [...prev, customStack.trim()])
            setCustomStack('')
        }
    }

    const handleRemoveStack = (tech: string) => {
        setStack(prev => prev.filter(t => t !== tech))
    }

    const handleGenerate = async () => {
        if (!description.trim()) {
            toast.error('Please describe your problem or requirement')
            return
        }

        setIsLoading(true)
        setError(null)
        setIdePrompt(null)
        setChatPrompt(null)

        try {
            const response = await fetch('/api/tools/developer/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    mode,
                    stack: stack.length > 0 ? stack : undefined,
                    outputFormat,
                    executionContext,
                    fileNaming,
                    language
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (response.status === 401) {
                    throw new Error('Please sign in to use this tool')
                }
                if (response.status === 403) {
                    throw new Error('AI access is not enabled for your account')
                }
                throw new Error(errorData.error || 'Failed to generate prompts')
            }

            const data = await response.json()
            setIdePrompt(data.idePrompt)
            setChatPrompt(data.chatPrompt)
            toast.success('Developer prompts generated!')
        } catch (error: any) {
            setError(error.message)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopyIde = async () => {
        if (!idePrompt) return

        try {
            await navigator.clipboard.writeText(idePrompt)
            setIdeCopied(true)
            toast.success('IDE prompt copied!')
            setTimeout(() => setIdeCopied(false), 2000)
        } catch (error) {
            toast.error('Failed to copy')
        }
    }

    const handleCopyChat = async () => {
        if (!chatPrompt) return

        try {
            await navigator.clipboard.writeText(chatPrompt)
            setChatCopied(true)
            toast.success('Chat prompt copied!')
            setTimeout(() => setChatCopied(false), 2000)
        } catch (error) {
            toast.error('Failed to copy')
        }
    }

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="fixed inset-4 z-50 overflow-auto rounded-2xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md md:inset-8"
            >
                <div className="mx-auto max-w-7xl p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">💡 Developer Prompt Assistant</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Generate optimized prompts for AI IDEs and Chat Models
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-10 w-10"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left: Form */}
                        <div className="space-y-6">
                            {/* Description */}
                            <div>
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Problem / Requirement Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="e.g., Build a login page in React using Tailwind CSS with email/password fields, API integration, and error handling..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-2 min-h-[120px] resize-none"
                                />
                            </div>

                            {/* Mode Selection */}
                            <div>
                                <Label className="text-sm font-medium">Mode</Label>
                                <Select value={mode} onValueChange={(val) => setMode(val as DevMode)}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(DEV_MODE_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <Label className="text-sm font-medium">Technology Stack (optional)</Label>
                                <div className="mt-2 max-h-32 overflow-y-auto rounded-lg border border-gray-200 p-3">
                                    <div className="flex flex-wrap gap-2">
                                        {TECH_STACK_OPTIONS.map((tech) => (
                                            <button
                                                key={tech}
                                                onClick={() => handleStackToggle(tech)}
                                                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${stack.includes(tech)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {tech}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Selected Stack */}
                                {stack.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {stack.map((tech) => (
                                            <Badge key={tech} variant="secondary" className="gap-1">
                                                {tech}
                                                <button
                                                    onClick={() => handleRemoveStack(tech)}
                                                    className="ml-1 hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Custom Stack */}
                                <div className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add custom technology..."
                                        value={customStack}
                                        onChange={(e) => setCustomStack(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomStack()}
                                        className="flex-1 rounded-md border border-gray-300 px-3 py-1 text-sm"
                                    />
                                    <Button onClick={handleAddCustomStack} size="sm" variant="outline">
                                        Add
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Output Format */}
                                <div>
                                    <Label className="text-xs">Output Format</Label>
                                    <Select value={outputFormat} onValueChange={(val) => setOutputFormat(val as OutputFormat)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(OUTPUT_FORMAT_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Execution Context */}
                                <div>
                                    <Label className="text-xs">Target Platform</Label>
                                    <Select value={executionContext} onValueChange={(val) => setExecutionContext(val as ExecutionContext)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(EXECUTION_CONTEXT_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* File Naming */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="fileNaming"
                                    checked={fileNaming}
                                    onCheckedChange={(checked: boolean) => setFileNaming(checked)}
                                />
                                <Label htmlFor="fileNaming" className="text-sm cursor-pointer">
                                    Include file names and paths
                                </Label>
                            </div>

                            {/* Language */}
                            <div>
                                <Label className="text-sm font-medium">Language</Label>
                                <Select value={language} onValueChange={(val) => setLanguage(val as 'en' | 'ta' | 'mix')}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="ta">Tamil</SelectItem>
                                        <SelectItem value="mix">Tanglish (Tamil + English)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={isLoading || !description.trim()}
                                className="w-full"
                                size="lg"
                            >
                                {isLoading ? (
                                    'Generating Prompts...'
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Developer Prompts
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Right: Outputs */}
                        <div className="space-y-6">
                            {/* Panel 1: IDE Optimized Prompt */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Code2 className="h-5 w-5 text-blue-600" />
                                        <h3 className="font-semibold text-gray-900">IDE Optimized Prompt</h3>
                                    </div>
                                    {idePrompt && (
                                        <Button
                                            onClick={handleCopyIde}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-2"
                                        >
                                            {ideCopied ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                            {ideCopied ? 'Copied!' : 'Copy'}
                                        </Button>
                                    )}
                                </div>
                                <div className="min-h-[200px]">
                                    {isLoading && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-center">
                                                <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                                                <p className="text-sm text-gray-600">Generating...</p>
                                            </div>
                                        </div>
                                    )}
                                    {!isLoading && !idePrompt && !error && (
                                        <div className="flex items-center justify-center py-12">
                                            <p className="text-sm text-gray-500">
                                                For Copilot, Cursor, Codeium
                                            </p>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="rounded-md bg-red-50 p-4">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    )}
                                    {idePrompt && (
                                        <div className="max-h-[300px] overflow-auto rounded-md bg-gray-900 p-4 font-mono text-xs leading-relaxed text-green-400">
                                            <pre className="whitespace-pre-wrap">{idePrompt}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Panel 2: Chat Model Engineering Prompt */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-purple-600" />
                                        <h3 className="font-semibold text-gray-900">Chat Model Prompt</h3>
                                    </div>
                                    {chatPrompt && (
                                        <Button
                                            onClick={handleCopyChat}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-2"
                                        >
                                            {chatCopied ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                            {chatCopied ? 'Copied!' : 'Copy'}
                                        </Button>
                                    )}
                                </div>
                                <div className="min-h-[200px]">
                                    {isLoading && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-center">
                                                <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />
                                                <p className="text-sm text-gray-600">Generating...</p>
                                            </div>
                                        </div>
                                    )}
                                    {!isLoading && !chatPrompt && !error && (
                                        <div className="flex items-center justify-center py-12">
                                            <p className="text-sm text-gray-500">
                                                For GPT, Claude, Gemini, DeepSeek
                                            </p>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="rounded-md bg-red-50 p-4">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    )}
                                    {chatPrompt && (
                                        <div className="max-h-[300px] overflow-auto rounded-md bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
                                            <pre className="whitespace-pre-wrap font-sans">{chatPrompt}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}
