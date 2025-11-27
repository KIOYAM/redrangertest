'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    isLoading?: boolean
}

export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isLoading = false
}: ConfirmDeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="border border-white/10 bg-black/90 backdrop-blur-xl">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <DialogHeader>
                        <div className="mb-4 flex justify-center">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                }}
                                className="rounded-full bg-red-600/20 p-4"
                            >
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </motion.div>
                        </div>

                        <DialogTitle className="text-center text-xl font-bold text-white">
                            {title}
                        </DialogTitle>

                        <DialogDescription className="text-center text-gray-400">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                        >
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
