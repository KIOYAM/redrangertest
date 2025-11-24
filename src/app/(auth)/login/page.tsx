import Link from 'next/link'
import { LoginForm } from './login-form'

export default function LoginPage() {
    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-gray-500">Sign in to your account</p>
            </div>
            <LoginForm />
            <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    )
}
