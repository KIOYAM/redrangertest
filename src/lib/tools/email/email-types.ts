// Email Tool Types and Enums

export type ReceiverType = 'hr' | 'manager' | 'professor' | 'client' | 'friend' | 'support'

export type Tone = 'formal' | 'semi_formal' | 'friendly' | 'apologetic' | 'persuasive' | 'urgent' | 'diplomatic'

export type Length = 'very_short' | 'short' | 'medium' | 'long'

export type Language = 'en' | 'ta' | 'tanglish'

export interface EmailContext {
    to?: string
    fromName?: string
    receiverType?: ReceiverType
    subjectHint?: string
    story: string  // Only required field
    tone?: Tone
    length?: Length
    language?: Language
}

// Display labels for UI
export const RECEIVER_TYPE_LABELS: Record<ReceiverType, string> = {
    hr: 'HR Department',
    manager: 'My Manager',
    professor: 'Professor',
    client: 'Client',
    friend: 'Friend',
    support: 'Support Team'
}

export const TONE_LABELS: Record<Tone, string> = {
    formal: 'Formal (Very Professional)',
    semi_formal: 'Semi-Formal (Professional but Friendly)',
    friendly: 'Friendly (Warm & Conversational)',
    apologetic: 'Apologetic',
    persuasive: 'Persuasive',
    urgent: 'Urgent but Polite',
    diplomatic: 'Diplomatic'
}

export const LENGTH_LABELS: Record<Length, string> = {
    very_short: 'Very Short (1-2 lines, <50 words)',
    short: 'Short (2-3 paragraphs, <100 words)',
    medium: 'Medium (3-5 paragraphs, ~180 words)',
    long: 'Long (Detailed, ~300 words)'
}

export const LANGUAGE_LABELS: Record<Language, string> = {
    en: 'English',
    ta: 'Tamil',
    tanglish: 'Tanglish (Tamil + English mix)'
}
