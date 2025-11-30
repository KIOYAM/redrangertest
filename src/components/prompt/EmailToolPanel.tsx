'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronDown, ChevronUp, Sparkles, Mail, Reply, Copy, Check } from 'lucide-react'
import { UserProfile } from '@/types'
import type { ReceiverType, Tone, Length, Language } from '@/lib/tools/email/email-types'
import { RECEIVER_TYPE_LABELS, LENGTH_LABELS, LANGUAGE_LABELS } from '@/lib/tools/email/email-types'
import type { UserRole, Formality, ReplyIntent } from '@/lib/tools/email/email-reply-engine'
import { USER_ROLE_LABELS, FORMALITY_LABELS, REPLY_INTENT_LABELS } from '@/lib/tools/email/email-reply-engine'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ModeToggle } from './ModeToggle'
import { OutputPanel } from './OutputPanel'
import { CreateProjectDialog } from './CreateProjectDialog'
import { toast } from 'sonner'
import { buildEmailPrompt } from '@/lib/tools/email/email-prompt-engine'

interface EmailToolPanelProps {
    user: UserProfile | null
    onClose: () => void
}

type ToolMode = 'write' | 'reply'

export function EmailToolPanel({ user, onClose }: EmailToolPanelProps) {
    const [toolMode, setToolMode] = useState<ToolMode>('write')
    const [mode, setMode] = useState<'normal' | 'ai'>('normal')
    const [showAdvanced, setShowAdvanced] = useState(false)

    // ========== WRITE MODE STATE ==========
    const [story, setStory] = useState('')
    const [tone, setTone] = useState<Tone | 'custom'>('semi_formal')
    const [customTone, setCustomTone] = useState('')
    const [to, setTo] = useState('')
    const [fromName, setFromName] = useState('')
    const [receiverType, setReceiverType] = useState<ReceiverType>('manager')
    const [subjectHint, setSubjectHint] = useState('')
    const [length, setLength] = useState<Length>('medium')
    const [language, setLanguage] = useState<Language>('en')
    const [result, setResult] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // ========== REPLY MODE STATE ==========
    const [receivedEmail, setReceivedEmail] = useState('')
    const [userRole, setUserRole] = useState<UserRole>('employee')
    const [formality, setFormality] = useState<Formality>('formal_friendly')
    const [replyIntent, setReplyIntent] = useState<ReplyIntent>('auto')
    const [extraNotes, setExtraNotes] = useState('')
    const [replyLanguage, setReplyLanguage] = useState<'en' | 'ta' | 'mix'>('en')

    // Stage 1: Meta-prompt generation
    const [replyPrompt, setReplyPrompt] = useState<string | null>(null)
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
    const [promptError, setPromptError] = useState<string | null>(null)
    const [promptCopied, setPromptCopied] = useState(false)

    // Stage 2: Email generation
    const [replyEmail, setReplyEmail] = useState<string | null>(null)
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [emailCopied, setEmailCopied] = useState(false)

    // ========== PROJECT SELECTOR STATE ==========
    const [projects, setProjects] = useState<any[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState<string>('NONE')
    const [isLoadingProjects, setIsLoadingProjects] = useState(false)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    // Load projects on mount
    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        setIsLoadingProjects(true)
        try {
            // Filter projects by 'email' tool
            const response = await fetch('/api/projects/list?toolName=email')
            if (response.ok) {
                const data = await response.json()
                setProjects(data.projects || [])
            }
        } catch (error) {
            console.error('Failed to load projects:', error)
        } finally {
            setIsLoadingProjects(false)
        }
    }

    const handleProjectCreated = (project: any) => {
        // Add to projects list and select it
        setProjects(prev => [project, ...prev])
        setSelectedProjectId(project.id)
    }

    const handleProjectSelect = (value: string) => {
        if (value === 'CREATE_NEW') {
            setIsCreateDialogOpen(true)
        } else {
            setSelectedProjectId(value)
        }
    }

    const toneChips: Array<{ value: Tone | 'custom', label: string }> = [
        { value: 'formal', label: 'Very Formal' },
        { value: 'semi_formal', label: 'Professional' },
        { value: 'friendly', label: 'Casual' },
        { value: 'apologetic', label: 'Apologetic' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'custom', label: 'Custom' },
    ]

    // ========== WRITE MODE HANDLER ==========
    const handleGenerate = async () => {
        if (!story.trim()) {
            toast.error('Please describe what you want the email to do')
            return
        }

        setIsLoading(true)
        setResult('')

        const effectiveTone = tone === 'custom' ? (customTone as Tone) : tone

        try {
            if (mode === 'ai') {
                const response = await fetch('/api/tools/email/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to,
                        fromName,
                        receiverType,
                        subjectHint,
                        story,
                        tone: effectiveTone,
                        length,
                        language,
                        // Project memory integration
                        ...(selectedProjectId && {
                            projectId: selectedProjectId,
                            toolName: 'email'
                        })
                    }),
                })

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('AI access not enabled. Contact admin.')
                    }
                    throw new Error('Failed to generate prompt')
                }

                const data = await response.json()
                setResult(data.prompt)
            } else {
                // Normal Mode
                const prompt = buildEmailPrompt({
                    to,
                    fromName,
                    receiverType,
                    subjectHint,
                    story,
                    tone: effectiveTone,
                    length,
                    language
                })

                await new Promise(resolve => setTimeout(resolve, 500))
                setResult(prompt)
            }

            toast.success('Prompt generated!')
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    // ========== REPLY MODE HANDLERS ==========
    const handleGenerateReplyPrompt = async () => {
        if (!receivedEmail.trim()) {
            toast.error('Please paste the email you received')
            return
        }

        setIsGeneratingPrompt(true)
        setPromptError(null)
        setReplyPrompt(null)

        try {
            const response = await fetch('/api/tools/email/reply-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receivedEmail,
                    userRole,
                    formality,
                    replyIntent,
                    extraNotes: extraNotes.trim() || undefined,
                    language: replyLanguage
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (response.status === 401) {
                    throw new Error('Please sign in again to use AI features')
                }
                if (response.status === 403) {
                    throw new Error('AI access is not enabled for your account')
                }
                throw new Error(errorData.error || 'Failed to generate reply prompt')
            }

            const data = await response.json()
            setReplyPrompt(data.prompt)
            toast.success('Reply prompt generated!')
        } catch (error: any) {
            setPromptError(error.message)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setIsGeneratingPrompt(false)
        }
    }

    const handleGenerateReplyEmail = async () => {
        if (!replyPrompt) {
            toast.error('Please generate a reply prompt first')
            return
        }

        setIsGeneratingEmail(true)
        setEmailError(null)
        setReplyEmail(null)

        try {
            const response = await fetch('/api/tools/email/reply-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: replyPrompt,
                    language: replyLanguage
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (response.status === 401) {
                    throw new Error('Please sign in again to use AI features')
                }
                if (response.status === 403) {
                    throw new Error('AI access is not enabled for your account')
                }
                throw new Error(errorData.error || 'Failed to generate email reply')
            }

            const data = await response.json()
            setReplyEmail(data.emailText)
            toast.success('Email reply generated!')
        } catch (error: any) {
            setEmailError(error.message)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setIsGeneratingEmail(false)
        }
    }

    const handleCopyPrompt = async () => {
        if (!replyPrompt) return

        try {
            await navigator.clipboard.writeText(replyPrompt)
            setPromptCopied(true)
            toast.success('Reply prompt copied!')
            setTimeout(() => setPromptCopied(false), 2000)
        } catch (error) {
            toast.error('Failed to copy')
        }
    }

    const handleCopyEmail = async () => {
        if (!replyEmail) return

        try {
            await navigator.clipboard.writeText(replyEmail)
            setEmailCopied(true)
            toast.success('Email reply copied!')
            setTimeout(() => setEmailCopied(false), 2000)
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
                            <h2 className="text-2xl font-bold text-gray-900">Email Tool</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {toolMode === 'write' ? 'Generate professional email meta-prompts' : 'Generate intelligent email replies'}
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

                    {/* Tool Mode Tabs */}
                    <Tabs value={toolMode} onValueChange={(v) => setToolMode(v as ToolMode)} className="mb-6">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="write" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Write New Email
                            </TabsTrigger>
                            <TabsTrigger value="reply" className="flex items-center gap-2">
                                <Reply className="h-4 w-4" />
                                Reply to Email
                            </TabsTrigger>
                        </TabsList>

                        {/* ==================== WRITE MODE ==================== */}
                        <TabsContent value="write">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Left: Form */}
                                <div className="space-y-6">
                                    {/* Mode Toggle */}
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-medium">Mode</Label>
                                        <ModeToggle
                                            mode={mode}
                                            canUseAi={user?.can_use_ai || false}
                                            onChange={setMode}
                                        />
                                    </div>

                                    {/* Simple Section */}
                                    <div className="space-y-4">
                                        {/* Project Selector */}
                                        <div>
                                            <Label className="text-sm font-medium">Attach to Project (Optional)</Label>
                                            <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder={isLoadingProjects ? "Loading projects..." : "No project (Quick use)"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="NONE">No project (Quick use)</SelectItem>
                                                    <SelectItem value="CREATE_NEW" className="font-medium text-blue-600">
                                                        + Create New Project
                                                    </SelectItem>
                                                    {projects.map((project) => (
                                                        <SelectItem key={project.id} value={project.id}>
                                                            {project.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {selectedProjectId && selectedProjectId !== 'NONE' && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    💡 This will save to project memory for context in future emails
                                                </p>
                                            )}
                                        </div>

                                        {/* Story Input */}
                                        <div>
                                            <Label htmlFor="story" className="text-sm font-medium">
                                                What do you want this email to do? *
                                            </Label>
                                            <Textarea
                                                id="story"
                                                placeholder="e.g., I need to request leave for tomorrow because of heavy rain and flooding in my area. I already have 2 late marks this month..."
                                                value={story}
                                                onChange={(e) => setStory(e.target.value)}
                                                className="mt-2 min-h-[120px] resize-none"
                                            />
                                        </div>

                                        {/* Tone Chips */}
                                        <div>
                                            <Label className="text-sm font-medium">Tone</Label>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {toneChips.map((chip) => (
                                                    <button
                                                        key={chip.value}
                                                        onClick={() => setTone(chip.value)}
                                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${tone === chip.value
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {chip.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {tone === 'custom' && (
                                                <Input
                                                    placeholder="Describe the tone..."
                                                    value={customTone}
                                                    onChange={(e) => setCustomTone(e.target.value)}
                                                    className="mt-2"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Advanced Details (Collapsible) */}
                                    <div className="rounded-lg border border-gray-200 bg-gray-50">
                                        <button
                                            onClick={() => setShowAdvanced(!showAdvanced)}
                                            className="flex w-full items-center justify-between p-4 text-sm font-medium text-gray-700 hover:text-gray-900"
                                        >
                                            Advanced Details
                                            {showAdvanced ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </button>

                                        {showAdvanced && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="space-y-4 border-t border-gray-200 p-4"
                                            >
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <Label htmlFor="to" className="text-xs">To (Recipient)</Label>
                                                        <Input
                                                            id="to"
                                                            placeholder="e.g., HR Manager"
                                                            value={to}
                                                            onChange={(e) => setTo(e.target.value)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="from" className="text-xs">From (Your Name)</Label>
                                                        <Input
                                                            id="from"
                                                            placeholder="Optional"
                                                            value={fromName}
                                                            onChange={(e) => setFromName(e.target.value)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label className="text-xs">Receiver Type</Label>
                                                    <Select value={receiverType} onValueChange={(val) => setReceiverType(val as ReceiverType)}>
                                                        <SelectTrigger className="mt-1">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(RECEIVER_TYPE_LABELS).map(([value, label]) => (
                                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label htmlFor="subject" className="text-xs">Subject Hint</Label>
                                                    <Input
                                                        id="subject"
                                                        placeholder="e.g., Leave Request"
                                                        value={subjectHint}
                                                        onChange={(e) => setSubjectHint(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <Label className="text-xs">Length</Label>
                                                        <Select value={length} onValueChange={(val) => setLength(val as Length)}>
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(LENGTH_LABELS).map(([value, label]) => (
                                                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Language</Label>
                                                        <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
                                                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Generate Button */}
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={isLoading}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            'Generating...'
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                {mode === 'ai' ? 'Generate with AI' : 'Generate Prompt'}
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Right: Output */}
                                <div className="lg:sticky lg:top-0 lg:h-[calc(100vh-8rem)]">
                                    <OutputPanel result={result} isLoading={isLoading} />
                                </div>
                            </div>
                        </TabsContent>

                        {/* ==================== REPLY MODE ==================== */}
                        <TabsContent value="reply">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Left: Form */}
                                <div className="space-y-6">
                                    {/* Received Email */}
                                    <div>
                                        <Label htmlFor="received" className="text-sm font-medium">
                                            Paste the email you received *
                                        </Label>
                                        <Textarea
                                            id="received"
                                            placeholder="Paste the complete email you need to reply to..."
                                            value={receivedEmail}
                                            onChange={(e) => setReceivedEmail(e.target.value)}
                                            className="mt-2 min-h-[150px] resize-none font-mono text-sm"
                                        />
                                    </div>

                                    {/* Context Fields */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-xs">You are (your role)</Label>
                                            <Select value={userRole} onValueChange={(val) => setUserRole(val as UserRole)}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Formality level</Label>
                                            <Select value={formality} onValueChange={(val) => setFormality(val as Formality)}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(FORMALITY_LABELS).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs">Reply intent</Label>
                                        <Select value={replyIntent} onValueChange={(val) => setReplyIntent(val as ReplyIntent)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(REPLY_INTENT_LABELS).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="extraNotes" className="text-xs">
                                            Extra notes for your reply (optional)
                                        </Label>
                                        <Textarea
                                            id="extraNotes"
                                            placeholder="Any specific points you want to mention in your reply..."
                                            value={extraNotes}
                                            onChange={(e) => setExtraNotes(e.target.value)}
                                            className="mt-1 min-h-[80px] resize-none"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs">Language</Label>
                                        <Select value={replyLanguage} onValueChange={(val) => setReplyLanguage(val as 'en' | 'ta' | 'mix')}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="ta">Tamil</SelectItem>
                                                <SelectItem value="mix">Tanglish (Tamil + English)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Stage 1 Button */}
                                    <Button
                                        onClick={handleGenerateReplyPrompt}
                                        disabled={isGeneratingPrompt || !receivedEmail.trim()}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isGeneratingPrompt ? (
                                            'Generating Reply Prompt...'
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Generate Reply Prompt
                                            </>
                                        )}
                                    </Button>

                                    {/* Stage 2 Button */}
                                    {replyPrompt && (
                                        <Button
                                            onClick={handleGenerateReplyEmail}
                                            disabled={isGeneratingEmail}
                                            className="w-full"
                                            size="lg"
                                            variant="secondary"
                                        >
                                            {isGeneratingEmail ? (
                                                'Generating Email Reply...'
                                            ) : (
                                                <>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Use this Prompt to Generate Email Reply
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>

                                {/* Right: Outputs */}
                                <div className="space-y-6">
                                    {/* Panel 1: Reply Meta-Prompt */}
                                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">Reply Meta-Prompt</h3>
                                            {replyPrompt && (
                                                <Button
                                                    onClick={handleCopyPrompt}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-2"
                                                >
                                                    {promptCopied ? (
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                    {promptCopied ? 'Copied!' : 'Copy'}
                                                </Button>
                                            )}
                                        </div>
                                        <div className="min-h-[200px]">
                                            {isGeneratingPrompt && (
                                                <div className="flex items-center justify-center py-12">
                                                    <div className="text-center">
                                                        <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                                                        <p className="text-sm text-gray-600">Generating...</p>
                                                    </div>
                                                </div>
                                            )}
                                            {!isGeneratingPrompt && !replyPrompt && !promptError && (
                                                <div className="flex items-center justify-center py-12">
                                                    <p className="text-sm text-gray-500">Generate a reply prompt to see it here</p>
                                                </div>
                                            )}
                                            {promptError && (
                                                <div className="rounded-md bg-red-50 p-4">
                                                    <p className="text-sm text-red-800">{promptError}</p>
                                                </div>
                                            )}
                                            {replyPrompt && (
                                                <div className="max-h-[400px] overflow-auto rounded-md bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-800">
                                                    {replyPrompt}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Panel 2: Final Email Reply */}
                                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">Suggested Email Reply</h3>
                                            {replyEmail && (
                                                <Button
                                                    onClick={handleCopyEmail}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-2"
                                                >
                                                    {emailCopied ? (
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                    {emailCopied ? 'Copied!' : 'Copy'}
                                                </Button>
                                            )}
                                        </div>
                                        <div className="min-h-[200px]">
                                            {isGeneratingEmail && (
                                                <div className="flex items-center justify-center py-12">
                                                    <div className="text-center">
                                                        <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                                                        <p className="text-sm text-gray-600">Generating...</p>
                                                    </div>
                                                </div>
                                            )}
                                            {!isGeneratingEmail && !replyEmail && !emailError && (
                                                <div className="flex items-center justify-center py-12">
                                                    <p className="text-sm text-gray-500">Generate an email reply to see it here</p>
                                                </div>
                                            )}
                                            {emailError && (
                                                <div className="rounded-md bg-red-50 p-4">
                                                    <p className="text-sm text-red-800">{emailError}</p>
                                                </div>
                                            )}
                                            {replyEmail && (
                                                <div className="max-h-[400px] overflow-auto rounded-md bg-gray-50 p-4">
                                                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                                                        {replyEmail}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </motion.div>

            {/* Create Project Dialog */}
            <CreateProjectDialog
                toolName="email"
                toolDisplayName="Email"
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onProjectCreated={handleProjectCreated}
            />
        </>
    )
}
