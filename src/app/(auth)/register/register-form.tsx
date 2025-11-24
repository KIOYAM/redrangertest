'use client'

import { useActionState } from 'react'
import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const initialState = {
    error: '',
}

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(signup, initialState)

    return (
        <Card>
            <form action={formAction}>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="m@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Creating account...' : 'Sign Up'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
