"use client"

import { useState } from "react"
import { signInAction, signUpAction, signInWithCredentialsAction } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, ChevronDown } from "lucide-react"
import Link from "next/link"

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Liberia", "Libya", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mexico", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
  "Togo", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
]

export function AuthPageOverhaul({ defaultIsSignUp = false }: { defaultIsSignUp?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailPreferences, setEmailPreferences] = useState(false)
  const [showIncluded, setShowIncluded] = useState(false)
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp)
  const { toast } = useToast()

  async function handleSignUp(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await signUpAction(null, formData)

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
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

  async function handleSignIn(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await signInWithCredentialsAction(null, formData)

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Side - Dark promo panel */}
      <div className="relative w-full lg:w-[45%] text-white flex flex-col justify-between overflow-hidden min-h-[300px] lg:min-h-screen">
        {/* Background image */}
        <img
          src="/signup.webp"
          alt="Signup background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center flex-1 px-8 md:px-12 lg:px-16 py-12 lg:py-0">
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-tight mb-4 tracking-tight">
            Proof first profit later
          </h1>
          <p className="text-white/70 text-base md:text-lg mb-6 max-w-md">
            Explore Dectra&apos;s core features for individuals and organizations.
          </p>
          <button
            type="button"
            className="text-white text-sm font-medium flex items-center gap-1.5 hover:underline w-fit"
            onClick={() => setShowIncluded(!showIncluded)}
          >
            See what&apos;s included
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showIncluded ? 'rotate-180' : ''}`} />
          </button>

          {showIncluded && (
            <div className="mt-4 space-y-2 text-white/70 text-sm animate-in slide-in-from-top-2 duration-200">
              <p>&#x2022; Unlimited AI-powered verification checks</p>
              <p>&#x2022; Real-time analytics dashboard</p>
              <p>&#x2022; Team collaboration tools</p>
              <p>&#x2022; API access for integrations</p>
              <p>&#x2022; Priority support</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Auth form */}
      <div className="w-full lg:w-[55%] bg-[#f6f8fa] flex flex-col min-h-screen lg:min-h-0">
        {/* Top bar: Toggle between sign in and sign up */}
        <div className="flex justify-end items-center px-6 md:px-10 py-4">
          <span className="text-sm text-[#57606a]">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-[#0969da] hover:underline font-medium"
                >
                  Sign in &rarr;
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-[#0969da] hover:underline font-medium"
                >
                  Sign up &rarr;
                </button>
              </>
            )}
          </span>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-start lg:items-center justify-center px-6 md:px-10 py-6 lg:py-0">
          <div className="w-full max-w-[440px]">
            <h2 className="text-2xl font-semibold text-[#24292f] mb-8">
              {isSignUp ? "Sign up for Dectra" : "Sign in to Dectra"}
            </h2>

            {/* Social sign-in buttons */}
            <div className="space-y-3 mb-6">
              <form action={signInAction}>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-11 rounded-md border-[#d0d7de] bg-white hover:bg-[#f3f4f6] text-[#24292f] font-medium text-sm justify-center gap-2.5 shadow-sm"
                  disabled={isLoading}
                >
                  <Icons.google className="h-[18px] w-[18px]" />
                  Continue with Google
                </Button>
              </form>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-md border-[#d0d7de] bg-white hover:bg-[#f3f4f6] text-[#24292f] font-medium text-sm justify-center gap-2.5 shadow-sm"
                disabled={isLoading}
              >
                <Icons.apple className="h-[18px] w-[18px]" />
                Continue with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#d0d7de]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#f6f8fa] px-4 text-[#57606a]">or</span>
              </div>
            </div>

            {/* Auth form */}
            <form action={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-[#24292f]">
                  Email<span className="text-[#cf222e]">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="h-9 rounded-md border-[#d0d7de] bg-white text-[#24292f] text-sm shadow-sm placeholder:text-[#6e7781] focus:border-[#0969da] focus:ring-[#0969da] focus:ring-1"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-[#24292f]">
                  Password<span className="text-[#cf222e]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-9 rounded-md border-[#d0d7de] bg-white text-[#24292f] text-sm shadow-sm placeholder:text-[#6e7781] focus:border-[#0969da] focus:ring-[#0969da] focus:ring-1 pr-10"
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
                {isSignUp && (
                  <p className="text-xs text-[#57606a] leading-snug mt-1">
                    Password should be at least 15 characters OR at least 8 characters including a number and a lowercase letter.
                  </p>
                )}
              </div>

              {/* Username - only for signup */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium text-[#24292f]">
                    Username<span className="text-[#cf222e]">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Username"
                    className="h-9 rounded-md border-[#d0d7de] bg-white text-[#24292f] text-sm shadow-sm placeholder:text-[#6e7781] focus:border-[#0969da] focus:ring-[#0969da] focus:ring-1"
                    disabled={isLoading}
                    required
                  />
                  <p className="text-xs text-[#57606a] leading-snug mt-1">
                    Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
                  </p>
                </div>
              )}

              {/* Country/Region - only for signup */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-sm font-medium text-[#24292f]">
                    Your Country/Region<span className="text-[#cf222e]">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      id="country"
                      name="country"
                      className="w-full h-9 rounded-md border border-[#d0d7de] bg-white text-[#24292f] text-sm shadow-sm px-3 pr-8 appearance-none focus:border-[#0969da] focus:ring-[#0969da] focus:ring-1 focus:outline-none cursor-pointer"
                      defaultValue="India"
                      disabled={isLoading}
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#57606a] pointer-events-none" />
                  </div>
                  <p className="text-xs text-[#0969da] leading-snug mt-1">
                    For compliance reasons, we&apos;re required to collect country information to send you occasional updates and announcements.
                  </p>
                </div>
              )}

              {/* Email preferences - only for signup */}
              {isSignUp && (
                <div className="space-y-2 pt-1">
                  <p className="text-sm font-medium text-[#24292f]">Email preferences</p>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailPreferences"
                      checked={emailPreferences}
                      onChange={(e) => setEmailPreferences(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#d0d7de] text-[#0969da] focus:ring-[#0969da] cursor-pointer"
                      disabled={isLoading}
                    />
                    <span className="text-xs text-[#57606a] leading-snug">
                      Receive occasional product updates and announcements
                    </span>
                  </label>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-10 rounded-md bg-[#2da44e] hover:bg-[#2c974b] text-white font-medium text-sm border border-[rgba(27,31,36,0.15)] shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isSignUp ? "Create account" : "Sign in"}
                </Button>
              </div>
            </form>

            {/* Terms */}
            <p className="mt-6 text-xs text-[#57606a] leading-snug text-center border-t border-[#d0d7de] pt-6">
              {isSignUp ? (
                <>
                  By creating an account, you agree to the{" "}
                  <Link href="/terms" className="text-[#0969da] hover:underline">
                    Terms of Service
                  </Link>
                  . For more information about our privacy practices, see the{" "}
                  <Link href="/privacy" className="text-[#0969da] hover:underline">
                    Privacy Statement
                  </Link>
                  . We&apos;ll occasionally send you account-related emails.
                </>
              ) : (
                <>
                  By signing in, you agree to our{" "}
                  <Link href="/terms" className="text-[#0969da] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#0969da] hover:underline">
                    Privacy Statement
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
