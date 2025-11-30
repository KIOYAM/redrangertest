'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { LoginForm } from './login-form'

export default function LoginPage() {
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

                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"
                />

                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl"
                />
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-md px-4 py-12">

                {/* Logo Section */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 via-red-600 to-purple-600 rounded-2xl mb-4 shadow-2xl shadow-red-500/50">
                        <Zap className="text-white h-10 w-10" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
                        RedRanger
                    </h1>
                    <p className="text-gray-400">Power up your AI prompts</p>
                </motion.div>

                {/* Login Form Component */}
                <LoginForm />

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-2">
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                        <span>•</span>
                        <a href="#" className="hover:text-white transition">Support</a>
                    </div>
                    <p className="text-xs text-gray-600">© 2024 RedRanger. We generate prompts, not final products.</p>
                </div>

            </div>
        </div>
    )
}
