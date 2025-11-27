// Email Reply Generator Engine
// Builds meta-prompts for AI-powered email reply generation

export type UserRole =
    | 'candidate'
    | 'employee'
    | 'hr'
    | 'manager'
    | 'vendor'
    | 'client'
    | 'student'
    | 'teacher'
    | 'other'

export type Formality =
    | 'very_formal'
    | 'formal_friendly'
    | 'semi_formal'
    | 'casual'

export type ReplyIntent =
    | 'confirm'
    | 'reject'
    | 'ask_info'
    | 'reschedule'
    | 'acknowledge'
    | 'escalate'
    | 'auto'

export interface EmailReplyPromptInput {
    receivedEmail: string
    userRole?: UserRole
    formality?: Formality
    replyIntent?: ReplyIntent
    extraNotes?: string
    language?: 'en' | 'ta' | 'mix'
}

// Mapping for user-friendly labels
export const USER_ROLE_LABELS: Record<UserRole, string> = {
    candidate: 'Job Candidate',
    employee: 'Employee',
    hr: 'HR Professional',
    manager: 'Manager',
    vendor: 'Vendor/Supplier',
    client: 'Client',
    student: 'Student',
    teacher: 'Teacher/Professor',
    other: 'Other'
}

export const FORMALITY_LABELS: Record<Formality, string> = {
    very_formal: 'Very Formal',
    formal_friendly: 'Formal but Friendly',
    semi_formal: 'Semi-Formal',
    casual: 'Casual'
}

export const REPLY_INTENT_LABELS: Record<ReplyIntent, string> = {
    confirm: 'Confirm / Accept',
    reject: 'Politely Reject',
    ask_info: 'Ask for More Information',
    reschedule: 'Request Reschedule',
    acknowledge: 'Acknowledge Only',
    escalate: 'Escalate Politely',
    auto: 'Not Sure – Let AI Choose'
}

const LANGUAGE_LABELS = {
    en: 'English',
    ta: 'Tamil',
    mix: 'Tanglish (Tamil + English mix)'
}

/**
 * Builds a comprehensive meta-prompt for AI-powered email reply generation.
 * Fault-tolerant with smart defaults for all optional fields.
 */
