'use client'

import { ReactNode } from 'react'
import { NebulaAnimatedBackground } from '@/components/ui/NebulaAnimatedBackground'
import { HoloBorderFrame } from '@/components/ui/HoloBorderFrame'

interface AnimeWorkspaceShellProps {
    children: ReactNode
}

/**
 * Reusable anime-style workspace shell with:
 * - Animated nebula background
 * - Holographic border frame
 * - Optimized for full-page immersive experience
 */
export function AnimeWorkspaceShell({ children }: AnimeWorkspaceShellProps) {
    return (
        <NebulaAnimatedBackground>
            <HoloBorderFrame>
                <div className="min-h-screen py-8 px-4">
                    {children}
                </div>
            </HoloBorderFrame>
        </NebulaAnimatedBackground>
    )
}
