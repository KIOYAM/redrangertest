'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Zap, Briefcase, GraduationCap, Palette, Heart, Code, Crown,
    ArrowRight, Twitter, Github, Disc, Menu, Star
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#0D0D10] text-white overflow-x-hidden font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D10]/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                                <Zap className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-orbitron)' }}>
                                RedRanger
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="#rangers" className="text-gray-300 hover:text-white transition-colors">Rangers</Link>
                            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
                            <Link href="#energy" className="text-gray-300 hover:text-white transition-colors">My Energy</Link>
                            <Link href="/login" className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold text-white">
                                Sign In
                            </Link>
                        </div>
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 p-4">
                        <div className="flex flex-col space-y-4">
                            <Link href="#rangers" className="text-gray-300 hover:text-white transition">Rangers</Link>
                            <Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
                            <Link href="#energy" className="text-gray-300 hover:text-white transition">My Energy</Link>
                            <Link href="/login" className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg text-center font-semibold text-white">
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-10 w-64 h-64 bg-red-600/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 sm:mb-20">
                        {/* Energy Orb */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="flex justify-center mb-8 sm:mb-12"
                        >
                            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-full opacity-60 blur-xl"></div>
                                <div className="absolute inset-2 bg-gradient-to-br from-red-600 via-yellow-600 to-blue-600 rounded-full flex items-center justify-center">
                                    <Zap className="text-white h-12 w-12 sm:h-16 sm:w-16" />
                                </div>
                            </div>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'var(--font-orbitron)' }}>
                            CHOOSE YOUR POWER
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                            Unlock AI-powered prompt generation tools
                        </p>
                        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4 mb-8 sm:mb-10">
                            We don't generate final apps or images. We generate <span className="text-yellow-400 font-semibold">perfectly optimized PROMPTS</span> that you can feed into other AI tools like Cursor, Midjourney, and ChatGPT to get the best results.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold text-base sm:text-lg text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] flex items-center justify-center">
                                Start Morphin' <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-all font-semibold text-base sm:text-lg text-white flex items-center justify-center">
                                View Pricing <Zap className="ml-2 h-5 w-5 text-yellow-400" />
                            </Link>
                        </div>
                    </div>

                    {/* Ranger Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">

                        {/* Red Ranger */}
                        <Link href="/login">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 cursor-pointer group hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all duration-300 h-full"
                            >
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Briefcase className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-red-500 bg-red-500/20 px-3 py-1 rounded-full" style={{ fontFamily: 'var(--font-orbitron)' }}>12 Tools</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-red-500 group-hover:text-red-400 transition-colors" style={{ fontFamily: 'var(--font-orbitron)' }}>RED RANGER</h3>
                                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Power up your professional work</p>
                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                                    <span>Work • Professional</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Blue Ranger */}
                        <Link href="/login">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 cursor-pointer group hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 h-full"
                            >
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <GraduationCap className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-blue-500 bg-blue-500/20 px-3 py-1 rounded-full" style={{ fontFamily: 'var(--font-orbitron)' }}>8 Tools</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-blue-500 group-hover:text-blue-400 transition-colors" style={{ fontFamily: 'var(--font-orbitron)' }}>BLUE RANGER</h3>
                                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Master new skills and knowledge</p>
                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                                    <span>Learn • Education</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Yellow Ranger */}
                        <Link href="/login">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 cursor-pointer group hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all duration-300 h-full"
                            >
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Palette className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-yellow-500 bg-yellow-500/20 px-3 py-1 rounded-full" style={{ fontFamily: 'var(--font-orbitron)' }}>15 Tools</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-yellow-500 group-hover:text-yellow-400 transition-colors" style={{ fontFamily: 'var(--font-orbitron)' }}>YELLOW RANGER</h3>
                                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Unleash your creative potential</p>
                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                                    <span>Create • Creativity</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Green Ranger */}
                        <Link href="/login">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 cursor-pointer group hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300 h-full"
                            >
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Heart className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-green-500 bg-green-500/20 px-3 py-1 rounded-full" style={{ fontFamily: 'var(--font-orbitron)' }}>10 Tools</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-green-500 group-hover:text-green-400 transition-colors" style={{ fontFamily: 'var(--font-orbitron)' }}>GREEN RANGER</h3>
                                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Organize your personal life</p>
                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                                    <span>Life • Personal</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                        {/* Black Ranger */}
                        <Link href="/login">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 cursor-pointer group hover:shadow-[0_0_30px_rgba(31,41,55,0.8)] transition-all duration-300 h-full"
                            >
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-600">
                                        <Code className="text-white h-6 w-6 sm:h-8 sm:w-8" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full border border-gray-600" style={{ fontFamily: 'var(--font-orbitron)' }}>6 Tools</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-300 group-hover:text-gray-200 transition-colors" style={{ fontFamily: 'var(--font-orbitron)' }}>BLACK RANGER</h3>
                                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Advanced system architecture</p>
                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                                    <span>Pro • Advanced</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                        {/* White Ranger */}
                        <Link href="/login">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 cursor-pointer group hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 border-2 border-white/20 h-full"
                            >
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Crown className="text-yellow-600 h-6 w-6 sm:h-8 sm:w-8" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-white bg-white/20 px-3 py-1 rounded-full flex items-center gap-1 border border-white/30" style={{ fontFamily: 'var(--font-orbitron)' }}>
                                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> 4 Tools
                                    </span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white group-hover:text-gray-100 transition-colors" style={{ fontFamily: 'var(--font-orbitron)' }}>WHITE RANGER</h3>
                                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Exclusive premium power tools</p>
                                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                                    <span>Premium • Legendary</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>How It Works</h2>
                        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                            Three simple steps to unlock the power of AI-optimized prompts
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <span className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>1</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Choose Your Ranger</h3>
                            <p className="text-sm sm:text-base text-gray-400">Select the context that matches your needs - Work, Learn, Create, or Life</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <span className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>2</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Pick Your Tool</h3>
                            <p className="text-sm sm:text-base text-gray-400">Select from specialized prompt generators designed for specific AI platforms</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <span className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>3</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Get Your Prompt</h3>
                            <p className="text-sm sm:text-base text-gray-400">Receive optimized prompts ready to use in Cursor, ChatGPT, Midjourney, and more</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Energy System Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-yellow-600/10 to-blue-600/10 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 text-center">
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-500 to-red-600 rounded-full flex items-center justify-center"
                            >
                                <Zap className="text-white h-10 w-10 sm:h-12 sm:w-12" />
                            </motion.div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>Morphin Energy System</h2>
                        <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                            Every tool usage costs Morphin Energy. Recharge your power cells to keep generating perfect prompts.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-6 py-4 w-full sm:w-auto">
                                <div className="text-xs sm:text-sm text-gray-400 mb-1">Average Cost</div>
                                <div className="text-2xl sm:text-3xl font-bold text-yellow-400" style={{ fontFamily: 'var(--font-orbitron)' }}>⚡ 10 Energy</div>
                            </div>
                            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-600 rounded-xl hover:from-yellow-600 hover:to-red-700 transition-all font-bold text-base sm:text-lg text-white flex items-center justify-center">
                                View Energy Plans
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                                    <Zap className="text-white h-5 w-5" />
                                </div>
                                <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>RedRanger</span>
                            </div>
                            <p className="text-sm text-gray-400">AI-powered prompt generation platform for the modern creator.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>Rangers</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Red Ranger</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Blue Ranger</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Yellow Ranger</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Green Ranger</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>Connect</h4>
                            <div className="flex space-x-4">
                                <Link href="#" className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-white">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-white">
                                    <Github className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-white">
                                    <Disc className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2024 RedRanger. All rights reserved. Powered by Morphin Energy.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
