import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const path = req.nextUrl.pathname

    // Public routes
    if (path === '/' ||
        path.startsWith('/login') ||
        path.startsWith('/register') ||
        path.startsWith('/verify-email') ||
        path.startsWith('/forgot-password') ||
        path.startsWith('/auth') ||
        path.startsWith('/landing')) {
        return NextResponse.next()
    }

    // Not logged in → redirect to login
    if (!user && !path.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Logged in - check onboarding status
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed, is_active, role')
            .eq('id', user.id)
            .single()

        // User blocked
        if (profile && !profile.is_active && !path.startsWith('/blocked')) {
            return NextResponse.redirect(new URL('/blocked', req.url))
        }

        // Onboarding not completed
        if (profile && !profile.onboarding_completed && !path.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/onboarding', req.url))
        }

        // Onboarding completed but trying to access onboarding page
        if (profile?.onboarding_completed && path.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/projects', req.url))
        }

        // Admin route protection
        if (path.startsWith('/admin') && profile?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
