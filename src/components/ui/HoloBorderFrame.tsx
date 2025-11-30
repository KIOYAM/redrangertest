'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export function HoloBorderFrame({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen">
            {/* Animated Holographic Border Frame */}
            <div className="fixed inset-0 z-50 pointer-events-none">
                {/* Top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff21ff] to-transparent opacity-60 animate-pulse-glow" />
                <div className="absolute top-0 left-0 right-0 h-[2px]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#00fff7] via-[#ff21ff] to-[#00fff7]"
                        style={{
                            boxShadow: '0 0 20px #ff21ff, 0 0 40px #00fff7'
                        }}
                        animate={{
                            opacity: [0.4, 0.8, 0.4],
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6D28D9] to-transparent opacity-60 animate-pulse-glow" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#6D28D9] via-[#ff21ff] to-[#6D28D9]"
                        style={{
                            boxShadow: '0 0 20px #6D28D9, 0 0 40px #ff21ff'
                        }}
                        animate={{
                            opacity: [0.4, 0.8, 0.4],
                            backgroundPosition: ['100% 50%', '0% 50%', '100% 50%']
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Left border */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-[#00fff7] to-transparent opacity-60 animate-pulse-glow" />
                <div className="absolute top-0 bottom-0 left-0 w-[2px]">
                    <motion.div
                        className="w-full h-full bg-gradient-to-b from-[#ff21ff] via-[#00fff7] to-[#ff21ff]"
                        style={{
                            boxShadow: '0 0 20px #00fff7, 0 0 40px #ff21ff'
                        }}
                        animate={{
                            opacity: [0.4, 0.8, 0.4],
                            backgroundPosition: ['50% 0%', '50% 100%', '50% 0%']
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Right border */}
                <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-[#6D28D9] to-transparent opacity-60 animate-pulse-glow" />
                <div className="absolute top-0 bottom-0 right-0 w-[2px]">
                    <motion.div
                        className="w-full h-full bg-gradient-to-b from-[#6D28D9] via-[#ff21ff] to-[#6D28D9]"
                        style={{
                            boxShadow: '0 0 20px #6D28D9, 0 0 40px #ff21ff'
                        }}
                        animate={{
                            opacity: [0.4, 0.8, 0.4],
                            backgroundPosition: ['50% 100%', '50% 0%', '50% 100%']
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Corner accent glows */}
                {/* Top-left */}
                <motion.div
                    className="absolute top-0 left-0 w-32 h-32"
                    style={{
                        background: 'radial-gradient(circle at top left, rgba(0,255,247,0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Top-right */}
                <motion.div
                    className="absolute top-0 right-0 w-32 h-32"
                    style={{
                        background: 'radial-gradient(circle at top right, rgba(255,33,255,0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        delay: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Bottom-left */}
                <motion.div
                    className="absolute bottom-0 left-0 w-32 h-32"
                    style={{
                        background: 'radial-gradient(circle at bottom left, rgba(109,40,217,0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        delay: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Bottom-right */}
                <motion.div
                    className="absolute bottom-0 right-0 w-32 h-32"
                    style={{
                        background: 'radial-gradient(circle at bottom right, rgba(0,255,247,0.4) 0%, transparent 70%)',
                        filter: 'blur(20px)'
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        delay: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Floating corner elements */}
                {/* Top-left corner icon */}
                <motion.div
                    className="absolute top-4 left-4 w-3 h-3 opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg viewBox="0 0 10 10" className="w-full h-full">
                        <circle cx="5" cy="5" r="4" fill="none" stroke="#00fff7" strokeWidth="1" />
                        <circle cx="5" cy="5" r="2" fill="#00fff7" />
                    </svg>
                </motion.div>

                {/* Top-right corner icon */}
                <motion.div
                    className="absolute top-4 right-4 w-3 h-3 opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: 360,
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <svg viewBox="0 0 10 10" className="w-full h-full">
                        <polygon points="5 1, 9 9, 1 9" fill="none" stroke="#ff21ff" strokeWidth="1" />
                    </svg>
                </motion.div>

                {/* Bottom-left corner icon */}
                <motion.div
                    className="absolute bottom-4 left-4 w-3 h-3 opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: -360,
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <svg viewBox="0 0 10 10" className="w-full h-full">
                        <rect x="1" y="1" width="8" height="8" fill="none" stroke="#6D28D9" strokeWidth="1" />
                    </svg>
                </motion.div>

                {/* Bottom-right corner icon */}
                <motion.div
                    className="absolute bottom-4 right-4 w-3 h-3 opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg viewBox="0 0 10 10" className="w-full h-full">
                        <line x1="2" y1="5" x2="8" y2="5" stroke="#00fff7" strokeWidth="1" />
                        <line x1="5" y1="2" x2="5" y2="8" stroke="#00fff7" strokeWidth="1" />
                    </svg>
                </motion.div>
            </div>

            {/* Content */}
            {children}

            {/* Add custom keyframe animation for pulsing glow */}
            <style jsx global>{`
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
