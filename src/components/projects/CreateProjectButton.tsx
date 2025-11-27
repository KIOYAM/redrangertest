'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateProjectModal } from './CreateProjectModal'

export function CreateProjectButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
            </Button>
            <CreateProjectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
