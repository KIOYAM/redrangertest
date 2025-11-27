'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { User, Save } from 'lucide-react'
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
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="mx-auto max-w-3xl px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="mt-2 text-gray-600">Manage your account settings</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                            <User className="h-10 w-10 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{profile?.email}</p>
                            <p className="text-xs text-gray-400">ID: {profile?.id?.slice(0, 8)}...</p>
                        </div>
                    </div>

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
                            <p className="mt-2 text-sm text-gray-500">
                                This helps us customize your experience
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <h3 className="font-medium text-gray-900">Account Status</h3>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Role:</span>
                                    <span className="font-medium capitalize">{profile?.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">AI Access:</span>
                                    <span className={`font-medium ${profile?.can_use_ai ? 'text-green-600' : 'text-gray-400'}`}>
                                        {profile?.can_use_ai ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${profile?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                        {profile?.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSave} disabled={isSaving} className="w-full">
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
