"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
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
        setTimeout(() => router.push("/auth/signin"), 1500)
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
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Missing email</h1>
          <p className="text-muted-foreground">No email address provided for verification.</p>
          <Link href="/auth/signup">
            <Button>Go to Sign Up</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Back link */}
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-[#d4854e]/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-[#d4854e]" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-muted-foreground text-sm">
            We sent a 6-digit verification code to
          </p>
          <p className="font-medium">{email}</p>
        </div>

        {/* Code inputs */}
        <div className="flex justify-center gap-3" onPaste={handlePaste}>
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
              className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-border bg-card
                         focus:outline-none focus:ring-2 focus:ring-[#d4854e] focus:border-[#d4854e]
                         transition-all"
              disabled={isVerifying}
            />
          ))}
        </div>

        {/* Verify button */}
        <Button
          onClick={() => handleVerify()}
          disabled={isVerifying || code.some((d) => d === "")}
          className="w-full bg-[#d4854e] hover:bg-[#c5773f] text-white"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify email"
          )}
        </Button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="text-[#d4854e] hover:underline font-medium disabled:opacity-50 disabled:no-underline"
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
