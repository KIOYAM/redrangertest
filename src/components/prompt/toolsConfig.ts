import {
    Mail,
    Code2,
    FileText,
    MessageCircle,
    Megaphone,
    BookOpen,
    Briefcase,
    Lightbulb,
    GraduationCap,
    Film,
    type LucideIcon
} from 'lucide-react'

export interface ToolConfig {
    id: string
    icon: LucideIcon
    title: string
    description: string
    tags: string[]
    status: 'active' | 'coming-soon'
}

export const tools: ToolConfig[] = [
    {
        id: 'email',
        icon: Mail,
        title: 'Email Prompt Builder',
        description: 'Generate professional email meta-prompts with AI-powered assistance for any situation - work, academic, or personal.',
        tags: ['AI + Normal', 'Meta-prompt'],
        status: 'active'
    },
    {
        id: 'developer',
        icon: Code2,
        title: 'Developer Prompt Assistant',
        description: 'Generate optimized prompts for AI IDEs (Copilot, Cursor) and Chat Models (GPT, Claude, Gemini) to supercharge your coding workflow.',
        tags: ['IDE + Chat', 'Dual Output'],
        status: 'active'
    },
    {
        id: 'resume',
        icon: FileText,
        title: 'Resume & Cover Letter Prompt',
        description: 'Create compelling resume and cover letter prompts tailored to any job application with customized professional language.',
        tags: ['Coming Soon', 'Career'],
        status: 'coming-soon'
    },
    {
        id: 'whatsapp',
        icon: MessageCircle,
        title: 'WhatsApp / Chat Reply Prompt',
        description: 'Generate smart, contextual WhatsApp and messaging replies for friends, family, or professional conversations.',
        tags: ['Coming Soon', 'Social'],
        status: 'coming-soon'
    },
    {
        id: 'complaint',
        icon: Megaphone,
        title: 'Complaint / Request Letter Prompt',
        description: 'Build professional complaint or request letters for customer service, HR, landlords, and formal communications.',
        tags: ['Coming Soon', 'Formal'],
        status: 'coming-soon'
    },
    {
        id: 'social-media',
        icon: BookOpen,
        title: 'Social Media Post & Caption Prompt',
        description: 'Create engaging social media posts and captions for Instagram, LinkedIn, Twitter, and other platforms with perfect tone.',
        tags: ['Coming Soon', 'Marketing'],
        status: 'coming-soon'
    },
    {
        id: 'proposal',
        icon: Briefcase,
        title: 'Client Proposal / Freelance Pitch',
        description: 'Generate winning client proposals and freelance pitches that highlight your value and win contracts.',
        tags: ['Coming Soon', 'Business'],
        status: 'coming-soon'
    },
    {
        id: 'business-pitch',
        icon: Lightbulb,
        title: 'Business Pitch & Startup Idea',
        description: 'Create compelling business pitches and startup idea presentations that attract investors and partners.',
        tags: ['Coming Soon', 'Startup'],
        status: 'coming-soon'
    },
    {
        id: 'assignment',
        icon: GraduationCap,
        title: 'Assignment / Explanation Maker',
        description: 'Build prompts for academic assignments, explanations, essays, and study materials with proper structure.',
        tags: ['Coming Soon', 'Student'],
        status: 'coming-soon'
    },
    {
        id: 'story',
        icon: Film,
        title: 'Story / Script / Dialog Prompt',
        description: 'Generate creative story prompts, scripts, dialogues, and narratives for any genre or writing project.',
        tags: ['Coming Soon', 'Creative'],
        status: 'coming-soon'
    }
]
