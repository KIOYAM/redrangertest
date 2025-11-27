'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { User, Save, Shield, CheckCircle, XCircle } from 'lucide-react'
import type { UserProfile, UserType } from '@/types'

const USER_TYPES = [
    { value: 'student', label: 'Student' },
    { value: 'employee', label: 'Employee' },
    { value: 'business', label: 'Business Owner' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'hr', label: 'HR Professional' },
    { value: 'developer', label: 'Developer' },
    { value: 'other', label: 'Other' }
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
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Profile</h1>
                    <p className="mt-2 text-gray-600">Manage your personal information and preferences</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Card */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white">
                                {profile?.full_name ? getInitials(profile.full_name) : <User className="h-12 w-12" />}
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                {profile?.full_name || 'Unnamed User'}
                            </h3>
                            <p className="text-sm text-gray-600">{profile?.email}</p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm text-gray-600">Role</span>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium capitalize">{profile?.role}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm text-gray-600">AI Access</span>
                                    {profile?.can_use_ai ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="font-medium">Enabled</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <XCircle className="h-4 w-4" />
                                            <span className="font-medium">Disabled</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm text-gray-600">Status</span>
                                    {profile?.is_active ? (
                                        <span className="font-medium text-green-600">Active</span>
                                    ) : (
                                        <span className="font-medium text-red-600">Inactive</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
                        <h2 className="mb-6 text-xl font-semibold text-gray-900">Edit Profile</h2>

                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="userType">I am a...</Label>
                                <Select value={userType} onValueChange={(val) => setUserType(val as UserType)}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {USER_TYPES.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="jobRole">Job Role / Title</Label>
                                <Input
                                    id="jobRole"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    placeholder="e.g., Frontend Developer, Marketing Manager"
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label>Email Address</Label>
                                <Input value={profile?.email || ''} disabled className="mt-2 bg-gray-50" />
                                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                            </div>

                            <Button onClick={handleSave} disabled={isSaving} className="w-full">
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
