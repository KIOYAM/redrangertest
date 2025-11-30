// Helper function to check and deduct credits before AI generation
export async function checkAndDeductCredits(
    toolName: string,
    userId?: string
): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
        return { success: false, error: 'User not authenticated' }
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/credits/deduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tool_name: toolName,
                reason: `Used ${toolName}`
            }),
        })

        const data = await response.json()

        if (response.status === 402) {
            // Payment Required - Out of credits
            return {
                success: false,
                error: data.error || 'Insufficient Morphin Energy'
            }
        }

        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Failed to deduct credits'
            }
        }

        return { success: true }
    } catch (error: any) {
        console.error('Credit check error:', error)
        return {
            success: false,
            error: error.message || 'Failed to check credits'
        }
    }
}

// Helper to get user credit balance
export async function getUserCreditBalance(): Promise<number | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/credits/balance`)

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return data.stats?.balance || null
    } catch (error) {
        console.error('Failed to fetch balance:', error)
        return null
    }
}
