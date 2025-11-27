'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ComingSoonPanelProps {
    icon: LucideIcon
    title: string
    onClose: () => void
}

export function ComingSoonPanel({ icon: Icon, title, onClose }: ComingSoonPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            {/* Close button */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
                        <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                </div>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Coming Soon Content */}
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-12">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    {/* Animated icon */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100"
                    >
                        <Icon className="h-10 w-10 text-blue-600" />
                    </motion.div>

                    <h3 className="mb-2 text-2xl font-bold text-gray-900">Coming Soon</h3>
                    <p className="mb-6 max-w-md text-gray-600">
                        This tool is currently under development. We're working hard to bring you the best prompt building experience.
                    </p>

                    {/* Progress indicator */}
                    <div className="mb-8 flex items-center justify-center gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                className="h-2 w-2 rounded-full bg-blue-500"
                            />
                        ))}
                    </div>

                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="border-blue-200 hover:bg-blue-50"
                    >
                        ← Back to Tool Hub
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
