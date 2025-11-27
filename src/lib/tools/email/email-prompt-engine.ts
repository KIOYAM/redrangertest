import type { EmailContext, ReceiverType, Tone, Length, Language } from './email-types'

// Rich mapping rules for different email attributes

const LENGTH_RULES: Record<Length, string> = {
    very_short: '1–2 lines only, under 50 words total',
    short: '2–3 short paragraphs, under 100 words total',
    medium: '3–5 paragraphs, up to approximately 180 words',
    long: 'detailed explanation with 5–7 paragraphs, up to approximately 300 words'
}

const TONE_RULES: Record<Tone, string> = {
    formal: 'Use very professional language with no slang, complete sentences, and respectful phrasing. Maintain high formality throughout.',
    semi_formal: 'Use professional but slightly warm and friendly tone. Still avoid slang, but you may be conversational while maintaining respect.',
    friendly: 'Use warm, conversational language that is still clear and polite. You may be casual but remain purposeful.',
    apologetic: 'Start with a sincere apology. Accept responsibility where appropriate and show empathy. Be humble and respectful.',
    persuasive: 'Highlight benefits clearly. Use convincing but honest language. Include a strong call-to-action. Focus on value.',
    urgent: 'Emphasize time sensitivity without being rude. Clearly mention deadlines or urgency. Be direct but polite.',
    diplomatic: 'Use neutral, balanced language. Focus on solutions rather than blame. Avoid confrontational phrasing.'
}

const RECEIVER_RULES: Record<ReceiverType, string> = {
    hr: 'The recipient is an HR professional. Show respect, clarity, and conciseness. Demonstrate professionalism and understanding of HR protocols.',
    manager: 'The recipient is your direct manager. Be respectful but direct. Focus on clarity, updates, and actionable information.',
    professor: 'The recipient is a professor or academic. Use high formality and respect. Avoid any slang. Structure your email clearly.',
    client: 'The recipient is a client. Emphasize service, clarity, professionalism, and reassurance. Build trust and confidence.',
    friend: 'The recipient is a friend. Be casual, warm, and friendly, but still clear and purposeful in your communication.',
    support: 'The recipient is a support team member. Clearly describe the problem, steps you\'ve already taken, and your expected resolution.'
}

const LANGUAGE_RULES: Record<Language, string> = {
    en: 'Write fully in natural, professional English.',
    ta: 'Write fully in polite, formal Tamil. Use proper Tamil grammar and respectful language.',
    tanglish: 'Write in mixed Tamil and English (Tanglish). Use a conversational but clear style, mixing both languages naturally as people speak in everyday conversation.'
}

/**
 * Builds a high-quality email-writing meta-prompt based on the provided context.
 * This is a fault-tolerant engine that handles missing fields gracefully with smart defaults.
 * 
 * @param context - Email context with only 'story' being required
 * @returns A structured, professional meta-prompt for email generation
 */
export function buildEmailPrompt(context: EmailContext): string {
    // Extract fields and provide smart defaults
    const {
        to,
        fromName,
        story,
        receiverType = 'manager',  // Default: professional context
        tone = 'semi_formal',       // Default: professional but friendly
        length = 'medium',          // Default: balanced length
        language = 'en',            // Default: English
        subjectHint
    } = context

    // Build the meta-prompt sections
    const sections: string[] = []

    // 1. ROLE - Always include to establish AI expertise
    sections.push('**ROLE:**')
    sections.push('You are an expert email-writing assistant with deep understanding of professional communication, tone adaptation, and cultural context.')
    sections.push('')

    // 2. TASK - Clear, actionable instruction
    sections.push('**TASK:**')
    sections.push('Write a complete, ready-to-send email based on the following context and requirements.')
    sections.push('')

    // 3. CONTEXT - Fault-tolerant with smart fallbacks
    sections.push('**CONTEXT:**')

    // Recipient handling
    if (to) {
        sections.push(`Recipient: ${to}`)
    } else {
        sections.push('Recipient: [Infer appropriate recipient title/name from the situation described below]')
    }

    // Relationship/Receiver type
    sections.push(`Relationship: ${RECEIVER_RULES[receiverType]}`)

    // Sender name (optional)
    if (fromName) {
        sections.push(`From: ${fromName}`)
    }

    sections.push('')
    sections.push('**Purpose/Situation:**')
    sections.push(story)
    sections.push('')

    // 4. TONE - Use provided or default
    sections.push('**TONE:**')
    sections.push(TONE_RULES[tone])
    sections.push('')

    // 5. LENGTH - Use provided or default
    sections.push('**LENGTH:**')
    sections.push(LENGTH_RULES[length])
    sections.push('')

    // 6. LANGUAGE - Use provided or default
    sections.push('**LANGUAGE:**')
    sections.push(LANGUAGE_RULES[language])
    sections.push('')

    // 7. SUBJECT - Handle both hint and no-hint scenarios
    sections.push('**SUBJECT LINE:**')
    if (subjectHint) {
        sections.push(`Base the subject line on this hint: "${subjectHint}"`)
        sections.push('Create a clear, concise subject that captures this hint while remaining professional.')
    } else {
        sections.push('Analyze the situation and purpose carefully, then create a clear, professional subject line that accurately reflects the email\'s main point.')
    }
    sections.push('')

    // 8. FORMATTING - Universal best practices
    sections.push('**FORMATTING REQUIREMENTS:**')
    sections.push('1. Use a greeting appropriate to the receiver relationship and tone')
    sections.push('2. Write in short, scannable paragraphs (2-3 sentences each)')
    sections.push('3. Include exactly ONE clear call-to-action or next step if appropriate')
    sections.push('4. End with an appropriate closing and signature')
    if (fromName) {
        sections.push(`5. Sign with the name: ${fromName}`)
        sections.push('6. Do NOT include any meta-commentary, explanations, or text outside the email itself')
    } else {
        sections.push('5. Use an appropriate generic sign-off (e.g., "Best regards,")')
        sections.push('6. Do NOT include any meta-commentary, explanations, or text outside the email itself')
    }
    sections.push('')

    // 9. OUTPUT - Clear format specification
    sections.push('**OUTPUT FORMAT:**')
    sections.push('Return ONLY the email in this exact format:')
    sections.push('')
    sections.push('Subject: [Your subject line]')
    sections.push('')
    sections.push('[Email body with greeting, paragraphs, and closing]')
    sections.push('')
    sections.push('---')
    sections.push('')
    sections.push('Do not include any text before or after the email. No explanations, no alternatives, just the email.')

    return sections.join('\n')
}
