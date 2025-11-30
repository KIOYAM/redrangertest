'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function NebulaAnimatedBackground({ children }: { children: React.ReactNode }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Generate floating particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 10 + 20
    }))

    // Generate shooting stars
    const shootingStars = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        delay: i * 8,
        duration: 3
    }))

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0a0014]">
            {/* Animated Nebula Background Layers */}
            <div className="fixed inset-0 z-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#120029] via-[#2d0060] to-[#0a0014]" />

                {/* Animated nebula clouds - Layer 1 */}
                <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `radial-gradient(circle at 20% 50%, #6D28D9 0%, transparent 50%), 
                                   radial-gradient(circle at 80% 80%, #ff21ff 0%, transparent 50%)`,
                        filter: 'blur(80px)'
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0],
                        x: mousePosition.x * 0.5,
                        y: mousePosition.y * 0.5
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Animated nebula clouds - Layer 2 */}
                <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at 60% 30%, #00fff7 0%, transparent 60%), 
                                   radial-gradient(circle at 40% 70%, #6D28D9 0%, transparent 60%)`,
                        filter: 'blur(100px)'
                    }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -5, 0],
                        x: mousePosition.x * -0.3,
                        y: mousePosition.y * -0.3
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Glowing orbs overlay */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, #ff21ff 0%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, #00fff7 0%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                    animate={{
                        scale: [1.5, 1, 1.5],
                        opacity: [0.2, 0.1, 0.2]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Floating Particles */}
            <div className="fixed inset-0 z-10 pointer-events-none">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute w-1 h-1 rounded-full bg-white/40"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            scale: particle.scale
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Shooting Stars */}
            <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
                {shootingStars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            boxShadow: '0 0 10px 2px rgba(255,255,255,0.8), 0 0 20px 4px rgba(0,255,247,0.4)'
                        }}
                        initial={{
                            x: '0%',
                            y: '0%',
                            opacity: 0
                        }}
                        animate={{
                            x: ['0%', '100%'],
                            y: ['0%', '50%'],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: star.duration,
                            delay: star.delay,
                            repeat: Infinity,
                            repeatDelay: 20,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </div>

            {/* Floating Geometric Shapes */}
            <div className="fixed inset-0 z-10 pointer-events-none">
                {/* Hexagons */}
                <motion.div
                    className="absolute top-20 right-20 w-20 h-20 opacity-10"
                    animate={{
                        rotate: 360,
                        y: [0, -20, 0]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon
                            points="50 1 95 25 95 75 50 99 5 75 5 25"
                            fill="none"
                            stroke="#ff21ff"
                            strokeWidth="2"
                            style={{ filter: 'drop-shadow(0 0 10px #ff21ff)' }}
                        />
                    </svg>
                </motion.div>

                {/* Energy Rings */}
                <motion.div
                    className="absolute bottom-40 left-40 w-32 h-32 opacity-20"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: -360
                    }}
                    transition={{
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                    }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#00fff7"
                            strokeWidth="1"
                            strokeDasharray="10 5"
                            style={{ filter: 'drop-shadow(0 0 8px #00fff7)' }}
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#6D28D9"
                            strokeWidth="1"
                            strokeDasharray="5 10"
                            style={{ filter: 'drop-shadow(0 0 6px #6D28D9)' }}
                        />
                    </svg>
                </motion.div>

                {/* Triangles */}
                <motion.div
                    className="absolute top-1/2 left-1/4 w-16 h-16 opacity-15"
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon
                            points="50 10, 90 90, 10 90"
                            fill="none"
                            stroke="#ff21ff"
                            strokeWidth="2"
                            style={{ filter: 'drop-shadow(0 0 8px #ff21ff)' }}
                        />
                    </svg>
                </motion.div>
            </div>

            {/* Content with parallax */}
            <motion.div
                className="relative z-20"
                style={{
                    x: mousePosition.x * 0.1,
                    y: mousePosition.y * 0.1
                }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 100
                }}
            >
                {children}
            </motion.div>

            {/* Subtle scan lines overlay */}
            <div
                className="fixed inset-0 z-30 pointer-events-none opacity-5"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
                }}
            />
        </div>
    )
}
