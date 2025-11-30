'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Home, Users, History, Star, CreditCard, Settings, ChevronRight, LogOut } from 'lucide-react'

export function Sidebar({ user }: { user: any }) {
    const pathname = usePathname()

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/my-energy', label: 'My Energy', icon: Zap },
        { href: '/rangers', label: 'All Rangers', icon: Users },
        { href: '/history', label: 'History', icon: History },
        { href: '/favorites', label: 'Favorites', icon: Star },
        { href: '/pricing', label: 'Pricing', icon: CreditCard },
        { href: '/settings', label: 'Settings', icon: Settings },
    ]

    return (
        <aside className="w-full lg:w-56 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen sticky top-0">
            <div className="p-4 border-b border-white/10">
                <Link href="/dashboard" className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                        <Zap className="text-white h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        RedRanger
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm ${isActive
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-3 border-t border-white/10">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all group">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                        <span className="font-bold text-xs" style={{ fontFamily: 'var(--font-orbitron)' }}>
                            {user?.email?.substring(0, 2).toUpperCase() || 'RR'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs truncate text-white">Ranger</div>
                        <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
                    </div>
                    <ChevronRight className="text-gray-400 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-1">
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all text-xs">
                            <LogOut className="w-3 h-3" />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    )
}
