import type { WizardStep } from '@/types/wizard'

// Developer Tool - Interactive Wizard Configuration
export const developerWizardSteps: WizardStep[] = [
    // Step 1: Project Type
    {
        id: 'project_type',
        title: 'Project Type',
        description: 'Tell us what you\'re building so we can provide better guidance',
        question: 'What type of project are you building?',
        inputType: 'single-choice',
        options: [
            {
                value: 'web_app',
                label: 'Web Application',
                description: 'Single-page or multi-page web app'
            },
            {
                value: 'mobile_app',
                label: 'Mobile App (iOS/Android)',
                description: 'React Native, Flutter, or native apps'
            },
            {
                value: 'desktop_app',
                label: 'Desktop Application',
                description: 'Electron, Tauri, or native desktop apps'
            },
            {
                value: 'api_service',
                label: 'API/Backend Service',
                description: 'RESTful API, GraphQL, or microservices'
            },
            {
                value: 'chrome_extension',
                label: 'Chrome Extension',
                description: 'Browser extension or plugin'
            },
            {
                value: 'cli_tool',
                label: 'CLI Tool',
                description: 'Command-line application or utility'
            },
            {
                value: 'fullstack_saas',
                label: 'Full-Stack SaaS',
                description: 'Complete software-as-a-service application'
            },
            {
                value: 'ecommerce',
                label: 'E-commerce Platform',
                description: 'Online store or marketplace'
            },
            {
                value: 'other',
                label: 'Other',
                description: 'Something else (will ask for details)'
            }
        ],
        validation: (value) => {
            if (!value) return 'Please select a project type'
            return null
        }
    },

    // Step 2: Industry & Domain
    {
        id: 'industry',
        title: 'Industry & Domain',
        description: 'This helps us understand your target audience and requirements',
        question: 'Which industry or domain does this project serve?',
        inputType: 'single-choice',
        options: [
            { value: 'ecommerce', label: 'E-commerce / Retail' },
            { value: 'healthcare', label: 'Healthcare / Medical' },
            { value: 'education', label: 'Education / E-learning' },
            { value: 'finance', label: 'Finance / Banking' },
            { value: 'social', label: 'Social Media / Community' },
            { value: 'food', label: 'Food Delivery / Restaurant' },
            { value: 'realestate', label: 'Real Estate / Property' },
            { value: 'travel', label: 'Travel / Booking' },
            { value: 'entertainment', label: 'Entertainment / Media' },
            { value: 'productivity', label: 'Productivity / SaaS' },
            { value: 'agriculture', label: 'Agriculture / Farming' },
            { value: 'general', label: 'General Purpose' }
        ]
    },

    // Step 3: Core Features
    {
        id: 'features',
        title: 'Core Features',
        description: 'Select all the features your project needs (select multiple)',
        question: 'What features do you need?',
        inputType: 'multi-choice',
        options: [
            { value: 'auth', label: 'User Authentication', description: 'Login, signup, password reset' },
            { value: 'payments', label: 'Payment Integration', description: 'Stripe, PayPal, etc.' },
            { value: 'realtime', label: 'Real-time Chat/Updates', description: 'WebSockets, live updates' },
            { value: 'file_upload', label: 'File Upload/Storage', description: 'Images, documents, media' },
            { value: 'search', label: 'Search Functionality', description: 'Full-text search, filters' },
            { value: 'admin', label: 'Admin Dashboard', description: 'Admin panel, analytics' },
            { value: 'email', label: 'Email Notifications', description: 'Transactional emails, newsletters' },
            { value: 'analytics', label: 'Analytics/Reports', description: 'Charts, data visualization' },
            { value: 'i18n', label: 'Multi-language Support', description: 'Internationalization' },
            { value: 'api_integration', label: 'Third-party API Integration', description: 'External services' },
            { value: 'push', label: 'Push Notifications', description: 'Mobile/web push notifications' },
            { value: 'dark_mode', label: 'Dark Mode', description: 'Theme switching' }
        ],
        validation: (value) => {
            if (!value || value.length === 0) return 'Please select at least one feature'
            return null
        }
    },

    // Step 4: Scale & Complexity
    {
        id: 'scale',
        title: 'Scale & Complexity',
        description: 'Understanding the scale helps us recommend the right architecture',
        question: 'What is the expected user scale?',
        inputType: 'single-choice',
        options: [
            { value: 'small', label: 'Small (< 1K users)', description: 'MVP, prototype, or small audience' },
            { value: 'medium', label: 'Medium (1K - 100K users)', description: 'Growing startup or mid-size' },
            { value: 'large', label: 'Large (100K - 1M users)', description: 'Established product' },
            { value: 'enterprise', label: 'Enterprise (1M+ users)', description: 'Large-scale production' }
        ]
    },

    // Step 5: Deployment Target
    {
        id: 'deployment',
        title: 'Deployment & Infrastructure',
        description: 'Where will your application be hosted?',
        question: 'What\'s your deployment preference?',
        inputType: 'single-choice',
        options: [
            { value: 'cloud', label: 'Cloud (AWS/Azure/GCP)', description: 'Full cloud infrastructure' },
            { value: 'serverless', label: 'Serverless (Vercel/Netlify)', description: 'Zero configuration deployment' },
            { value: 'traditional', label: 'Traditional Server', description: 'VPS, dedicated server' },
            { value: 'docker', label: 'Containerized (Docker)', description: 'Docker containers, Kubernetes' },
            { value: 'undecided', label: 'Not decided yet', description: 'Need recommendations' }
        ]
    },

    // Step 6: Timeline & Budget
    {
        id: 'timeline',
        title: 'Timeline & Constraints',
        description: 'Help us understand your constraints',
        question: 'What\'s your development timeline?',
        inputType: 'single-choice',
        options: [
            { value: 'quick', label: '1-2 weeks (Quick MVP)', description: 'Rapid prototype' },
            { value: 'standard', label: '1-3 months (Standard)', description: 'Production-ready app' },
            { value: 'complex', label: '3-6 months (Complex)', description: 'Feature-rich application' },
            { value: 'enterprise', label: '6+ months (Enterprise)', description: 'Large-scale project' }
        ]
    }
]

