// Developer Prompt Assistant Engine
// Generates optimized prompts for AI IDEs and Chat-based AI models

export type DevMode =
    | 'code_generation'
    | 'code_explanation'
    | 'debug_fix'
    | 'refactor_optimize'
    | 'api_db_design'
    | 'project_structure'
    | 'documentation'

export type OutputFormat =
    | 'code_only'
    | 'code_explanation'
    | 'step_by_step'
    | 'beginner_friendly'
    | 'full_scaffold'

export type ExecutionContext = 'ide' | 'chat' | 'both'

export interface DeveloperPromptInput {
    description: string
    mode?: DevMode
    stack?: string[]
    outputFormat?: OutputFormat
    executionContext?: ExecutionContext
    fileNaming?: boolean
    language?: 'en' | 'ta' | 'mix'
}

// Labels for UI
export const DEV_MODE_LABELS: Record<DevMode, string> = {
    code_generation: 'Code Generation',
    code_explanation: 'Code Explanation',
    debug_fix: 'Debug & Fix',
    refactor_optimize: 'Refactor / Optimize',
    api_db_design: 'API / DB Design',
    project_structure: 'Project / File Structure',
    documentation: 'Documentation Writing'
}

export const OUTPUT_FORMAT_LABELS: Record<OutputFormat, string> = {
    code_only: 'Code Only',
    code_explanation: 'Code + Explanation',
    step_by_step: 'Step by Step',
    beginner_friendly: 'Teach Me as Beginner',
    full_scaffold: 'Full Project Scaffold'
}

export const EXECUTION_CONTEXT_LABELS: Record<ExecutionContext, string> = {
    ide: 'IDE (Copilot/Cursor)',
    chat: 'Chat Model (GPT/Claude/Gemini)',
    both: 'Both'
}

/**
 * Builds an optimized prompt for AI IDEs (Copilot, Cursor, Codeium, TabNine)
 * Format: Short, structured, inline-comment style
 */
export function buildIdePrompt(input: DeveloperPromptInput): string {
    const mode = input.mode ?? 'code_generation'
    const outputFormat = input.outputFormat ?? 'code_only'
    const fileNaming = input.fileNaming ?? false
    const language = input.language ?? 'en'

    const lines: string[] = []

    // Task description
    lines.push(`// TASK: ${input.description}`)
    lines.push('')

    // Mode-specific instructions
    const modeInstructions: Record<DevMode, string[]> = {
        code_generation: [
            '// MODE: Code Generation',
            '// Generate clean, working code based on the requirements'
        ],
        code_explanation: [
            '// MODE: Code Explanation',
            '// Explain the code logic, architecture, and key decisions'
        ],
        debug_fix: [
            '// MODE: Debug & Fix',
            '// Identify bugs, explain root cause, provide fixed code'
        ],
        refactor_optimize: [
            '// MODE: Refactor & Optimize',
            '// Improve code quality, performance, and maintainability'
        ],
        api_db_design: [
            '// MODE: API / Database Design',
            '// Design robust API endpoints or database schema'
        ],
        project_structure: [
            '// MODE: Project Structure',
            '// Define file/folder organization and architecture'
        ],
        documentation: [
            '// MODE: Documentation',
            '// Write clear technical documentation or comments'
        ]
    }

    modeInstructions[mode].forEach(line => lines.push(line))
    lines.push('')

    // Tech stack if provided
    if (input.stack && input.stack.length > 0) {
        lines.push(`// TECH STACK: ${input.stack.join(', ')}`)
        lines.push('')
    }

    // Requirements section
    lines.push('// REQUIREMENTS:')

    const formatRequirements: Record<OutputFormat, string> = {
        code_only: '// - Return clean working code only, no explanation',
        code_explanation: '// - Return code with inline comments explaining logic',
        step_by_step: '// - Break down solution into clear steps',
        beginner_friendly: '// - Explain concepts simply for beginners',
        full_scaffold: '// - Provide complete project structure with all files'
    }
    lines.push(formatRequirements[outputFormat])

    if (fileNaming) {
        lines.push('// - Include proper file names and paths')
    }

    if (language !== 'en') {
        const langInstruction = language === 'ta'
            ? '// - Write comments in Tamil'
            : '// - Write comments in Tanglish (Tamil + English mix)'
        lines.push(langInstruction)
    }

    lines.push('// - Follow best practices and industry standards')
    lines.push('// - Production-ready code with no placeholders')
    lines.push('')

    // Output instruction
    lines.push('// OUTPUT: Provide ready-to-use solution immediately')

    return lines.join('\n')
}

