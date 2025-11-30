'use client'

import { motion } from 'framer-motion'

interface LiquidEnergyProps {
    current: number
    max: number
}

export function LiquidEnergy({ current, max }: LiquidEnergyProps) {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100))

    // Dynamic color based on percentage
    const getColor = (p: number) => {
        if (p <= 20) return "from-red-600 via-red-500 to-orange-500"
        if (p <= 60) return "from-yellow-600 via-orange-500 to-yellow-400"
        return "from-green-600 via-emerald-500 to-green-400"
    }

    const gradientClass = getColor(percentage)

    return (
        <div className="w-full sm:w-48 h-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden group">
            {/* Liquid Fill */}
            <motion.div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${gradientClass} transition-colors duration-1000`}
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                {/* Wave Surface */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] -translate-y-1/2 scale-x-150 animate-pulse opacity-60"></div>

                {/* Wavering Animation Overlay */}
                <motion.div
                    animate={{ x: [-20, 0, -20] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-[-20%] right-[-20%] h-4 bg-white/20 blur-md transform -translate-y-1/2 rounded-[100%]"
                />

                {/* Bubbles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bottom-0 bg-white/30 rounded-full"
                            style={{
                                width: Math.random() * 10 + 5,
                                height: Math.random() * 10 + 5,
                                left: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -300],
                                opacity: [0, 0.8, 0],
                                x: [0, Math.random() * 40 - 20]
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <div className="text-5xl font-black text-white mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        {current}
                    </div>
                    <div className="text-sm font-semibold text-white/90 drop-shadow-md uppercase tracking-wider">
                        ⚡ Energy
                    </div>
                    <div className="text-[10px] text-white/70 mt-1">
                        Cap: {max}
                    </div>
                </motion.div>
            </div>

            {/* Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl"></div>
        </div>
    )
}
