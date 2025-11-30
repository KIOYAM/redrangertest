'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Mood = 'idle' | 'thinking' | 'happy' | 'error'
type Size = 'sm' | 'md' | 'lg'

interface AnimeAssistantAvatarProps {
    mood?: Mood
    size?: Size
    className?: string
}

export function AnimeAssistantAvatar({
    mood = 'idle',
    size = 'md',
    className
}: AnimeAssistantAvatarProps) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-20 h-20',
        lg: 'w-32 h-32'
    }

    const glowColors = {
        idle: '#00fff7',
        thinking: '#ff21ff',
        happy: '#6D28D9',
        error: '#ff4444'
    }

    return (
        <motion.div
            className={cn('relative', sizeClasses[size], className)}
            animate={{
                y: [0, -8, 0],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {/* Glow ring */}
            <motion.div
                className="absolute inset-0 rounded-full blur-lg opacity-60"
                style={{
                    background: `radial-gradient(circle, ${glowColors[mood]} 0%, transparent 70%)`
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Character SVG */}
            <svg
                viewBox="0 0 100 100"
                className="relative z-10 drop-shadow-2xl"
            >
                {/* Head/Face circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="url(#faceGradient)"
                    stroke={glowColors[mood]}
                    strokeWidth="2"
                />

                {/* Eyes */}
                {mood === 'thinking' ? (
                    // Closed eyes (thinking)
                    <>
                        <motion.path
                            d="M 35 45 Q 40 48 45 45"
                            stroke={glowColors[mood]}
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <motion.path
                            d="M 55 45 Q 60 48 65 45"
                            stroke={glowColors[mood]}
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </>
                ) : (
                    // Open eyes
                    <>
                        <motion.circle
                            cx="38"
                            cy="45"
                            r="5"
                            fill={glowColors[mood]}
                            animate={{
                                scaleY: [1, 0.1, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                        />
                        <motion.circle
                            cx="62"
                            cy="45"
                            r="5"
                            fill={glowColors[mood]}
                            animate={{
                                scaleY: [1, 0.1, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                        />
                        {/* Eye highlights */}
                        <circle cx="40" cy="43" r="2" fill="white" opacity="0.8" />
                        <circle cx="64" cy="43" r="2" fill="white" opacity="0.8" />
                    </>
                )}

                {/* Mouth */}
                {mood === 'happy' ? (
                    <path
                        d="M 35 60 Q 50 70 65 60"
                        stroke={glowColors[mood]}
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                ) : mood === 'error' ? (
                    <path
                        d="M 35 65 Q 50 55 65 65"
                        stroke={glowColors[mood]}
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                ) : (
                    <circle
                        cx="50"
                        cy="62"
                        r="3"
                        fill={glowColors[mood]}
                    />
                )}

                {/* Hair/Antenna (AI theme) */}
                <motion.path
                    d="M 45 15 L 45 10 M 55 15 L 55 10"
                    stroke={glowColors[mood]}
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <circle cx="45" cy="8" r="2" fill={glowColors[mood]} />
                <circle cx="55" cy="8" r="2" fill={glowColors[mood]} />

                {/* Thinking particles */}
                {mood === 'thinking' && (
                    <>
                        <motion.circle
                            cx="70"
                            cy="30"
                            r="2"
                            fill={glowColors[mood]}
                            opacity="0"
                            animate={{
                                opacity: [0, 1, 0],
                                y: [-5, -10, -15]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                        />
                        <motion.circle
                            cx="75"
                            cy="25"
                            r="1.5"
                            fill={glowColors[mood]}
                            opacity="0"
                            animate={{
                                opacity: [0, 1, 0],
                                y: [-5, -10, -15]
                            }}
                            transition={{
                                duration: 2,
                                delay: 0.3,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                        />
                    </>
                )}

                {/* Gradients */}
                <defs>
                    <radialGradient id="faceGradient">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                    </radialGradient>
                </defs>
            </svg>
        </motion.div>
    )
}
