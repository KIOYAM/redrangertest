'use client'

import { useState } from 'react'
import { UserProfile } from '@/types'
import { usePromptMode } from '@/hooks/use-prompt-mode'
import { buildEmailPrompt } from '@/lib/tools/email/email-prompt-engine'
import type { ReceiverType, Tone, Length, Language } from '@/lib/tools/email/email-types'
import { RECEIVER_TYPE_LABELS, TONE_LABELS, LENGTH_LABELS, LANGUAGE_LABELS } from '@/lib/tools/email/email-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Copy, Check, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface EmailToolProps {
    user: UserProfile | null
}

export function EmailTool({ user }: EmailToolProps) {
    const { isAIMode, toggleMode } = usePromptMode(user?.can_use_ai)

    // Form States
    const [to, setTo] = useState('')
    const [fromName, setFromName] = useState('')
    const [receiverType, setReceiverType] = useState<ReceiverType>('manager')
    const [subjectHint, setSubjectHint] = useState('')
    const [story, setStory] = useState('')
    const [tone, setTone] = useState<Tone>('semi_formal')
    const [length, setLength] = useState<Length>('medium')
    const [language, setLanguage] = useState<Language>('en')

    // Output States
    const [generatedResult, setGeneratedResult] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        // Validation
        if (!story.trim()) {
            toast.error('Please tell us why you need this email (Main story/purpose)')
            return
        }

        setIsLoading(true)
        setGeneratedResult('')

        try {
            if (isAIMode) {
                // AI Mode - Call API to generate optimized meta-prompt
                const response = await fetch('/api/tools/email/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to,
                        fromName,
                        receiverType,
                        subjectHint,
                        story,
                        tone,
                        length,
                        language
                    }),
                })

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('AI access is not enabled for your account. Contact admin.')
                    }
                    if (response.status === 401) {
                        throw new Error('Please log in again.')
                    }
                    throw new Error('Failed to generate prompt')
                }

                const data = await response.json()
                setGeneratedResult(data.prompt)
            } else {
                // Normal Mode - Use prompt engine
                const prompt = buildEmailPrompt({
                    to,
                    fromName,
                    receiverType,
                    subjectHint,
                    story,
                    tone,
                    length,
                    language
                })

                // Simulate delay for better UX
                await new Promise(resolve => setTimeout(resolve, 500))
                setGeneratedResult(prompt)
            }
            toast.success('Prompt generated!')
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong. Try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        if (!generatedResult) return
        navigator.clipboard.writeText(generatedResult)
        setCopied(true)
        toast.success('Copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* To & From */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="to">To (Recipient)</Label>
                            <Input
                                id="to"
                                placeholder="e.g. John Smith, HR Team"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="from">From (Your Name)</Label>
                            <Input
                                id="from"
                                placeholder="Optional"
                                value={fromName}
                                onChange={(e) => setFromName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Receiver Type */}
                    <div className="space-y-2">
                        <Label>Receiver Type</Label>
                        <Select value={receiverType} onValueChange={(val) => setReceiverType(val as ReceiverType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(RECEIVER_TYPE_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Subject Hint */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject Hint (Optional)</Label>
                        <Input
                            id="subject"
                            placeholder="e.g. Leave Request, Project Update"
                            value={subjectHint}
                            onChange={(e) => setSubjectHint(e.target.value)}
                        />
                    </div>

                    {/* Main Story */}
                    <div className="space-y-2">
                        <Label htmlFor="story" className="text-primary font-medium">
                            Main Story / Purpose *
                        </Label>
                        <Textarea
                            id="story"
                            placeholder="Tell us the situation... e.g. I missed office today because of bus issues, I need to request leave, I already have 2 late marks..."
                            className="min-h-[120px]"
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                        />
                    </div>

                    {/* Tone */}
                    <div className="space-y-2">
                        <Label>Tone</Label>
                        <Select value={tone} onValueChange={(val) => setTone(val as Tone)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(TONE_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Length & Language */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Length</Label>
                            <Select value={length} onValueChange={(val) => setLength(val as Length)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(LENGTH_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                        <div className="space-y-0.5">
                            <Label className="text-base">AI Generation Mode</Label>
                            <div className="text-sm text-muted-foreground">
                                {isAIMode ? 'Uses AI to create an optimized meta-prompt' : 'Generates a structured meta-prompt'}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!user?.can_use_ai && (
                                <Badge variant="secondary" className="text-xs">Locked</Badge>
                            )}
                            <Switch
                                checked={isAIMode}
                                onCheckedChange={toggleMode}
                                disabled={!user?.can_use_ai}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? (
                            <>Generating...</>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Prompt
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Generated Meta-Prompt</CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!generatedResult}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </CardHeader>
                <CardContent className="flex-1">
                    {generatedResult ? (
                        <div className="rounded-md bg-muted p-4 whitespace-pre-wrap min-h-[400px] text-sm overflow-auto max-h-[600px]">
                            {generatedResult}
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[400px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                            Meta-prompt will appear here
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
