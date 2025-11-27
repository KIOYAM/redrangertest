export type UserType = 'student' | 'employee' | 'business' | 'freelancer' | 'other'
export type UserRole = 'user' | 'admin'

export interface UserProfile {
    id: string
    email: string
    full_name: string | null
    user_type: UserType
    avatar_url: string | null
    role: UserRole
    can_use_ai: boolean
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface UpdateProfileInput {
    full_name?: string
    user_type?: UserType
    avatar_url?: string
}

export interface AdminUpdateProfileInput extends UpdateProfileInput {
    role?: UserRole
    can_use_ai?: boolean
    is_active?: boolean
}
