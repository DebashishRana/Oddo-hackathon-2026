import Link from "next/link"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const error = searchParams?.error

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Sign in failed</h1>
      <p className="text-sm text-muted-foreground">
        {error ? `Error: ${error}` : "Something went wrong during authentication."}
      </p>
      <div className="flex gap-3">
        <Link
          href="/auth/signin"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Back to sign in
        </Link>
        <Link href="/" className="rounded-md border px-4 py-2 text-sm">
          Home
        </Link>
      </div>
    </div>
  )
}
