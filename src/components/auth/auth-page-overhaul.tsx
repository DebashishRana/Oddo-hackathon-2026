"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUpAction, signInWithCredentialsAction } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", 
  // Add more as needed just keeping it brief
]

export function AuthPageOverhaul({ defaultIsSignUp = false }: { defaultIsSignUp?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailPreferences, setEmailPreferences] = useState(false)
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSignUp(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await signUpAction(null, formData)
      if (result?.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      } else if (result?.redirectTo) {
        router.push(result.redirectTo)
        return
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignIn(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await signInWithCredentialsAction(null, formData)
      if (result?.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
        if (result?.redirectTo) {
          router.push(result.redirectTo)
          return
        }
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-[#24292f]">
      
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col pt-12 pb-24 px-8 md:px-16 lg:px-24">
        {/* Removed Logo Link as per request */}
        
        {/* Added some top margin to compensate for the removed logo */}
        <div className="w-full max-w-[400px] mt-16">
          <h1 className="text-[1.75rem] font-medium tracking-tight mb-8 text-[#24292f]">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h1>

          <form action={isSignUp ? handleSignUp : handleSignIn} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-[#24292f]">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded border-[#d0d7de] bg-white text-[#24292f] text-sm shadow-sm placeholder:text-[#6e7781] focus:border-[#4a4fff] focus:ring-[#4a4fff] focus:ring-1"
                disabled={isLoading}
                required
              />
            </div>

            {/* Username - only for signup */}
            {isSignUp && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-[#24292f]">
                  Username
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Username"
                  className="h-11 rounded border-[#d0d7de] bg-white text-[#24292f] text-sm shadow-sm focus:border-[#4a4fff] focus:ring-[#4a4fff] focus:ring-1"
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-[#24292f]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-11 rounded border-[#d0d7de] bg-white text-[#24292f] text-sm shadow-sm placeholder:text-[#6e7781] focus:border-[#4a4fff] focus:ring-[#4a4fff] focus:ring-1 pr-10"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57606a] hover:text-[#24292f]"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Country - only for signup */}
            {isSignUp && (
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-sm font-medium text-[#24292f]">
                  Country/Region of residence
                </Label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    className="w-full h-11 rounded border border-[#d0d7de] bg-white text-[#24292f] text-sm shadow-sm focus:border-[#4a4fff] focus:ring-[#4a4fff] focus:ring-1 px-3 appearance-none"
                    disabled={isLoading}
                    required
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email preferences for signup */}
            {isSignUp && (
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="emailPreferences"
                  name="emailPreferences"
                  checked={emailPreferences}
                  onChange={(e) => setEmailPreferences(e.target.checked)}
                  className="mt-1 flex-shrink-0 cursor-pointer text-[#4a4fff] focus:ring-[#4a4fff] rounded border-[#d0d7de] bg-white"
                />
                <Label htmlFor="emailPreferences" className="text-sm text-[#57606a] leading-relaxed cursor-pointer font-normal">
                  Email me with occasional updates about products, features, and events.
                </Label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-[#4a4fff] hover:bg-[#3a3ee0] text-white font-medium rounded transition-colors mt-2"
              disabled={isLoading}
            >
              {isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </form>

          {/* Bottom Links */}
          <div className="mt-8 flex flex-col gap-2.5 text-sm text-[#4a4fff]">
            {!isSignUp && (
              <>
                <button type="button" className="text-left hover:underline w-fit">
                  Use Google, Okta, OneLogin, or SAML?
                </button>
                <button type="button" className="text-left hover:underline w-fit">
                  Forgot your password?
                </button>
              </>
            )}
            
            <div className="text-[#57606a] pt-1">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setIsSignUp(false)} className="text-[#4a4fff] hover:underline">
                    Sign in.
                  </button>
                </>
              ) : (
                <>
                  Need an account?{" "}
                  <button onClick={() => setIsSignUp(true)} className="text-[#4a4fff] hover:underline">
                    Sign up.
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image Background */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/hero-background.webp"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
      </div>

    </div>
  )
}
