'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { toast } from 'sonner'

interface ModeToggleProps {
    mode: 'normal' | 'ai'
    canUseAi: boolean
    onChange: (mode: 'normal' | 'ai') => void
}

export function ModeToggle({ mode, canUseAi, onChange }: ModeToggleProps) {
    const handleAiClick = () => {
        if (!canUseAi) {
            toast.error('AI access is not enabled for your account. Contact admin.')
            return
        }
        onChange('ai')
    }

    return (
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
            {/* Normal Mode */}
            <button
                onClick={() => onChange('normal')}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'normal'
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                {mode === 'normal' && (
                    <motion.div
                        layoutId="mode-indicator"
                        className="absolute inset-0 rounded-md bg-white shadow-sm"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                )}
                <span className="relative">Normal</span>
            </button>

            {/* AI Mode */}
            <motion.button
                onClick={handleAiClick}
                animate={!canUseAi && mode === 'ai' ? { x: [-2, 2, -2, 2, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'ai'
                        ? 'text-gray-900'
                        : canUseAi
                            ? 'text-gray-600 hover:text-gray-900'
                            : 'text-gray-400 cursor-not-allowed'
                    }`}
                disabled={!canUseAi}
            >
                {mode === 'ai' && (
                    <motion.div
                        layoutId="mode-indicator"
                        className="absolute inset-0 rounded-md bg-white shadow-sm"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    AI
                </span>
            </motion.button>
        </div>
    )
}
