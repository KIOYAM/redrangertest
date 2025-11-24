'use client'

import { UserProfile } from '@/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toggleAIAccess } from '../../actions'
import { toast } from 'sonner'

export function UserTable({ users }: { users: UserProfile[] }) {
    const handleToggle = async (userId: string, currentAccess: boolean) => {
        try {
            const result = await toggleAIAccess(userId, currentAccess)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('User permissions updated')
            }
        } catch (error) {
            toast.error('Failed to update permissions')
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>AI Access</TableHead>
                        <TableHead>Created At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={user.can_use_ai}
                                    onCheckedChange={() => handleToggle(user.id, user.can_use_ai)}
                                    disabled={user.role === 'admin'}
                                />
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
