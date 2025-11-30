'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Users, TrendingUp, Gift, Search, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { LiquidEnergyVisualizer } from '@/components/admin/LiquidEnergyVisualizer'

interface UserCredit {
    id: string
    user_id: string
    balance: number
    total_earned: number
    total_spent: number
    user: { email: string }
}

export default function AdminCommandCenter() {
    const [users, setUsers] = useState<UserCredit[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserCredit[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Grant credits form
    const [selectedUserId, setSelectedUserId] = useState('')
    const [grantAmount, setGrantAmount] = useState('')
    const [grantReason, setGrantReason] = useState('')
    const [isGranting, setIsGranting] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        if (searchTerm) {
            const filtered = users.filter(u =>
                u.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredUsers(filtered)
        } else {
            setFilteredUsers(users)
        }
    }, [searchTerm, users])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/credits')
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
                setFilteredUsers(data.users || [])
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
            toast.error('Failed to load user data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGrantCredits = async () => {
        if (!selectedUserId || !grantAmount) {
            toast.error('Please select a user and enter amount')
            return
        }

        const amount = parseInt(grantAmount)
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        setIsGranting(true)
        try {
            const response = await fetch('/api/admin/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target_user_id: selectedUserId,
                    amount,
                    reason: grantReason
                })
            })

            if (response.ok) {
                toast.success(`Granted ${amount} Morphin Energy!`)
                setGrantAmount('')
                setGrantReason('')
                setSelectedUserId('')
                fetchUsers() // Refresh data
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to grant credits')
            }
        } catch (error) {
            console.error('Grant error:', error)
            toast.error('Failed to grant credits')
        } finally {
            setIsGranting(false)
        }
    }

    const totalBalance = users.reduce((sum, u) => sum + u.balance, 0)
    const totalEarned = users.reduce((sum, u) => sum + u.total_earned, 0)
    const totalSpent = users.reduce((sum, u) => sum + u.total_spent, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-600 p-4 rounded-lg">
                            <Zap className="h-8 w-8 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                                ⚡ Command Center ⚡
                            </h1>
                            <p className="text-gray-400">Morphin Energy Administration</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-blue-950 to-blue-900 border-2 border-blue-600 rounded-lg p-6"
                    >
                        <Users className="h-8 w-8 text-blue-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{users.length}</div>
                        <div className="text-sm text-blue-200">Total Rangers</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-yellow-950 to-yellow-900 border-2 border-yellow-600 rounded-lg p-6"
                    >
                        <Zap className="h-8 w-8 text-yellow-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{totalBalance.toLocaleString()}</div>
                        <div className="text-sm text-yellow-200">Active Energy</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-950 to-green-900 border-2 border-green-600 rounded-lg p-6"
                    >
                        <TrendingUp className="h-8 w-8 text-green-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{totalEarned.toLocaleString()}</div>
                        <div className="text-sm text-green-200">Total Distributed</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-600 rounded-lg p-6"
                    >
                        <Gift className="h-8 w-8 text-red-400 mb-2" />
                        <div className="text-3xl font-bold text-white">{totalSpent.toLocaleString()}</div>
                        <div className="text-sm text-red-200">Energy Used</div>
                    </motion.div>
                </div>

                {/* Grant Credits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-900 border-2 border-red-600 rounded-lg p-8 mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Gift className="h-6 w-6 text-red-500" />
                        Grant Morphin Energy
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Liquid Energy Visualizer */}
                        <div>
                            <LiquidEnergyVisualizer
                                amount={parseInt(grantAmount) || 0}
                                maxAmount={1000}
                            />
                            <p className="text-center text-gray-400 text-sm mt-4">
                                ⚡ Liquid Energy Preview ⚡
                            </p>
                        </div>

                        {/* Grant Form */}
                        <div className="space-y-6">
                            <div>
                                <Label className="text-white">Select Ranger</Label>
                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger className="mt-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-750">
                                        <SelectValue placeholder="Choose a user..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 z-50">
                                        {users.length === 0 ? (
                                            <div className="px-2 py-4 text-center text-gray-400 text-sm">
                                                No users found
                                            </div>
                                        ) : (
                                            users.map(user => (
                                                <SelectItem
                                                    key={user.user_id}
                                                    value={user.user_id}
                                                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                                                >
                                                    {user.user?.email || 'Unknown'} - {user.balance} energy
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-white">Amount</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter energy amount..."
                                    value={grantAmount}
                                    onChange={(e) => setGrantAmount(e.target.value)}
                                    className="mt-2 bg-gray-800 text-white border-gray-700"
                                />
                            </div>

                            <div>
                                <Label className="text-white">Reason (Optional)</Label>
                                <Textarea
                                    placeholder="Reason for granting credits..."
                                    value={grantReason}
                                    onChange={(e) => setGrantReason(e.target.value)}
                                    className="mt-2 bg-gray-800 text-white border-gray-700"
                                />
                            </div>

                            <Button
                                onClick={handleGrantCredits}
                                disabled={isGranting || !selectedUserId || !grantAmount}
                                className="bg-red-600 hover:bg-red-700 text-white w-full"
                            >
                                <Zap className="mr-2 h-4 w-4" />
                                {isGranting ? 'Granting...' : 'Grant Energy'}
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-900 border-2 border-gray-700 rounded-lg p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">All Rangers</h2>

                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-800 text-white border-gray-700"
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center text-gray-400 py-8">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Balance</th>
                                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Earned</th>
                                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Spent</th>
                                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Usage %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => {
                                        const usagePercent = user.total_earned > 0
                                            ? Math.round((user.total_spent / user.total_earned) * 100)
                                            : 0

                                        return (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-gray-800 hover:bg-gray-800/50"
                                            >
                                                <td className="py-3 px-4 text-white">{user.user?.email || 'N/A'}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className="text-yellow-400 font-semibold">{user.balance.toLocaleString()}</span>
                                                </td>
                                                <td className="py-3 px-4 text-right text-green-400">{user.total_earned.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-right text-red-400">{user.total_spent.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-right text-gray-300">{usagePercent}%</td>
                                            </motion.tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
