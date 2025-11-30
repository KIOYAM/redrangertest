'use client'

import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex items-center justify-center relative">

            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-[#0a0a0a] to-purple-950/20"></div>
                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 py-12">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-20 h-20 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30"
                    >
                        <Mail className="text-white h-10 w-10" />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white mb-4">Check Your Email</h1>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        We've sent a confirmation link to your email address. Please click the link to activate your Ranger account.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 font-semibold text-white transition flex items-center justify-center"
                        >
                            Back to Login <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
