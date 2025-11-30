'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Mail, ExternalLink, Sparkles } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { CreditPackage } from '@/types/credits'

interface OutOfEnergyModalProps {
    isOpen: boolean
    onClose: () => void
    userEmail?: string
    packages?: CreditPackage[]
}

export function OutOfEnergyModal({
    isOpen,
    onClose,
    userEmail,
    packages = []
}: OutOfEnergyModalProps) {
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    const supportEmail = 'support@redranger.com'
    const subject = 'Morphin Energy Credit Request'
    const body = `Hi RedRanger Team,

I've run out of Morphin Energy and would like to request additional credits.

User: ${userEmail || 'Not logged in'}

Please let me know the next steps.

Thank you!`

    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(supportEmail)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-gradient-to-br from-red-950 via-gray-900 to-black border-2 border-red-600">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                        style={{
                            backgroundImage: 'radial-gradient(circle, #DC2626 1px, transparent 1px)',
                            backgroundSize: '50px 50px',
                        }}
                    />
                </div>

                <div className="relative">
                    <DialogHeader>
                        <div className="mx-auto mb-6">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            >
                                <Zap className="h-24 w-24 text-red-500" />
                            </motion.div>
                        </div>
                        <DialogTitle className="text-center text-4xl font-bold text-white">
                            Out of Morphin Energy!
                        </DialogTitle>
                        <p className="text-center text-lg text-gray-300 mt-2">
                            You've depleted all your energy. Time to recharge, Ranger!
                        </p>
                    </DialogHeader>

                    <div className="mt-8 space-y-6">
                        {/* Contact Support Section */}
                        <div className="rounded-lg border-2 border-red-600 bg-gray-900/50 p-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-red-600 p-3">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Need Help? Contact Support
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        Our team is here to assist you with credit top-ups and any questions.
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            asChild
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            <a href={mailtoLink}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Email Support
                                            </a>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={handleCopyEmail}
                                            className="border-red-600 text-red-400 hover:bg-red-950"
                                        >
                                            {copied ? '✓ Copied!' : 'Copy Email'}
                                        </Button>
                                    </div>

                                    <div className="mt-3 text-sm text-gray-500">
                                        📧 {supportEmail}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Packages */}
                        {packages.length > 0 && (
                            <div>
                                <h3 className="text-center text-2xl font-bold text-white mb-6">
                                    Or Purchase Energy Cells
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {packages.slice(0, 4).map((pkg, index) => (
                                        <motion.div
                                            key={pkg.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`relative rounded-lg border-2 ${pkg.is_popular
                                                    ? 'border-yellow-500 bg-gradient-to-br from-yellow-950/30 to-red-950/30'
                                                    : 'border-red-600/50 bg-gray-900/30'
                                                } p-6 hover:border-red-500 transition-all`}
                                        >
                                            {pkg.is_popular && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                                                        ⭐ MOST POPULAR
                                                    </div>
                                                </div>
                                            )}

                                            <div className="text-center mb-4">
                                                <div className="text-4xl mb-2">{pkg.icon}</div>
                                                <h4 className="text-xl font-bold text-white">{pkg.display_name}</h4>
                                            </div>

                                            <div className="text-center mb-4">
                                                <div className="text-3xl font-bold text-yellow-400">
                                                    {pkg.credits.toLocaleString()}
                                                    {pkg.bonus_credits > 0 && (
                                                        <span className="text-lg text-green-400"> +{pkg.bonus_credits}</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-400">Morphin Energy</div>
                                            </div>

                                            <div className="text-center mb-4">
                                                <div className="text-2xl font-bold text-white">${pkg.price}</div>
                                            </div>

                                            <Button
                                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => router.push('/pricing')}
                                            >
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Select Plan
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="text-center mt-6">
                                    <Button
                                        variant="link"
                                        onClick={() => router.push('/pricing')}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        View All Plans
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
