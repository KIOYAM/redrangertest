'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface PromptInputBoxProps {
    onSend: (prompt: string, toolName?: string) => void
    isGenerating: boolean
}

export function PromptInputBox({ onSend, isGenerating }: PromptInputBoxProps) {
    const [prompt, setPrompt] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!prompt.trim() || isGenerating) return

        onSend(prompt.trim())
        setPrompt('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
            <div className="flex gap-2">
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    className="min-h-[60px] max-h-[200px] resize-none"
                    disabled={isGenerating}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="h-[60px] w-[60px]"
                    disabled={!prompt.trim() || isGenerating}
                >
                    {isGenerating ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Send className="h-5 w-5" />
                    )}
                </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
                AI responses use this project's conversation history for context
            </p>
        </form>
    )
}
