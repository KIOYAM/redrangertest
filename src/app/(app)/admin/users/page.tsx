'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Search, Shield, ShieldCheck, Ban, Check, Trash2 } from 'lucide-react'
import type { UserProfile } from '@/types'
import { DeleteUserDialog } from '@/components/admin/DeleteUserDialog'

export default function AdminUsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<UserProfile[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<string>('all')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: UserProfile | null }>({
        isOpen: false,
        user: null
    })

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, searchQuery, filterType, filterStatus])

    async function loadUsers() {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/users')
            if (!response.ok) {
                if (response.status === 403) {
                    router.push('/')
                    toast.error('Access denied')
                    return
                }
                throw new Error('Failed to load users')
            }

            const data = await response.json()
            setUsers(data.users)
        } catch (error) {
            toast.error('Failed to load users')
        } finally {
            setIsLoading(false)
        }
    }

    function filterUsers() {
        let filtered = users

        if (searchQuery) {
            filtered = filtered.filter(user =>
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(user => user.user_type === filterType)
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(user => user.is_active === (filterStatus === 'active'))
        }

        setFilteredUsers(filtered)
    }

    async function updateUser(userId: string, updates: Partial<UserProfile>) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (!response.ok) {
                throw new Error('Failed to update user')
            }

            const data = await response.json()
            setUsers(prev => prev.map(u => u.id === userId ? data.profile : u))
            toast.success('User updated')
        } catch (error) {
            toast.error('Failed to update user')
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="mt-2 text-gray-600">Manage all users and their permissions</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="freelancer">Freelancer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Stats */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <p className="text-sm text-gray-600">AI Enabled</p>
                        <p className="text-2xl font-bold text-green-600">
                            {users.filter(u => u.can_use_ai).length}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <p className="text-sm text-gray-600">Admins</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {users.filter(u => u.role === 'admin').length}
                        </p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                        AI Access
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{user.full_name || 'Unnamed'}</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-800">
                                                {user.user_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => updateUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                                                className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200"
                                            >
                                                {user.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                                                {user.role}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Switch
                                                checked={user.can_use_ai}
                                                onCheckedChange={(checked) => updateUser(user.id, { can_use_ai: checked })}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => updateUser(user.id, { is_active: !user.is_active })}
                                                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${user.is_active
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                            >
                                                {user.is_active ? <Check className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                                                {user.is_active ? 'Active' : 'Blocked'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteDialog({ isOpen: true, user })}
                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="mt-8 text-center">
                        <p className="text-gray-500">No users found</p>
                    </div>
                )}

                <DeleteUserDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={() => setDeleteDialog({ isOpen: false, user: null })}
                    userId={deleteDialog.user?.id || ''}
                    userName={deleteDialog.user?.full_name || 'Unnamed User'}
                    userEmail={deleteDialog.user?.email || ''}
                    onSuccess={() => loadUsers()}
                />
            </div>
        </div>
    )
}
