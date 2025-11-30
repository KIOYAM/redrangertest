'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, User, FolderOpen, DollarSign, Zap, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MorphinEnergyIndicator } from '@/components/credits/MorphinEnergyIndicator'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RangerGroup } from '@/types/ranger-groups'

export function AppNavbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [userId, setUserId] = useState<string | undefined>()
    const [rangerGroups, setRangerGroups] = useState<RangerGroup[]>([])

    useEffect(() => {
        loadProfile()
        loadRangerGroups()
    }, [])

    async function loadProfile() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setUserId(user.id)
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            setProfile(data)
        }
    }

    async function loadRangerGroups() {
        try {
            const response = await fetch('/api/ranger-groups')
            if (response.ok) {
                const data = await response.json()
                setRangerGroups(data.groups || [])
            }
        } catch (error) {
            console.error('Failed to load ranger groups:', error)
        }
    }

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    const navItems = [
        { href: '/projects', label: 'Projects', icon: FolderOpen },
        { href: '/my-energy', label: 'My Energy', icon: Zap },
        { href: '/pricing', label: 'Pricing', icon: DollarSign },
        { href: '/account/profile', label: 'Profile', icon: User },
    ]

    if (profile?.role === 'admin') {
        navItems.push({ href: '/admin/command-center', label: 'Command Center', icon: Zap })
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
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/50">
                                        <Zap className="text-yellow-400 h-5 w-5" />
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                                        RedRanger
                                    </span>
                                </motion.div>
                            </Link>

                            {/* Ranger Groups Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-600/30 hover:border-red-500/50 text-white transition-all"
                                    >
                                        <Zap className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm font-medium">Groups</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700">
                                    {rangerGroups.map((group) => (
                                        <DropdownMenuItem
                                            key={group.id}
                                            onClick={() => router.push(`/groups/${group.name.replace('_ranger', '')}`)}
                                            className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: group.color_primary }}
                                                />
                                                <span className="text-white">{group.display_name}</span>
                                                {group.tool_count !== undefined && (
                                                    <span className="ml-auto text-xs text-gray-400">
                                                        {group.tool_count}
                                                    </span>
                                                )}
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Right Side Nav Items */}
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
                                                    ? 'bg-gradient-to-r from-red-600/30 to-red-700/30 text-white'
                                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
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
