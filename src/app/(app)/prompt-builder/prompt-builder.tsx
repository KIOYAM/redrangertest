'use client'

import { useState } from 'react'
import { UserProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface PromptBuilderProps {
    user: UserProfile | null
}

export function PromptBuilder({ user }: PromptBuilderProps) {
    const [task, setTask] = useState('')
    const [language, setLanguage] = useState('English')
    const [tone, setTone] = useState('Professional')
    const [format, setFormat] = useState('Paragraph')
    const [isAIMode, setIsAIMode] = useState(false)
    const [generatedPrompt, setGeneratedPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        if (!task) {
            toast.error('Please enter a task description')
            return
        }

        setIsLoading(true)
        setGeneratedPrompt('')

        try {
            if (isAIMode) {
                // AI Generation
                const response = await fetch('/api/generate-prompt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ task, language, tone, format }),
                })

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('You do not have permission to use AI generation.')
                    }
                    throw new Error('Failed to generate prompt')
                }

                const data = await response.json()
                setGeneratedPrompt(data.prompt)
            } else {
                // Normal Generation (Template)
                const template = `Act as an expert in the field related to this task.
Task: ${task}

Please ensure the response follows these guidelines:
- Language: ${language}
- Tone: ${tone}
- Format: ${format}

Provide a comprehensive and high-quality response.`

                // Simulate a small delay for better UX
                await new Promise(resolve => setTimeout(resolve, 500))
                setGeneratedPrompt(template)
            }
            toast.success('Prompt generated successfully!')
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        if (!generatedPrompt) return
        navigator.clipboard.writeText(generatedPrompt)
        setCopied(true)
        toast.success('Copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="task">Task Description</Label>
                        <Textarea
                            id="task"
                            placeholder="e.g. Write a blog post about AI trends"
                            className="min-h-[100px]"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Spanish">Spanish</SelectItem>
                                    <SelectItem value="French">French</SelectItem>
                                    <SelectItem value="German">German</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tone</Label>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                    <SelectItem value="Casual">Casual</SelectItem>
                                    <SelectItem value="Academic">Academic</SelectItem>
                                    <SelectItem value="Creative">Creative</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Output Format</Label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Paragraph">Paragraph</SelectItem>
                                <SelectItem value="Bullet Points">Bullet Points</SelectItem>
                                <SelectItem value="Step-by-Step Guide">Step-by-Step Guide</SelectItem>
                                <SelectItem value="Code Block">Code Block</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">AI Enhanced Mode</Label>
                            <div className="text-sm text-muted-foreground">
                                Use AI to craft a superior prompt
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!user?.can_use_ai && (
                                <Badge variant="secondary" className="text-xs">Locked</Badge>
                            )}
                            <Switch
                                checked={isAIMode}
                                onCheckedChange={setIsAIMode}
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
                                <Sparkles className="mr-2 h-4 w-4" /> Generate Prompt
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Generated Result</CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!generatedPrompt}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </CardHeader>
                <CardContent className="flex-1">
                    {generatedPrompt ? (
                        <div className="rounded-md bg-muted p-4 whitespace-pre-wrap min-h-[300px]">
                            {generatedPrompt}
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[300px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                            Result will appear here
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
