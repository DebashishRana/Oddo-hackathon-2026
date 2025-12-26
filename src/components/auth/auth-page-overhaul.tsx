"use client"

import { useState } from "react"
import { signInAction, signInWithCredentialsAction, signUpAction } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, X } from "lucide-react"
import Link from "next/link"

export function AuthPageOverhaul({ defaultIsSignUp = false }: { defaultIsSignUp?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  // Login Form State - commented out unused variables
  // const loginEmail = "";
  // const loginPassword = "";

  // Signup Form State (if we want to support email signup on the left side too, or just social)
  // The design shows "Sign up with email" button on the left. 
  // We'll assume clicking that might toggle the right side to signup mode or show a modal.
  // For now, let's implement the right side as a toggleable form based on user interaction.
  
  // Actually, the design shows "Sign up" on left and "Log in" on right.
  // But usually you can't do both at once.
  // Let's interpret the design:
  // Left side: "Sign up" header. Buttons for Google, Facebook, Email.
  // Right side: "Log in" header. Form for Email/Password.
  
  // If user clicks "Sign up with email" on the left, maybe the right side changes to Signup form?
  // Or maybe the left side IS the signup options and right side IS the login options.
  
  const [mode, setMode] = useState<"login" | "signup">(defaultIsSignUp ? "signup" : "login")

  async function handleGoogleSignIn() {
    setIsLoading(true)
    try {
      await signInAction()
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong with Google sign in",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEmailSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const action = mode === "signup" ? signUpAction : signInWithCredentialsAction
      const result = await action(null, formData)
      
      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      // NEXT_REDIRECT means successful redirect - let it propagate
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
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
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4" 
         style={{ backgroundImage: 'url("/signup.jpg")' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        <Link
          href="/"
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Link>
        
        {/* Left Side - Sign Up Options */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center border-r border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-2 w-2 rounded-full bg-gray-300" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h2>
            <p className="text-gray-500">Unlimited free access to our resources</p>
          </div>

          <div className="space-y-4 max-w-xs mx-auto w-full">
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-full border-gray-300 hover:bg-gray-50 hover:text-gray-900 justify-start px-6 relative"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Icons.google className="h-5 w-5 mr-3 absolute left-6" />
              <span className="w-full text-center">Continue with Google</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full h-12 rounded-full border-gray-300 hover:bg-gray-50 hover:text-gray-900 justify-start px-6 relative"
              disabled={isLoading}
              // Placeholder for Facebook
            >
              <Icons.facebook className="h-5 w-5 mr-3 absolute left-6 text-blue-600" />
              <span className="w-full text-center">Continue with Facebook</span>
            </Button>

            <Button 
              variant="outline" 
              className={`w-full h-12 rounded-full border-gray-300 hover:bg-gray-50 hover:text-gray-900 justify-start px-6 relative ${mode === 'signup' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              onClick={() => setMode("signup")}
              disabled={isLoading}
            >
              <Icons.mail className="h-5 w-5 mr-3 absolute left-6" />
              <span className="w-full text-center">Sign up with email</span>
            </Button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400 px-8">
            By signing up, you agree to the <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link> and acknowledge you&apos;ve read our <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gray-50/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === "login" ? "Log in" : "Create Account"}
            </h2>
            <p className="text-gray-500">
              {mode === "login" ? "Welcome back! Please enter your details." : "Enter your details to get started."}
            </p>
          </div>

          <form action={handleEmailSubmit} className="space-y-6 max-w-xs mx-auto w-full">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-600">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="h-12 rounded-xl bg-white border-gray-200 focus:border-primary focus:ring-primary text-gray-900"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-600">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="h-12 rounded-xl bg-white border-gray-200 focus:border-primary focus:ring-primary text-gray-900"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-600">Password</Label>
                <button 
                  type="button"
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 rounded-xl bg-white border-gray-200 focus:border-primary focus:ring-primary text-gray-900"
                disabled={isLoading}
                required
              />
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <Link href="/auth/reset-password" className="text-xs font-medium text-gray-500 hover:text-gray-900">
                  Forget your password
                </Link>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {mode === "login" ? "Log in" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-900"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Don&apos;t have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white/70 backdrop-blur px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
            <span>English (United States)</span>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/about" className="hover:text-gray-600">About</Link>
              <Link href="/help" className="hover:text-gray-600">Help Center</Link>
              <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
              <Link href="/cookies" className="hover:text-gray-600">Cookie Policy</Link>
              <Link href="/careers" className="hover:text-gray-600">Careers</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
