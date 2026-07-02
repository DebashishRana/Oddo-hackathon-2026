"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { signInAction, signInWithCredentialsAction, signUpAction } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"

function SubmitButton({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" className="w-full" disabled={pending || isLoading}>
      {pending || isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {children}
    </Button>
  )
}

export function AuthForm({ defaultIsSignUp = false }: { defaultIsSignUp?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const action = isSignUp ? signUpAction : signInWithCredentialsAction
      const result = await action(null, formData)
      if (result?.redirectTo) {
        if (result?.error) {
          toast({
            title: "Verification required",
            description: result.error,
          })
        }
        // Redirect to email verification page
        router.push(result.redirectTo)
        return
      }
      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      // NextAuth redirects throw errors, so we ignore those
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error
      }
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form action={handleSubmit}>
        <div className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              disabled={isLoading}
              required
            />
          </div>
          <SubmitButton isLoading={isLoading}>
            {isSignUp ? "Sign Up with Email" : "Sign In with Email"}
          </SubmitButton>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <form action={signInAction}>
        <Button variant="outline" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </form>

      <div className="text-center text-sm">
        <button
          type="button"
          className="underline hover:text-primary"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  )
}
