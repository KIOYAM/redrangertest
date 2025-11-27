export default function BlockedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="max-w-md rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center">
                <h1 className="text-2xl font-bold text-red-900">Account Suspended</h1>
                <p className="mt-4 text-red-800">
                    Your account has been temporarily suspended. Please contact support for assistance.
                </p>
            </div>
        </div>
    )
}
