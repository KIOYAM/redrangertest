'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { PageHeader } from '@/components/ui/PageHeader'
import { toast } from 'sonner'
import { User, Save, Shield, CheckCircle, XCircle } from 'lucide-react'
import type { UserProfile, UserType } from '@/types'

const USER_TYPES = [
    { value: 'student', label: 'Student' },
    { value: 'employee', label: 'Employee' },
    { value: 'business', label: 'Business Owner' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'other', label: 'Other' }
]

export default function ProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [fullName, setFullName] = useState('')
    const [userType, setUserType] = useState<UserType>('other')

    useEffect(() => {
        loadProfile()
    }, [])

    async function loadProfile() {
        setIsLoading(true)
        try {
            // Add timestamp to prevent caching
            const response = await fetch(`/api/profile?t=${Date.now()}`, {
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
            console.log('Profile loaded:', data.profile.email) // Debug log
            setProfile(data.profile)
            setFullName(data.profile.full_name || '')
            setUserType(data.profile.user_type || 'other')
        } catch (error) {
            console.error('Profile load error:', error)
            toast.error('Failed to load profile')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSave() {
        setIsSaving(true)
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName.trim() || null,
                    user_type: userType
                })
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            const data = await response.json()
            setProfile(data.profile)
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <PageWrapper variant="dark">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-purple-600" />
                        <p className="text-gray-400">Loading profile...</p>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper variant="gradient" gradientVariant="cyan">
            <div className="mx-auto max-w-3xl px-4 py-12 pt-32">
                <PageHeader
                    title="My Profile"
                    description="Manage your account settings and preferences"
                    icon={User}
                    iconColor="cyan"
                />

                <GlassPanel className="p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex items-center gap-4"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30">
                            <User className="h-10 w-10 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Email</p>
                            <p className="font-medium text-white">{profile?.email}</p>
                            <p className="text-xs text-gray-500">ID: {profile?.id?.slice(0, 8)}...</p>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>

                        <div>
                            <Label htmlFor="userType" className="text-gray-300">I am a...</Label>
                            <Select value={userType} onValueChange={(val) => setUserType(val as UserType)}>
                                <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                    {USER_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value} className="text-white">
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="mt-2 text-sm text-gray-400">
                                This helps us customize your experience
                            </p>
                        </div>

                        <GlassPanel hover={false} className="p-6 bg-black/20">
                            <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-purple-400" />
                                Account Status
                            </h3>
                            <div className="mt-3 space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Role:</span>
                                    <span className="font-medium text-white capitalize px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30">
                                        {profile?.role}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">AI Access:</span>
                                    <div className="flex items-center gap-2">
                                        {profile?.can_use_ai ? (
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-gray-500" />
                                        )}
                                        <span className={`font-medium ${profile?.can_use_ai ? 'text-green-400' : 'text-gray-500'}`}>
                                            {profile?.can_use_ai ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Status:</span>
                                    <div className="flex items-center gap-2">
                                        {profile?.is_active ? (
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-400" />
                                        )}
                                        <span className={`font-medium ${profile?.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                            {profile?.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>

                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving} 
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </GlassPanel>
            </div>
        </PageWrapper>
    )
}
