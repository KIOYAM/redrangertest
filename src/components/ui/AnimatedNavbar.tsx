'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, User, FolderOpen, Wand2, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function AnimatedNavbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        loadProfile()
    }, [])

    async function loadProfile() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            setProfile(data)
        }
    }

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    const navItems = [
        { href: '/projects', label: 'Projects', icon: FolderOpen },
        { href: '/prompt-builder', label: 'Prompt Builder', icon: Wand2 },
        { href: '/account/profile', label: 'Profile', icon: User },
    ]

    if (profile?.role === 'admin') {
        navItems.push({ href: '/admin/users', label: 'Admin', icon: Shield })
    }

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        >
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />

                    <div className="relative flex items-center justify-between px-6 py-4">
                        {/* Logo */}
                        <Link href="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2"
                            >
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                                    <span className="text-white font-bold text-xl">P</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    PromptGen
                                </span>
                            </motion.div>
                        </Link>

                        {/* Nav Items */}
                        <div className="flex items-center gap-2">
                            {navItems.map((item, index) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link key={item.href} href={item.href}>
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative px-4 py-2 rounded-lg transition-all ${isActive
                                                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white'
                                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <div className="relative flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                )
                            })}

                            {/* Sign Out */}
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSignOut}
                                className="ml-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all flex items-center gap-2 border border-red-500/30"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="text-sm font-medium">Sign Out</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}
