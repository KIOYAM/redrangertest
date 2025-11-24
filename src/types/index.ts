export interface UserProfile {
    id: string
    email: string | null
    role: 'admin' | 'user'
    can_use_ai: boolean
    created_at: string
    updated_at: string
}

export interface PromptRequest {
    task: string
    language: string
    tone: string
    format: string
    mode: 'normal' | 'ai'
}
