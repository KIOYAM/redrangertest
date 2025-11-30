import type { AIRecommendations } from '@/types/wizard'

interface DeveloperContext {
    projectType: string
    features: string[]
    scale: string
    deployment: string
    timeline: string
}

// AI Tool Recommendation Engine for Developer Tool
export function getDeveloperAIRecommendations(context: DeveloperContext): AIRecommendations {
    const { projectType, features, scale, deployment } = context

    // Rule-based recommendation system

    // Next.js/React projects → Cursor is best
    const isWebProject = ['web_app', 'fullstack_saas', 'ecommerce'].includes(projectType)
    const hasComplexFeatures = features.length >= 5
    const isLargeScale = ['large', 'enterprise'].includes(scale)

    if (isWebProject && hasComplexFeatures) {
        return {
            primary: {
                name: 'Cursor',
                provider: 'Cursor AI',
                confidence: 0.95,
                strengths: [
                    'Excellent for full-stack Next.js projects',
                    'Multi-file editing with context awareness',
                    'Best-in-class TypeScript support',
                    'Composer mode for large changes',
                    'Great for Tailwind CSS and modern stacks'
                ],
                bestFor: [
                    'Building complete pages',
                    'Complex state management',
                    'Database integration',
                    'API route creation'
                ],
                pricing: '$20/month',
                promptStrategy: 'Use Composer mode for multi-file changes, inline for single components',
                officialLink: 'https://cursor.sh'
            },
            alternatives: [
                {
                    name: 'Claude Sonnet 3.5',
                    provider: 'Anthropic',
                    confidence: 0.88,
                    strengths: [
                        'Deep architectural planning',
                        'Excellent debugging capabilities',
                        'Large context window (200K tokens)',
                        'Great for system design'
                    ],
                    bestFor: [
                        'System architecture',
                        'Complex algorithms',
                        'Code reviews',
                        'Detailed explanations'
                    ],
                    pricing: '$20/month (Claude Pro)',
                    officialLink: 'https://claude.ai'
                },
                {
                    name: 'GitHub Copilot',
                    provider: 'GitHub/OpenAI',
                    confidence: 0.82,
                    strengths: [
                        'Tight GitHub integration',
                        'Good autocomplete',
                        'Multi-language support'
                    ],
                    bestFor: [
                        'Quick snippets',
                        'Boilerplate code',
                        'Comments to code'
                    ],
                    pricing: '$10/month',
                    officialLink: 'https://github.com/features/copilot'
                }
            ],
            budgetOption: {
                name: 'DeepSeek Coder',
                provider: 'DeepSeek',
                confidence: 0.70,
                strengths: [
                    'Free to use',
                    'Good code generation',
                    'Decent context understanding'
                ],
                bestFor: [
                    'Learning',
                    'Simple CRUD',
                    'Budget projects'
                ],
                pricing: 'Free',
                officialLink: 'https://www.deepseek.com'
            }
        }
    }

    // API/Backend projects → Claude for architecture
    if (projectType === 'api_service') {
        return {
            primary: {
                name: 'Claude Sonnet 3.5',
                provider: 'Anthropic',
                confidence: 0.92,
                strengths: [
                    'Excellent for API design',
                    'Deep understanding of backend patterns',
                    'Great at database schema design',
                    'Security-aware recommendations'
                ],
                bestFor: [
                    'RESTful API design',
                    'GraphQL schemas',
                    'Database modeling',
                    'Microservices architecture'
                ],
                pricing: '$20/month',
                officialLink: 'https://claude.ai'
            },
            alternatives: [
                {
                    name: 'Cursor',
                    provider: 'Cursor AI',
                    confidence: 0.85,
                    strengths: [
                        'Good for implementation',
                        'Fast code generation',
                        'Multi-file edits'
                    ],
                    bestFor: [
                        'Implementing endpoints',
                        'Testing code',
                        'Refactoring'
                    ],
                    pricing: '$20/month',
                    officialLink: 'https://cursor.sh'
                }
            ],
            budgetOption: {
                name: 'GPT-3.5',
                provider: 'OpenAI',
                confidence: 0.65,
                strengths: [
                    'Low cost',
                    'Fast responses',
                    'Basic API knowledge'
                ],
                bestFor: [
                    'Simple endpoints',
                    'Basic CRUD'
                ],
                pricing: 'Free (via ChatGPT)',
                officialLink: 'https://chat.openai.com'
            }
        }
    }

    // Mobile apps → Cursor + Claude combo
    if (projectType === 'mobile_app') {
        return {
            primary: {
                name: 'Cursor + Claude',
                provider: 'Combined',
                confidence: 0.90,
                strengths: [
                    'Cursor for React Native implementation',
                    'Claude for architecture and state management',
                    'Best of both worlds'
                ],
                bestFor: [
                    'React Native apps',
                    'Complex mobile UI',
                    'Cross-platform development'
                ],
                pricing: '$40/month (both)',
                promptStrategy: 'Use Claude for planning, Cursor for coding'
            },
            alternatives: [
                {
                    name: 'Cursor',
                    provider: 'Cursor AI',
                    confidence: 0.85,
                    strengths: [
                        'Great for React Native',
                        'Component generation',
                        'Fast iteration'
                    ],
                    bestFor: [
                        'UI components',
                        'Navigation setup',
                        'API integration'
                    ],
                    pricing: '$20/month',
                    officialLink: 'https://cursor.sh'
                }
            ],
            budgetOption: {
                name: 'ChatGPT',
                provider: 'OpenAI',
                confidence: 0.68,
                strengths: [
                    'Free tier available',
                    'Good basic advice',
                    'React Native knowledge'
                ],
                bestFor: [
                    'Simple apps',
                    'Learning',
                    'Troubleshooting'
                ],
                pricing: 'Free / $20/month',
                officialLink: 'https://chat.openai.com'
            }
        }
    }

    // Default recommendation (general projects)
    return {
        primary: {
            name: 'Cursor',
            provider: 'Cursor AI',
            confidence: 0.85,
            strengths: [
                'Versatile across project types',
                'Great autocomplete',
                'Multi-file editing',
                'Good for most tech stacks'
            ],
            bestFor: [
                'General development',
                'Quick prototyping',
                'Full-stack projects'
            ],
            pricing: '$20/month',
            officialLink: 'https://cursor.sh'
        },
        alternatives: [
            {
                name: 'Claude Sonnet 3.5',
                provider: 'Anthropic',
                confidence: 0.80,
                strengths: [
                    'Excellent explanations',
                    'Strong reasoning',
                    'Large context'
                ],
                bestFor: [
                    'Learning',
                    'Code reviews',
                    'Architecture'
                ],
                pricing: '$20/month',
                officialLink: 'https://claude.ai'
            }
        ],
        budgetOption: {
            name: 'DeepSeek Coder',
            provider: 'DeepSeek',
            confidence: 0.65,
            strengths: [
                'Free',
                'Decent quality',
                'Good for learning'
            ],
            bestFor: [
                'Budget projects',
                'Experimentation'
            ],
            pricing: 'Free',
            officialLink: 'https://www.deepseek.com'
        }
    }
}
