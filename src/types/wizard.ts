// Universal Tool Enhancement Framework - Type Definitions

export interface WizardStep {
    id: string
    title: string
    description?: string
    question: string
    inputType: 'single-choice' | 'multi-choice' | 'text' | 'textarea' | 'slider' | 'conditional'
    options?: WizardOption[]
    validation?: (value: any) => string | null
    getNextStep?: (currentAnswer: any, allAnswers: Record<string, any>) => string | null
    defaultValue?: any
}

export interface WizardOption {
    value: string
    label: string
    description?: string
    icon?: string
}

export interface WizardResponse {
    id: string
    project_id: string
    tool_name: string
    step_id: string
    question: string
    answer: any
    created_at: string
}

export interface TaskOutcome {
    id?: string
    project_id: string
    tool_name: string
    task_description: string
    status: 'success' | 'partial' | 'failed' | 'error'
    ai_tool_used?: string
    feedback?: Record<string, any>
    error_details?: string
    success_metrics?: Record<string, any>
    created_at?: string
}

export interface AIRecommendation {
    name: string
    provider: string
    confidence: number
    strengths: string[]
    bestFor: string[]
    pricing: string
    promptStrategy?: string
    officialLink?: string
}

export interface AIRecommendationData {
    id?: string
    project_id: string
    tool_name: string
    task_type: string
    recommended_tool: string
    confidence: number
    reasoning?: string
    user_choice?: string
    was_accepted?: boolean
    created_at?: string
}

export interface AIRecommendations {
    primary: AIRecommendation
    alternatives: AIRecommendation[]
    budgetOption?: AIRecommendation
}

export interface SuccessPattern {
    id: string
    tool_name: string
    pattern_type: string
    context: Record<string, any>
    success_rate: number
    usage_count: number
    last_validated: string
    created_at: string
}

export interface ProjectPhase {
    name: string
    status: 'completed' | 'in_progress' | 'pending'
    tasks: PhaseTask[]
    completionRate: number
    estimatedDuration?: string
}

export interface PhaseTask {
    id: string
    description: string
    status: 'completed' | 'in_progress' | 'pending'
    estimatedTime?: string
}

export interface ProjectBlueprint {
    projectName: string
    projectType: string
    industry?: string
    techStack?: string[]
    features?: string[]
    phases: ProjectPhase[]
    estimatedCompletion?: string
    generatedPrompt?: string
}

export interface ProjectContext {
    projectId: string
    projectName: string
    toolName: string
    industry?: string
    wizardResponses: WizardResponse[]
    decisions: Record<string, any>
    preferences: Record<string, any>
    successPatterns: SuccessPattern[]
    taskOutcomes: TaskOutcome[]
}
