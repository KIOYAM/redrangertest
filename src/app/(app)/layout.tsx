import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppNavbar } from '@/components/layout/AppNavbar'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen flex-col">
            <AppNavbar />
            <main className="flex-1 container px-4 md:px-6 mx-auto py-6 mt-20">
                {children}
            </main>
        </div>
    )
}