// Helper function to generate project blueprint from answers
export function generateDeveloperBlueprint(answers: Record<string, any>) {
    const projectType = answers.project_type
    const industry = answers.industry
    const features = answers.features || []
    const scale = answers.scale
    const deployment = answers.deployment
    const timeline = answers.timeline

    // Generate phases based on features
    const phases = []

    // Phase 1: Foundation (always included)
    phases.push({
        name: 'Foundation',
        tasks: ['Project setup', 'Dependencies', 'Environment configuration'],
        estimatedDuration: timeline === 'quick' ? '1 day' : '2-3 days'
    })

    // Phase 2: Core Features
    const coreFeatureTasks = []
    if (features.includes('auth')) coreFeatureTasks.push('User authentication')
    if (features.includes('auth')) coreFeatureTasks.push('Database setup')
    coreFeatureTasks.push('Core business logic')

    phases.push({
        name: 'Core Features',
        tasks: coreFeatureTasks,
        estimatedDuration: timeline === 'quick' ? '3-5 days' : '1-2 weeks'
    })

    // Phase 3: Integration
    const integrationTasks = []
    if (features.includes('payments')) integrationTasks.push('Payment integration')
    if (features.includes('email')) integrationTasks.push('Email service')
    if (features.includes('api_integration')) integrationTasks.push('Third-party APIs')
    if (integrationTasks.length > 0) {
        phases.push({
            name: 'Integration',
            tasks: integrationTasks,
            estimatedDuration: '3-7 days'
        })
    }

    // Phase 4: Polish
    if (features.includes('dark_mode') || features.includes('i18n')) {
        phases.push({
            name: 'Polish',
            tasks: ['UI/UX refinement', 'Responsive design', 'Accessibility'],
            estimatedDuration: '2-5 days'
        })
    }

    return {
        projectType,
        industry,
        features,
        scale,
        deployment,
        timeline,
        phases
    }
}
