import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles, LogOut, Settings, FolderOpen, Wand2, User } from 'lucide-react'

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

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center px-4 md:px-6 mx-auto">
                    <Link className="flex items-center gap-2 font-bold" href="/prompt-builder">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>PromptGen</span>
                    </Link>
                    <nav className="ml-auto flex items-center gap-4">
                        <Link href="/projects">
                            <Button variant="ghost" size="sm">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Projects
                            </Button>
                        </Link>
                        <Link href="/prompt-builder">
                            <Button variant="ghost" size="sm">
                                <Wand2 className="mr-2 h-4 w-4" />
                                Prompt Builder
                            </Button>
                        </Link>
                        <Link href="/profile">
                            <Button variant="ghost" size="sm">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                        </Link>
                        {isAdmin && (
                            <Link href="/admin/users">
                                <Button variant="ghost" size="sm">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Admin
                                </Button>
                            </Link>
                        )}
                        <form action="/auth/signout" method="post">
                            <Button variant="ghost" size="sm" type="submit">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </form>
                    </nav>
                </div>
            </header>
            <main className="flex-1 container px-4 md:px-6 mx-auto py-6">
                {children}
            </main>
        </div>
    )
}
