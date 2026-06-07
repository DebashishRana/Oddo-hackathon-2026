"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { buildAppUrl } from "@/lib/site-url"

// Helper to mask email
function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!local || !domain) return email
  const masked = local.charAt(0) + "•••••"
  return `${masked}@${domain}`
}

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const { toast } = useToast()

  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Send verification code on mount if email is present
  useEffect(() => {
    if (email) {
      sendCode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function sendCode() {
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to send code", variant: "destructive" })
    }
  }

  function handleInput(index: number, value: string) {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (value && index === 5 && newCode.every((d) => d !== "")) {
      handleVerify(newCode.join(""))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      const newCode = pasted.split("")
      setCode(newCode)
      inputRefs.current[5]?.focus()
      handleVerify(pasted)
    }
  }

  async function handleVerify(fullCode?: string) {
    const codeStr = fullCode || code.join("")
    if (codeStr.length !== 6) {
      toast({ title: "Error", description: "Please enter the full 6-digit code", variant: "destructive" })
      return
    }

    setIsVerifying(true)
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: codeStr }),
      })

      const data = await res.json()

      if (data.verified) {
        toast({ title: "Success", description: "Email verified! You can now sign in." })
        // Redirect to sign-in page after verification
        setTimeout(() => router.push(buildAppUrl("/auth/signin")), 1500)
      } else {
        toast({ title: "Error", description: data.error || "Invalid code", variant: "destructive" })
        setCode(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch {
      toast({ title: "Error", description: "Verification failed", variant: "destructive" })
    } finally {
      setIsVerifying(false)
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    setIsResending(true)
    await sendCode()
    setIsResending(false)
    setResendCooldown(60)
    toast({ title: "Code sent", description: `A new code has been sent to ${email}` })
  }

  if (!email) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        {/* Header */}
        <header className="border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-white">
              Dectra
            </Link>
            <nav className="flex items-center gap-6">
              <Link href={buildAppUrl("/auth/signin")} className="text-sm text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href={buildAppUrl("/auth/signup")} className="text-sm text-zinc-400 hover:text-white transition-colors">
                Create Your Veri-Q Account
              </Link>
              <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
                FAQ
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">Missing email</h1>
            <p className="text-zinc-400">No email address provided for verification.</p>
            <Link 
              href={buildAppUrl("/auth/signup")}
              className="inline-block text-[#d4854e] hover:text-[#e5965f] font-medium transition-colors"
            >
              Go to Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-black">
            Dectra
          </Link>
          <nav className="flex items-center gap-6">
            <Link href={buildAppUrl("/auth/signin")} className="text-sm text-zinc-500 hover:text-black transition-colors">
              Sign In
            </Link>
            <Link href={buildAppUrl("/auth/signup")} className="text-sm text-zinc-500 hover:text-black transition-colors">
              Create Your Dectra Account
            </Link>
            <Link href="/docs" className="text-sm text-zinc-500 hover:text-black transition-colors">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 bg-white">
        <div className="w-full max-w-lg text-center">
          {/* Heading */}
          <h1 className="text-3xl font-semibold text-black mb-10">
            Please enter the verification code
          </h1>

          {/* Code inputs */}
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-14 h-16 text-center text-2xl font-medium rounded-xl 
                           bg-white border-2 text-black
                           focus:outline-none transition-all
                           ${i === 0 && code.every(d => d === "") 
                             ? "border-[#d4854e] ring-1 ring-[#d4854e]" 
                             : "border-zinc-300 focus:border-[#d4854e] focus:ring-1 focus:ring-[#d4854e]"
                           }`}
                disabled={isVerifying}
              />
            ))}
          </div>

          {/* Description */}
          <p className="text-zinc-500 text-base mb-6">
            An email with a verification code has been sent to<br />
            <span className="text-black font-semibold">{maskEmail(email)}</span>. Please enter the code to continue.
          </p>

          {/* Loading indicator */}
          {isVerifying && (
            <div className="flex items-center justify-center gap-2 mb-6 text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          )}

          {/* Resend link */}
          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="text-[#d4854e] hover:text-[#e5965f] text-base font-medium transition-colors 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                  ? `Did not get a verification code? (${resendCooldown}s)`
                  : "Did not get a verification code?"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="border-b border-zinc-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-xl font-semibold text-black">Dectra</span>
            <nav className="flex items-center gap-6">
              <span className="text-sm text-zinc-500">Sign In</span>
              <span className="text-sm text-zinc-500">Create Your Dectra Account</span>
              <span className="text-sm text-zinc-500">FAQ</span>
            </nav>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#d4854e]" />
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
