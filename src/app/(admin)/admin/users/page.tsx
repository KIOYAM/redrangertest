import { createClient } from '@/lib/supabase/server'
import { UserTable } from './user-table'

export default async function UsersPage() {
    const supabase = await createClient()

    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-gray-500">Manage user access and permissions.</p>
            </div>
            <UserTable users={users || []} />
        </div>
    )
}
