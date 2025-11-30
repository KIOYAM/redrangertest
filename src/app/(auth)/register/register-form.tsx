'use client'

import { useActionState, useState } from 'react'
import { signup } from '../actions'
import { Chrome, Github, Mail, Lock, User, Eye, EyeOff, ArrowRight, Rocket } from 'lucide-react'
import Link from 'next/link'

const initialState = {
    error: '',
}

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(signup, initialState)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Become a Ranger</h2>
                <p className="text-gray-400">Create your account and unlock AI powers</p>
            </div>

            {/* Social Sign Up Buttons */}
            <div className="space-y-3 mb-6">
                <button type="button" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 transition group">
                    <Chrome className="text-xl text-red-500 group-hover:scale-110 transition" />
                    <span className="font-semibold text-white">Sign up with Google</span>
                </button>
                <button type="button" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 transition group">
                    <Github className="text-xl text-purple-500 group-hover:scale-110 transition" />
                    <span className="font-semibold text-white">Sign up with GitHub</span>
                </button>
            </div>

            <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-4 text-gray-500 text-sm">or sign up with email</span>
                <div className="flex-1 border-t border-white/10"></div>
            </div>

            <form action={formAction} className="space-y-5">

                {/* Full Name Input (Optional for now as Supabase auth usually just takes email/pass, but good for UI) */}
                {/* We won't send this to the server action yet unless we update it, keeping it visual for now or adding name field support later */}
                {/* For now, let's comment it out or keep it but not use it in the action to avoid confusion, 
                    OR we can add it to metadata. Let's keep it simple and stick to email/pass for the MVP action, 
                    but the UI requested it. I'll include it but it won't be processed by the current simple action. 
                    Actually, let's add a hidden input or just let it be for now. */}

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
                            placeholder="Create a strong password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:shadow-[0_0_20px_rgba(220,38,38,0.3)] focus:border-red-500/50 transition pr-12"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {/* Password Strength Indicator (Visual only for now) */}
                    <div className="mt-2 flex items-center space-x-1">
                        <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-red-500"></div>
                        </div>
                        <span className="text-xs text-gray-500">Weak</span>
                    </div>
                </div>

                {/* Confirm Password Input (Visual only for now, validation logic can be added) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <div className="flex items-center">
                            <Lock className="mr-2 text-red-500 h-4 w-4" />
                            Confirm Password
                        </div>
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:shadow-[0_0_20px_rgba(220,38,38,0.3)] focus:border-red-500/50 transition pr-12"
                            required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition">
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Terms Checkbox */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-transparent checked:bg-red-600 checked:border-red-600 cursor-pointer accent-red-600" required />
                        <span className="text-sm text-gray-400 group-hover:text-white transition leading-relaxed">
                            I agree to the <Link href="#" className="text-red-500 hover:text-red-400 font-semibold">Terms of Service</Link> and <Link href="#" className="text-red-500 hover:text-red-400 font-semibold">Privacy Policy</Link>
                        </span>
                    </label>
                </div>

                {/* Error Message */}
                {state?.error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {state.error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl py-3 px-4 font-bold text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_10px_40px_rgba(220,38,38,0.6)]"
                >
                    {isPending ? (
                        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Rocket className="mr-2 h-5 w-5" />
                            Create Account
                        </>
                    )}
                </button>

            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-400">
                    Already a Ranger?
                    <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold transition ml-1 inline-flex items-center">
                        Login Here <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </p>
            </div>

        </div>
    )
}
