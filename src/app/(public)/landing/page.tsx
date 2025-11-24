'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="#">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg font-bold">PromptGen</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                        Sign In
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
                        Sign Up
                    </Link>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50 dark:bg-gray-900">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-2"
                            >
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Generate Perfect Prompts <br />
                                    <span className="text-primary">Powered by AI</span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Create high-quality prompts for any task. Use our standard templates or unlock AI-powered generation for superior results.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="space-x-4"
                            >
                                <Link href="/register">
                                    <Button size="lg" className="h-12 px-8">
                                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="h-12 px-8">
                                        Log In
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center space-y-4 text-center"
                            >
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Instant Generation</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Generate prompts in seconds using our optimized templates.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center space-y-4 text-center"
                            >
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">AI Powered</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Unlock advanced AI capabilities to craft the perfect prompt for complex tasks.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center space-y-4 text-center"
                            >
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Role-Based Access</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Secure environment with role-based permissions and admin controls.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    © 2024 PromptGen. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
