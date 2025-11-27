'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { UserCircle, ArrowRight } from 'lucide-react'
import type { UserType } from '@/types'

const USER_TYPES = [
    { value: 'student', label: '🎓 Student', desc: 'Learning and studying' },
    { value: 'employee', label: '💼 Employee', desc: 'Working professional' },
    { value: 'business', label: '🏢 Business Owner', desc: 'Running a business' },
    { value: 'freelancer', label: '🚀 Freelancer', desc: 'Independent contractor' },
    { value: 'teacher', label: '👨‍🏫 Teacher/Educator', desc: 'Teaching or training' },
    { value: 'hr', label: '👥 HR Professional', desc: 'Human resources' },
    { value: 'developer', label: '💻 Developer', desc: 'Software development' },
    { value: 'other', label: '✨ Other', desc: 'Something else' }
]

export default function OnboardingPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [fullName, setFullName] = useState('')
    const [userType, setUserType] = useState<UserType>('other')
    const [jobRole, setJobRole] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!fullName.trim()) {
            toast.error('Please enter your full name')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/profile/setup', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName.trim(),
                    user_type: userType,
                    job_role: jobRole.trim() || null
                })
            })

            if (!response.ok) {
                throw new Error('Failed to complete onboarding')
            }

            toast.success('Welcome! Your profile is ready')
            router.push('/projects')
            router.refresh()
        } catch (error) {
            toast.error('Failed to save profile')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-600">
                        <UserCircle className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to PromptGen! 👋</h1>
                    <p className="mt-2 text-gray-600">Let's set up your profile to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="fullName">What's your name? *</Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="mt-2"
                                required
                            />
                        </div>

                        <div>
                            <Label>I am a... *</Label>
                            <div className="mt-2 grid gap-3 sm:grid-cols-2">
                                {USER_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setUserType(type.value as UserType)}
                                        className={`rounded-lg border-2 p-4 text-left transition-all ${userType === type.value
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="font-medium text-gray-900">{type.label}</div>
                                        <div className="mt-1 text-sm text-gray-600">{type.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="jobRole">Job Role or Title (optional)</Label>
                            <Input
                                id="jobRole"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                placeholder="e.g., Frontend Developer, Marketing Manager"
                                className="mt-2"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                This helps us personalize your AI prompts
                            </p>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                            {isLoading ? 'Setting up...' : 'Continue to PromptGen'}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
