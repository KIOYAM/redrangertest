// Power Rangers Ranger Groups Types

export interface RangerGroup {
    id: string
    name: string
    display_name: string
    color_primary: string
    color_secondary: string
    color_accent: string
    gradient_class: string
    helmet_icon?: string
    description?: string
    tagline: string
    display_order: number
    is_active: boolean
    is_premium: boolean
    tool_count?: number
    created_at: string
}

export interface ToolCategory {
    id: string
    tool_name: string
    group_id: string
    display_name: string
    description?: string
    icon?: string
    route_path: string
    credit_cost: number
    display_order: number
    is_featured: boolean
    is_active: boolean
    created_at: string
}

export interface GroupWithTools extends RangerGroup {
    tools: ToolCategory[]
}

// Ranger group names (type-safe)
export type RangerGroupName =
    | 'red_ranger'    // Work
    | 'blue_ranger'   // Learn
    | 'yellow_ranger' // Create
    | 'green_ranger'  // Life
    | 'black_ranger'  // Pro
    | 'white_ranger'  // Legendary

// Tool names
export type ToolName =
    | 'developer_tool'
    | 'email_tool'
    | 'content_tool'
    | 'design_tool'

// Ranger colors for styling
export const RANGER_COLORS: Record<RangerGroupName, {
    primary: string
    secondary: string
    accent: string
    gradient: string
    textLight?: boolean
}> = {
    red_ranger: {
        primary: '#DC2626',
        secondary: '#991B1B',
        accent: '#FCA5A5',
        gradient: 'from-red-600 to-red-800'
    },
    blue_ranger: {
        primary: '#2563EB',
        secondary: '#1E40AF',
        accent: '#93C5FD',
        gradient: 'from-blue-600 to-blue-800'
    },
    yellow_ranger: {
        primary: '#F59E0B',
        secondary: '#D97706',
        accent: '#FCD34D',
        gradient: 'from-yellow-500 to-yellow-700'
    },
    green_ranger: {
        primary: '#10B981',
        secondary: '#059669',
        accent: '#6EE7B7',
        gradient: 'from-green-500 to-green-700'
    },
    black_ranger: {
        primary: '#1F2937',
        secondary: '#111827',
        accent: '#6B7280',
        gradient: 'from-gray-800 to-black'
    },
    white_ranger: {
        primary: '#F3F4F6',
        secondary: '#E5E7EB',
        accent: '#FFFFFF',
        gradient: 'from-gray-100 to-white',
        textLight: true
    }
}
