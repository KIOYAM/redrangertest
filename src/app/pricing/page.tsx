'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Check, Sparkles, Crown, Shield, Star } from 'lucide-react'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/button'
import type { CreditPackage } from '@/types/credits'

export default function PricingPage() {
    const [packages, setPackages] = useState<CreditPackage[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        try {
            const response = await fetch('/api/credits/packages')
            if (response.ok) {
                const data = await response.json()
                setPackages(data.packages || [])
            }
        } catch (error) {
            console.error('Failed to fetch packages:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePurchase = (pkg: CreditPackage) => {
        // TODO: Implement payment flow
        alert(`Payment integration coming soon for ${pkg.display_name}!`)
    }

    return (
        <PageWrapper variant="gradient" gradientVariant="red">
            <div className="relative container mx-auto px-4 py-16 pt-32">
                {/* Header */}
                <PageHeader
                    title="Recharge Your Energy"
                    description="Power up your AI with Morphin Energy cells"
                    icon={Zap}
                    iconColor="text-yellow-400"
                >
                    <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-red-500" />
                            <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <span>Instant Activation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-blue-500" />
                            <span>Bonus Energy</span>
                        </div>
                    </div>
                </PageHeader>

                {/* Pricing Cards */}
                {isLoading ? (
                    <div className="text-center text-white">Loading packages...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {packages.map((pkg, index) => {
                            const Icon = pkg.icon.includes('👑') ? Crown : Zap
                            const totalCredits = pkg.credits + pkg.bonus_credits

                            return (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15 }}
                                    className="relative"
                                >
                                    {/* Popular Badge */}
                                    {pkg.is_popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.05, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-1 rounded-full text-xs font-bold shadow-lg"
                                            >
                                                ⭐ MOST POPULAR
                                            </motion.div>
                                        </div>
                                    )}

                                    <div
                                        className={`relative h-full rounded-2xl border-2 ${pkg.is_popular
                                                ? 'border-yellow-500 bg-gradient-to-br from-yellow-950/50 via-red-950/50 to-black shadow-2xl shadow-yellow-500/20'
                                                : 'border-red-600/50 bg-gradient-to-br from-gray-900/50 to-black hover:border-red-500'
                                            } p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${pkg.is_popular ? 'scale-105' : ''
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className="text-center mb-6">
                                            <motion.div
                                                animate={{
                                                    rotate: pkg.is_popular ? [0, 10, -10, 0] : 0,
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                                className="inline-block"
                                            >
                                                <div className="text-6xl mb-2">{pkg.icon}</div>
                                            </motion.div>
                                            <h3 className="text-2xl font-bold text-white">{pkg.display_name}</h3>
                                        </div>

                                        {/* Credits */}
                                        <div className="text-center mb-6">
                                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                                                {pkg.credits.toLocaleString()}
                                            </div>
                                            {pkg.bonus_credits > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: index * 0.15 + 0.3 }}
                                                    className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                                                >
                                                    +{pkg.bonus_credits} BONUS!
                                                </motion.div>
                                            )}
                                            <div className="text-sm text-gray-400 mt-2">Morphin Energy</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Total: {totalCredits.toLocaleString()} credits
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-center mb-6">
                                            <div className="text-4xl font-bold text-white mb-1">
                                                ${pkg.price}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                ${(pkg.price / totalCredits).toFixed(3)} per credit
                                            </div>
                                        </div>

                                        {/* Features */}
                                        {pkg.features && Array.isArray(pkg.features) && (
                                            <div className="space-y-3 mb-8">
                                                {pkg.features.map((feature: string, idx: number) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.15 + idx * 0.05 }}
                                                        className="flex items-start gap-2 text-sm text-gray-300"
                                                    >
                                                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                                        <span>{feature}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* CTA Button */}
                                        <Button
                                            onClick={() => handlePurchase(pkg)}
                                            className={`w-full ${pkg.is_popular
                                                    ? 'bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white'
                                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                                } font-semibold py-6 text-lg shadow-lg`}
                                        >
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Get {pkg.display_name}
                                        </Button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* FAQ / Info Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 max-w-4xl mx-auto"
                >
                    <GlassPanel className="p-8 bg-gray-900/50 border-red-600/30">
                        <h2 className="text-3xl font-bold text-white text-center mb-8">
                            Morphin Energy Usage
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/30 rounded-lg p-6">
                                <div className="text-yellow-400 font-semibold mb-2">Developer Tool</div>
                                <div className="text-2xl font-bold text-white">10 Energy</div>
                                <div className="text-sm text-gray-400 mt-1">Per code generation</div>
                            </div>

                            <div className="bg-black/30 rounded-lg p-6">
                                <div className="text-yellow-400 font-semibold mb-2">Design Tool</div>
                                <div className="text-2xl font-bold text-white">15 Energy</div>
                                <div className="text-sm text-gray-400 mt-1">Per image creation</div>
                            </div>

                            <div className="bg-black/30 rounded-lg p-6">
                                <div className="text-yellow-400 font-semibold mb-2">Content Tool</div>
                                <div className="text-2xl font-bold text-white">8 Energy</div>
                                <div className="text-sm text-gray-400 mt-1">Per content piece</div>
                            </div>

                            <div className="bg-black/30 rounded-lg p-6">
                                <div className="text-yellow-400 font-semibold mb-2">Email Tool</div>
                                <div className="text-2xl font-bold text-white">5 Energy</div>
                                <div className="text-sm text-gray-400 mt-1">Per email draft</div>
                            </div>
                        </div>
                    </GlassPanel>
                </motion.div>
            </div>
        </PageWrapper>
    )
}
