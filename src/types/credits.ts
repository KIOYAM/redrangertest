// Morphin Energy Credit System Types

export interface UserCredits {
    id: string
    user_id: string
    balance: number
    total_earned: number
    total_spent: number
    last_recharged_at: string | null
    created_at: string
    updated_at: string
}

export interface CreditTransaction {
    id: string
    user_id: string
    type: 'grant' | 'purchase' | 'usage' | 'refund' | 'bonus'
    amount: number
    balance_after: number
    reason: string | null
    tool_name: string | null
    admin_id: string | null
    metadata: Record<string, any> | null
    created_at: string
}

export interface CreditPackage {
    id: string
    name: string
    display_name: string
    credits: number
    price: number
    bonus_credits: number
    is_popular: boolean
    is_active: boolean
    features: string[]
    icon: string
    sort_order: number
    created_at: string
}

export interface CreditUsageLog {
    id: string
    user_id: string
    tool_name: string
    credits_used: number
    success: boolean
    error_message: string | null
    metadata: Record<string, any> | null
    created_at: string
}

export interface CreditStats {
    balance: number
    total_earned: number
    total_spent: number
    percentage_remaining: number
    last_recharged_at: string | null
}

export interface DeductCreditsResult {
    success: boolean
    error?: string
    balance?: number
    required?: number
    deducted?: number
}

export interface AddCreditsResult {
    success: boolean
    balance: number
    added: number
}

// Credit costs for each tool
export const CREDIT_COSTS = {
    developer_tool: 10,
    email_tool: 5,
    content_tool: 8,
    design_tool: 15,
    chat_message: 2
} as const

export type ToolName = keyof typeof CREDIT_COSTS
