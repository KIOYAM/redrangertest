'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteUserDialogProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    userName: string
    userEmail: string
    onSuccess: () => void
}

export function DeleteUserDialog({
    isOpen,
    onClose,
    userId,
    userName,
    userEmail,
    onSuccess
}: DeleteUserDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmText, setConfirmText] = useState('')

    const CONFIRM_TEXT = 'DELETE PERMANENTLY'

    async function handleDelete() {
        if (confirmText !== CONFIRM_TEXT) {
            toast.error('Please type the confirmation text correctly')
            return
        }

        setIsDeleting(true)

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete user')
            }

            toast.success('User permanently deleted')
            onSuccess()
            onClose()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Permanently Delete User
                    </DialogTitle>
                    <DialogDescription className="space-y-4 pt-4">
                        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                            <p className="font-medium text-red-900">⚠️ This action cannot be undone!</p>
                            <p className="mt-2 text-sm text-red-800">
                                This will permanently delete:
                            </p>
                            <ul className="mt-2 space-y-1 text-sm text-red-800">
                                <li>• User account from authentication system</li>
                                <li>• User profile and all data</li>
                                <li>• All projects created by this user</li>
                                <li>• All project memory and conversations</li>
                            </ul>
                        </div>

                        <div className="rounded-lg bg-gray-100 p-3">
                            <p className="text-sm font-medium text-gray-900">Deleting user:</p>
                            <p className="mt-1 text-sm text-gray-700">{userName}</p>
                            <p className="text-sm text-gray-600">{userEmail}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-900">
                                Type <code className="rounded bg-gray-200 px-2 py-1 font-mono text-red-600">{CONFIRM_TEXT}</code> to confirm:
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Type confirmation text"
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={confirmText !== CONFIRM_TEXT || isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
