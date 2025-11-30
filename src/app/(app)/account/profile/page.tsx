'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { PageHeader } from '@/components/ui/PageHeader'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { User, Save, Shield, CheckCircle, XCircle, Mail, Briefcase, Sparkles } from 'lucide-react'
import type { UserProfile, UserType } from '@/types'

const USER_TYPES = [
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'employee', label: 'Employee', icon: '💼' },
    { value: 'business', label: 'Business Owner', icon: '🏢' },
    { value: 'freelancer', label: 'Freelancer', icon: '💻' },
    { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
    { value: 'hr', label: 'HR Professional', icon: '👥' },
    { value: 'developer', label: 'Developer', icon: '⚡' },
    { value: 'other', label: 'Other', icon: '✨' }
]

export default function AccountProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [fullName, setFullName] = useState('')
    const [userType, setUserType] = useState<UserType>('other')
    const [jobRole, setJobRole] = useState('')

    useEffect(() => {
        loadProfile()
    }, [])

    async function loadProfile() {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/profile/me?t=${Date.now()}`, {
                cache: 'no-store'
            })
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login')
                    return
                }
                throw new Error('Failed to load profile')
            }

            const data = await response.json()
            setProfile(data.profile)
            setFullName(data.profile.full_name || '')
            setUserType(data.profile.user_type || 'other')
            setJobRole(data.profile.job_role || '')
        } catch (error) {
            toast.error('Failed to load profile')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSave() {
        setIsSaving(true)
        try {
            const response = await fetch('/api/profile/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName.trim() || null,
                    user_type: userType,
                    job_role: jobRole.trim() || null
                })
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            const data = await response.json()
            setProfile(data.profile)
            toast.success('Profile updated successfully! ✨')
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    if (isLoading) {
        return (
            <PageWrapper variant="gradient" gradientVariant="cyan">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-cyan-600/20 border-t-cyan-600" />
                        <p className="text-gray-300">Loading your profile...</p>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    const selectedUserType = USER_TYPES.find(t => t.value === userType)

    return (
        <PageWrapper variant="gradient" gradientVariant="cyan">
            <div className="min-h-screen pt-32 pb-20 px-4">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <PageHeader
                        title="My Profile"
                        description="Manage your personal information and preferences"
                        icon={User}
                        iconColor="text-cyan-400"
                    />

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-1"
                        >
                            <GlassPanel className="p-8">
                                <div className="text-center">
                                    {/* Avatar */}
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="mx-auto mb-6"
                                    >
                                        <div className="relative inline-block">
                                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 text-3xl font-bold text-white shadow-lg shadow-cyan-500/50">
                                                {profile?.full_name ? getInitials(profile.full_name) : <User className="h-14 w-14" />}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-black/40 flex items-center justify-center">
                                                <Sparkles className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {profile?.full_name || 'Welcome!'}
                                    </h2>
                                    <p className="text-sm text-gray-400 mb-6 flex items-center justify-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {profile?.email}
                                    </p>

                                    {/* Stats */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                            <span className="text-sm text-gray-400">Role</span>
                                            <Badge className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-cyan-300 border-cyan-500/30 capitalize">
                                                <Shield className="h-3 w-3 mr-1" />
                                                {profile?.role}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                            <span className="text-sm text-gray-400">AI Access</span>
                                            {profile?.can_use_ai ? (
                                                <Badge className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-green-300 border-green-500/30">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Enabled
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-gray-400 border-gray-600">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Disabled
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                            <span className="text-sm text-gray-400">Status</span>
                                            {profile?.is_active ? (
                                                <Badge className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-green-300 border-green-500/30">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gradient-to-r from-red-600/30 to-orange-600/30 text-red-300 border-red-500/30">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>

                                        {profile?.user_type && (
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                                <span className="text-sm text-gray-400">Type</span>
                                                <Badge className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 border-purple-500/30">
                                                    <span className="mr-1">{selectedUserType?.icon}</span>
                                                    {selectedUserType?.label}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassPanel>
                        </motion.div>

                        {/* Edit Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <GlassPanel className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20">
                                        <Sparkles className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Edit Your Profile</h2>
                                </div>

                                <div className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Label className="text-gray-300">Full Name</Label>
                                        <Input
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Label className="text-gray-300">I am a...</Label>
                                        <Select value={userType} onValueChange={(val) => setUserType(val as UserType)}>
                                            <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {USER_TYPES.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <span className="flex items-center gap-2">
                                                            <span>{type.icon}</span>
                                                            {type.label}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Label className="text-gray-300">Job Role / Title</Label>
                                        <div className="relative mt-2">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input
                                                value={jobRole}
                                                onChange={(e) => setJobRole(e.target.value)}
                                                placeholder="e.g., Frontend Developer, Marketing Manager"
                                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <Label className="text-gray-300">Email Address</Label>
                                        <Input
                                            value={profile?.email || ''}
                                            disabled
                                            className="mt-2 bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">🔒 Email cannot be changed</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-cyan-500/30"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </motion.div>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
