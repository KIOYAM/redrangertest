'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, User, Mail, Shield, Bell } from 'lucide-react'

export default function SettingsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                setProfile(data)
            }
        }
        getUser()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Update logic here
        setTimeout(() => setLoading(false), 1000)
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 text-white rounded-lg font-medium">
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <Shield className="w-5 h-5" />
                        <span>Security</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                        <span>Notifications</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-xl font-bold mb-6 text-white">Profile Information</h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={profile?.full_name || ''}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <div className="flex items-center bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed">
                                    <Mail className="w-5 h-5 mr-3" />
                                    <span>{user?.email}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            <Save className="mr-2 h-5 w-5" /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
