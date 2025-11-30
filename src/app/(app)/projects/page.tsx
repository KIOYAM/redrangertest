'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/ui/PageWrapper'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { FloatingCreateButton } from '@/components/ui/FloatingCreateButton'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Sparkles, AlertCircle } from 'lucide-react'

export default function ProjectsPage() {
    const router = useRouter()
    const [projects, setProjects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [creating, setCreating] = useState(false)
    const [newProject, setNewProject] = useState({ title: '', description: '' })

    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        try {
            const response = await fetch('/api/projects/list')
            if (response.ok) {
                const data = await response.json()
                setProjects(data.projects)
            }
        } catch (error) {
            console.error('Error loading projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCreateProject() {
        if (!newProject.title.trim()) {
            toast.error('Please enter a project title')
            return
        }

        setCreating(true)
        try {
            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            })

            if (response.ok) {
                const data = await response.json()
                toast.success('Project created!')
                setShowCreateModal(false)
                setNewProject({ title: '', description: '' })
                router.push(`/projects/${data.project.id}/workspace`)
            }
        } catch (error) {
            toast.error('Failed to create project')
        } finally {
            setCreating(false)
        }
    }

    return (
        <PageWrapper variant="gradient" gradientVariant="cyan">
            <div className="min-h-screen pt-32 pb-20 px-4">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <PageHeader
                        title="Your AI Projects"
                        description="Each project has its own isolated AI memory. Create, manage, and organize your AI workflows."
                        icon={Sparkles}
                        iconColor="cyan"
                    />

                    {/* Create Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12 flex justify-center"
                    >
                        <FloatingCreateButton
                            onClick={() => setShowCreateModal(true)}
                            label="Create New Project"
                        />
                    </motion.div>

                    {/* Projects Grid */}
                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <GlassPanel className="h-48 flex items-center justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600/20 border-t-purple-600" />
                                    </GlassPanel>
                                </motion.div>
                            ))}
                        </div>
                    ) : projects.length > 0 ? (
                        <motion.div
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20, scale: 0.9 },
                                        visible: { opacity: 1, y: 0, scale: 1 }
                                    }}
                                >
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassPanel className="p-12 text-center" hover={false}>
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-full bg-purple-600/20 p-6">
                                        <AlertCircle className="h-12 w-12 text-purple-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No Projects Yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Create your first AI project to get started
                                </p>
                            </GlassPanel>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Create Project Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="border border-white/10 bg-black/90 backdrop-blur-xl">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                Create New Project
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-6">
                            <div>
                                <Label className="text-gray-300">Project Title *</Label>
                                <Input
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    placeholder="My AI Project"
                                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-300">Description (optional)</Label>
                                <Textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Describe your project..."
                                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                    rows={4}
                                />
                            </div>

                            <Button
                                onClick={handleCreateProject}
                                disabled={creating}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                            >
                                {creating ? 'Creating...' : 'Create Project'}
                            </Button>
                        </div>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </PageWrapper>
    )
}