export function buildReplyMetaPrompt(input: EmailReplyPromptInput): string {
    // Apply smart defaults
    const effectiveRole = input.userRole ?? 'employee'
    const effectiveFormality = input.formality ?? 'formal_friendly'
    const effectiveLanguage = input.language ?? 'en'
    const effectiveReplyIntent = input.replyIntent ?? 'auto'

    const sections: string[] = []

    // 1. ROLE
    sections.push('**ROLE:**')
    sections.push(`You are an expert email writer helping a ${USER_ROLE_LABELS[effectiveRole]} reply to an email they received.`)
    sections.push('')

    // 2. TASK
    sections.push('**TASK:**')
    sections.push('Write a professional, clear, and context-aware reply email that matches the user\'s intention and relationship with the sender.')
    sections.push('')

    // 3. ORIGINAL EMAIL
    sections.push('**ORIGINAL_EMAIL:**')
    sections.push('Here is the full original email content that the user received:')
    sections.push('')
    sections.push('"""')
    sections.push(input.receivedEmail.trim())
    sections.push('"""')
    sections.push('')

    // 4. REPLY INTENT
    sections.push('**REPLY_INTENT:**')
    sections.push(`The intended behavior for the reply is: **${REPLY_INTENT_LABELS[effectiveReplyIntent]}**`)
    sections.push('')

    if (effectiveReplyIntent === 'auto') {
        sections.push('Since the intent is "auto", YOU must infer the best reply type from the original email content.')
        sections.push('Possible reply types: confirm/accept, politely reject, ask for clarification, request reschedule, acknowledge only, or escalate.')
    } else {
        sections.push('Guidelines for this reply intent:')
        const intentGuidelines: Record<ReplyIntent, string> = {
            confirm: '- Express confirmation and appreciation. Be positive and professional.',
            reject: '- Politely decline while maintaining a positive relationship. Offer brief explanation if appropriate.',
            ask_info: '- Politely ask for the missing details or clarification needed. Be specific about what you need.',
            reschedule: '- Respectfully propose a new time/date. Acknowledge the original request and apologize for any inconvenience.',
            acknowledge: '- Briefly acknowledge receipt and thank them. Keep it concise.',
            escalate: '- Firmly but respectfully raise the concern. Maintain professionalism while being assertive.',
            auto: '' // handled above
        }
        sections.push(intentGuidelines[effectiveReplyIntent])
    }
    sections.push('')

    // 5. TONE AND FORMALITY
    sections.push('**TONE_AND_FORMALITY:**')
    sections.push(`Use this formality level: **${FORMALITY_LABELS[effectiveFormality]}**`)
    sections.push('')
    sections.push('Guidelines:')

    const formalityGuidelines: Record<Formality, string[]> = {
        very_formal: [
            '- Use very professional language with no slang or casual expressions',
            '- Complete sentences with proper grammar',
            '- Respectful phrasing with appropriate titles (Mr., Ms., Dr., etc.)',
            '- Maintain high formality throughout'
        ],
        formal_friendly: [
            '- Professional but warm and approachable tone',
            '- Avoid slang but can be conversational',
            '- Respectful while maintaining a friendly atmosphere',
            '- Balance professionalism with personability'
        ],
        semi_formal: [
            '- Professional yet relaxed tone',
            '- Can use some casual expressions if appropriate to context',
            '- Friendly but still purposeful and clear',
            '- Moderate level of formality'
        ],
        casual: [
            '- Warm, conversational, and friendly',
            '- Can use casual language while remaining respectful',
            '- Relaxed but still clear and purposeful',
            '- Appropriate for close working relationships or informal contexts'
        ]
    }

    formalityGuidelines[effectiveFormality].forEach(line => sections.push(line))
    sections.push('')
    sections.push('Important: The reply should be respectful, polite, and professional. Avoid sounding robotic or rude.')
    sections.push('')

    // 6. LANGUAGE
    sections.push('**LANGUAGE:**')
    sections.push(`Write the reply in: **${LANGUAGE_LABELS[effectiveLanguage]}**`)
    sections.push('')
    if (effectiveLanguage === 'en') {
        sections.push('Use natural, professional English with appropriate politeness for the context.')
    } else if (effectiveLanguage === 'ta') {
        sections.push('Use polite, formal Tamil with proper grammar and respectful language conventions.')
    } else {
        sections.push('Use a natural mix of Tamil and English (Tanglish) as people speak in everyday conversation. Be conversational but clear.')
    }
    sections.push('')

    // 7. EXTRA NOTES FROM USER
    sections.push('**EXTRA_NOTES_FROM_USER:**')
    if (input.extraNotes && input.extraNotes.trim()) {
        sections.push('The user additionally wants to mention the following points in the reply:')
        sections.push('')
        sections.push(input.extraNotes.trim())
    } else {
        sections.push('None provided.')
    }
    sections.push('')

    // 8. STRUCTURE
    sections.push('**STRUCTURE:**')
    sections.push('The reply email you write should:')
    sections.push('1. Start with an appropriate greeting (match formality level)')
    sections.push('2. Briefly acknowledge the original email')
    sections.push('3. Clearly respond according to the reply intent')
    sections.push('4. Provide any necessary explanation, clarification, or additional information')
    sections.push('5. If extra notes were provided, incorporate them naturally')
    sections.push('6. End with a polite closing and appropriate sign-off')
    sections.push('7. Keep the email concise and scannable (short paragraphs)')
    sections.push('')

    // 9. OUTPUT
    sections.push('**OUTPUT:**')
    sections.push('Return ONLY the final reply email in raw text format.')
    sections.push('')
    sections.push('Format:')
    sections.push('Subject: [Your subject line for the reply]')
    sections.push('')
    sections.push('[Full email body with greeting, content, and closing]')
    sections.push('')
    sections.push('---')
    sections.push('')
    sections.push('IMPORTANT: Do NOT include any meta-commentary, reasoning, or explanations. Just output the email.')

    return sections.join('\n')
}
