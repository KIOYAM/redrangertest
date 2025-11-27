import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export type PromptMode = 'normal' | 'ai'

export function usePromptMode(canUseAi: boolean = false) {
    const [mode, setMode] = useState<PromptMode>('normal')

    const toggleMode = useCallback((checked: boolean) => {
        if (checked) {
            // User wants to switch TO AI mode
            if (!canUseAi) {
                toast.error('AI access is not enabled for your account. Contact admin.')
                return
            }
            setMode('ai')
        } else {
            // User wants to switch TO Normal mode
            setMode('normal')
        }
    }, [canUseAi])

    return {
        mode,
        isAIMode: mode === 'ai',
        toggleMode,
        setMode
    }
}
