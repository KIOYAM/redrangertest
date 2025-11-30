/**
 * INTEGRATION EXAMPLES - Anime Assistant Character System
 * 
 * This file shows how to integrate Nova (the anime assistant) into your app pages.
 * Copy the relevant sections into your actual pages when ready.
 */

/* ═══════════════════════════════════════════════════════════════════
   1. PROJECTS PAGE - Empty State Integration
   ═══════════════════════════════════════════════════════════════════ */

// File: src/app/(app)/projects/page.tsx
// Replace the current empty state with EmptyStateCharacter

/*
import { EmptyStateCharacter } from '@/components/anime/EmptyStateCharacter'

// Inside your Projects component, replace the empty state:

// BEFORE:
{projects.length === 0 && (
    <GlassPanel className="p-12 text-center">
        <AlertCircle className="h-12 w-12 text-purple-400" />
        <h3>No Projects Yet</h3>
        <p>Create your first AI project to get started</p>
    </GlassPanel>
)}

// AFTER:
{projects.length === 0 && (
    <EmptyStateCharacter
        title="No projects yet"
        description="Let's start your first AI journey! Projects help you organize your AI workflows with isolated memory."
        actionLabel="Create Your First Project"
        onAction={() => setShowCreateModal(true)}
        mood="happy"
    />
)}
*/

/* ═══════════════════════════════════════════════════════════════════
   2. WORKSPACE PAGE - Chat Header Integration
   ═══════════════════════════════════════════════════════════════════ */

// File: src/app/(app)/projects/[id]/workspace/page.tsx
// Add ChatCharacterHeader at the top of the chat area

/*
import { ChatCharacterHeader } from '@/components/anime/ChatCharacterHeader'

// Inside your WorkspacePage component:
export default function WorkspacePage() {
    const [selectedTool, setSelectedTool] = useState('email')
    
    return (
        <div>
            {/* Add this header at the top of your chat area *\/}
            <ChatCharacterHeader 
                activeTool={selectedTool === 'email' ? 'email' : 'developer'}
            />
            
            {/* Rest of your workspace UI *\/}
            <ChatMemoryPanel memory={memory} />
            {/* ... *\/}
        </div>
    )
}
*/

// Optional: Add small avatar next to AI messages
/*
{message.role === 'assistant' && (
    <div className="flex gap-3">
        <AnimeAssistantAvatar mood="happy" size="sm" />
        <div className="flex-1">
            <p>{message.content}</p>
        </div>
    </div>
)}
*/

/* ═══════════════════════════════════════════════════════════════════
   3. GLOBAL LAYOUT - Assistant Dock Integration
   ═══════════════════════════════════════════════════════════════════ */

// File: src/app/(app)/layout.tsx
// Add AssistantDock to appear globally across all app pages

/*
import { AssistantDock } from '@/components/anime/AssistantDock'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AppNavbar />
            
            <main className="mt-20">
                {children}
            </main>
            
            {/* Add Nova assistant dock globally *\/}
            <AssistantDock />
        </div>
    )
}
*/

/* ═══════════════════════════════════════════════════════════════════
   4. PROJECT OVERVIEW - Empty Timeline Integration
   ═══════════════════════════════════════════════════════════════════ */

// File: src/app/(app)/projects/[id]/overview/page.tsx
// Use EmptyStateCharacter when there's no memory history

/*
{filteredTimeline.length === 0 && (
    <EmptyStateCharacter
        title={selectedTool === 'all' 
            ? 'No activity yet' 
            : `No ${selectedTool} activity yet`}
        description={selectedTool === 'all'
            ? 'Start using tools with this project to build memory!'
            : `Try using the ${selectedTool} tool to create some history.`}
        actionLabel="Explore Tools"
        onAction={() => router.push(`/projects/${projectId}/workspace`)}
        mood="idle"
    />
)}
*/

/* ═══════════════════════════════════════════════════════════════════
   5. STANDALONE USAGE EXAMPLES
   ═══════════════════════════════════════════════════════════════════ */

// AnimeAssistantAvatar - Different moods
/*
<AnimeAssistantAvatar mood="idle" size="sm" />      // Small resting state
<AnimeAssistantAvatar mood="thinking" size="md" />  // Processing/loading
<AnimeAssistantAvatar mood="happy" size="lg" />     // Success state
<AnimeAssistantAvatar mood="error" size="md" />     // Error state
*/

// EmptyStateCharacter - Custom messages
/*
<EmptyStateCharacter
    title="No search results"
    description="Try adjusting your search terms or filters"
    mood="thinking"
    // No action button needed
/>
*/

// ChatCharacterHeader - Different tools
/*
<ChatCharacterHeader activeTool="email" />
<ChatCharacterHeader activeTool="developer" />
<ChatCharacterHeader 
    activeTool="general" 
    customSubtitle="Ready to help with anything!"
/>
*/

export { }
