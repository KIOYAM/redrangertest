'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { RangerGroupCard } from '@/components/rangers/RangerGroupCard'
import type { RangerGroup } from '@/types/ranger-groups'

export default function HomePage() {
    const [groups, setGroups] = useState<RangerGroup[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        try {
            const response = await fetch('/api/ranger-groups')
            if (response.ok) {
                const data = await response.json()
                setGroups(data.groups || [])
            }
        } catch (error) {
            console.error('Failed to fetch groups:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageWrapper variant="gradient" gradientVariant="red">
            {/* Hero Section */}
            <section className="relative py-20 pt-32">
                <div className="relative container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Logo / Icon */}
                        <motion.div
                            className="inline-block mb-8"
                            animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity
                            }}
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50">
                                <Zap className="h-12 w-12 text-yellow-400" />
                            </div>
                        </motion.div>

                        <h1 className="text-6xl md:text-7xl font-bold mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
                                Choose Your Power
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4">
                            Select your Ranger group and unlock AI-powered tools for work, learning, creativity, and more
                        </p>

                        <p className="text-sm text-gray-500">
                            Your journey begins here. Each Ranger represents a different aspect of your life.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Ranger Groups Grid */}
            <section className="py-12 pb-20">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-600"></div>
                            <p className="text-gray-400 mt-4">Loading Ranger Powers...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {groups.map((group, index) => (
                                <RangerGroupCard key={group.id} group={group} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16">
                <GlassPanel className="p-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Powered by Morphin Energy ⚡
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Each tool requires Morphin Energy to use. Start with 100 free energy and recharge anytime to keep your AI tools powered up.
                        </p>
                    </div>
                </GlassPanel>
            </section>
        </PageWrapper>
    )
}
