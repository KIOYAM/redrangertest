'use client'

import { useActionState } from 'react'
import { resetPassword } from '../actions' // We will add this action next
import { motion } from 'framer-motion'
import { Zap, Mail, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const initialState = {
    message: '',
    error: '',
}

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(resetPassword, initialState)

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex items-center justify-center relative">

            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-[#0a0a0a] to-purple-950/20"></div>
                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 py-12">

                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 via-red-600 to-purple-600 rounded-2xl mb-4 shadow-xl shadow-red-500/30">
                        <Zap className="text-white h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {!state.message ? (
                        <>
                            <p className="text-gray-400 mb-6 text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <form action={formAction} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <div className="flex items-center">
                                            <Mail className="mr-2 text-red-500 h-4 w-4" />
                                            Email Address
                                        </div>
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="ranger@redranger.ai"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:shadow-[0_0_20px_rgba(220,38,38,0.3)] focus:border-red-500/50 transition"
                                        required
                                    />
                                </div>

                                {state?.error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                        {state.error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl py-3 px-4 font-bold text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                >
                                    {isPending ? (
                                        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Send Reset Link <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="text-green-500 h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                            <p className="text-gray-300 mb-6">
                                {state.message}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-gray-400 hover:text-white transition inline-flex items-center text-sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
