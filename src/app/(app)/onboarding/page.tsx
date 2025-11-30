'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { PageHeader } from '@/components/ui/PageHeader'
import { toast } from 'sonner'
import { UserCircle, ArrowRight, Sparkles } from 'lucide-react'
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
        <PageWrapper variant="gradient" gradientVariant="purple">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <PageHeader
                        title="Welcome to RedRanger! 👋"
                        description="Let's set up your profile to get started"
                        icon={UserCircle}
                        iconColor="text-purple-400"
                    />

                    <GlassPanel className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="fullName" className="text-gray-300">What's your name? *</Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="text-gray-300">I am a... *</Label>
                                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                                    {USER_TYPES.map((type, index) => (
                                        <motion.button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setUserType(type.value as UserType)}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`rounded-lg border-2 p-4 text-left transition-all ${userType === type.value
                                                    ? 'border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-500/20'
                                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium text-white">{type.label}</div>
                                            <div className="mt-1 text-sm text-gray-400">{type.desc}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="jobRole" className="text-gray-300">Job Role or Title (optional)</Label>
                                <Input
                                    id="jobRole"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    placeholder="e.g., Frontend Developer, Marketing Manager"
                                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                />
                                <p className="mt-1 text-sm text-gray-400">
                                    This helps us personalize your AI prompts
                                </p>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                size="lg"
                            >
                                {isLoading ? 'Setting up...' : 'Continue to RedRanger'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    </GlassPanel>
                </div>
            </div>
        </PageWrapper>
    )
}