/**
 * Builds a rich Chat-based AI Engineering Prompt
 * Format: Structured with ROLE, TASK, CONTEXT, REQUIREMENTS, OUTPUT sections
 */
export function buildChatPrompt(input: DeveloperPromptInput): string {
    const mode = input.mode ?? 'code_generation'
    const outputFormat = input.outputFormat ?? 'code_only'
    const fileNaming = input.fileNaming ?? false
    const language = input.language ?? 'en'

    const sections: string[] = []

    // 1. ROLE
    sections.push('**ROLE:**')
    const roleDescriptions: Record<DevMode, string> = {
        code_generation: 'You are a senior full-stack engineer and code architect specializing in clean, production-ready code.',
        code_explanation: 'You are an expert technical educator who explains complex code in simple, clear language.',
        debug_fix: 'You are a senior debugging specialist with deep expertise in identifying and fixing code issues.',
        refactor_optimize: 'You are a code quality expert specializing in refactoring and performance optimization.',
        api_db_design: 'You are a backend architect and database expert specializing in scalable API and data design.',
        project_structure: 'You are a software architect specializing in clean project organization and scalable structures.',
        documentation: 'You are a technical writer who creates clear, comprehensive documentation.'
    }
    sections.push(roleDescriptions[mode])
    sections.push('')

    // 2. GOAL/TASK
    sections.push('**GOAL:**')
    sections.push(input.description)
    sections.push('')

    // 3. TECH STACK
    if (input.stack && input.stack.length > 0) {
        sections.push('**TECH STACK:**')
        input.stack.forEach(tech => sections.push(`- ${tech}`))
        sections.push('')
    }

    // 4. CONTEXT & REQUIREMENTS
    sections.push('**REQUIREMENTS:**')

    const formatInstructions: Record<OutputFormat, string[]> = {
        code_only: [
            '- Provide clean, working code',
            '- No lengthy explanations, just the solution',
            '- Include necessary imports and setup'
        ],
        code_explanation: [
            '- Provide the code solution',
            '- Include detailed inline comments explaining logic',
            '- Add a brief overview of the approach'
        ],
        step_by_step: [
            '- Break down the solution into clear, numbered steps',
            '- Explain what each part does and why',
            '- Show the complete final code at the end'
        ],
        beginner_friendly: [
            '- Explain concepts in simple terms',
            '- Define technical jargon when used',
            '- Include examples and analogies where helpful',
            '- Assume minimal prior knowledge'
        ],
        full_scaffold: [
            '- Provide complete project structure',
            '- Include all necessary files with full paths',
            '- Add package.json, config files, etc.',
            '- Show folder organization clearly'
        ]
    }

    formatInstructions[outputFormat].forEach(line => sections.push(line))

    if (fileNaming) {
        sections.push('- Include proper file names and directory paths')
    }

    sections.push('- Follow industry best practices and conventions')
    sections.push('- Production-ready code with no dummy data or placeholders')
    sections.push('- Handle edge cases and errors appropriately')
    sections.push('')

    // 5. LANGUAGE
    if (language !== 'en') {
        sections.push('**LANGUAGE:**')
        if (language === 'ta') {
            sections.push('Write all explanations and comments in Tamil. Use proper Tamil grammar and technical terminology.')
        } else {
            sections.push('Write explanations in Tanglish (mix of Tamil and English) as people naturally speak. Code can remain in English.')
        }
        sections.push('')
    }

    // 6. FORMAT
    sections.push('**FORMAT:**')
    if (outputFormat === 'full_scaffold') {
        sections.push('Structure your response as:')
        sections.push('1. Project Overview')
        sections.push('2. Folder Structure (tree format)')
        sections.push('3. File Contents (each file clearly labeled)')
        sections.push('4. Setup Instructions')
    } else if (outputFormat === 'step_by_step') {
        sections.push('Structure your response as:')
        sections.push('1. Approach Overview')
        sections.push('2. Step-by-step Implementation')
        sections.push('3. Complete Final Code')
        sections.push('4. Testing/Usage Instructions')
    } else {
        sections.push('Structure your response clearly with:')
        sections.push('- File names (if applicable)')
        sections.push('- Complete code blocks')
        sections.push('- Brief setup/usage notes')
    }
    sections.push('')

    // 7. OUTPUT
    sections.push('**OUTPUT:**')
    sections.push('Provide a complete, working solution that can be immediately implemented.')
    sections.push('Do not use placeholders like "// your code here" or "TODO".')
    sections.push('Ensure all imports, dependencies, and configurations are included.')
    sections.push('The solution should work without modifications.')

    return sections.join('\n')
}
