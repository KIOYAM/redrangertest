import Link from 'next/link'
import { RegisterForm } from './register-form'

export default function RegisterPage() {
    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Create an Account</h1>
                <p className="text-gray-500">Enter your email below to create your account</p>
            </div>
            <RegisterForm />
            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    )
}
