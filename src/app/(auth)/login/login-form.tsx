'use client'

import { useActionState, useState } from 'react'
import { login } from '../actions'
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Github, Chrome } from 'lucide-react'
import Link from 'next/link'

const initialState = {
    error: '',
}

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, initialState)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Ranger</h2>
                <p className="text-gray-400">Login to access your power tools</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
                <button type="button" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 transition group">
                    <Chrome className="text-xl text-red-500 group-hover:scale-110 transition" />
                    <span className="font-semibold text-white">Continue with Google</span>
                </button>
                <button type="button" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 transition group">
                    <Github className="text-xl text-purple-500 group-hover:scale-110 transition" />
                    <span className="font-semibold text-white">Continue with GitHub</span>
                </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-4 text-gray-500 text-sm">or login with email</span>
                <div className="flex-1 border-t border-white/10"></div>
            </div>

            {/* Login Form */}
            <form action={formAction} className="space-y-5">

                {/* Email Input */}
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

                {/* Password Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <div className="flex items-center">
                            <Lock className="mr-2 text-red-500 h-4 w-4" />
                            Password
                        </div>
                    </label>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:shadow-[0_0_20px_rgba(220,38,38,0.3)] focus:border-red-500/50 transition pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {state?.error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {state.error}
                    </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-transparent checked:bg-red-600 checked:border-red-600 cursor-pointer accent-red-600" />
                        <span className="text-sm text-gray-400 group-hover:text-white transition">Remember me</span>
                    </label>
                    <Link href="#" className="text-sm text-red-500 hover:text-red-400 transition font-semibold">
                        Forgot Password?
                    </Link>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl py-3 px-4 font-bold text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_10px_40px_rgba(220,38,38,0.6)]"
                >
                    {isPending ? (
                        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Zap className="mr-2 h-5 w-5 fill-white" />
                            Morph In
                        </>
                    )}
                </button>

            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
                <p className="text-gray-400">
                    New Ranger?
                    <Link href="/register" className="text-red-500 hover:text-red-400 font-semibold transition ml-1 inline-flex items-center">
                        Create Account <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </p>
            </div>

        </div>
    )
}
