// Project and Memory Type Definitions

export interface Project {
    id: string
    user_id: string
    title: string
    description: string | null
    tool_name: string
    created_at: string
    updated_at: string
}

export interface MemoryEntry {
    id: string
    project_id: string
    role: 'user' | 'ai'
    content: string
    tool_name: string | null
    created_at: string
}

export interface ProjectWithStats extends Project {
    message_count?: number
    last_activity?: string
}

export interface CreateProjectInput {
    title: string
    description?: string
    tool_name: string
}

export interface UpdateProjectInput {
    title?: string
    description?: string
}

export interface AddMemoryInput {
    role: 'user' | 'ai'
    content: string
    tool_name?: string
}
