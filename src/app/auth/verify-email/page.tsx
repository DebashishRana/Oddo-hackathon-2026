"use client"

import { useCallback, useEffect, useRef, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { buildAppUrl } from "@/lib/site-url"
import { resendOtpEmail, requestOtpEmail } from "@/lib/auth-otp"
import { verifyEmailAction } from "@/lib/auth-actions"

function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!local || !domain) return email

  if (local.length <= 2) {
    return `${local[0] ?? ""}****@${domain}`
  }

  return `${local.slice(0, 2)}****@${domain}`
}

function getRequestErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unable to complete this request right now."
  }

  const maybe = error as { code?: string; message?: string }
  switch (maybe.code) {
    case "OTP_COOLDOWN":
      return "Please wait a moment before requesting another code."
    case "RATE_LIMITED":
      return "Too many requests. Please try again later."
    case "OTP_LOCKED":
      return "Too many verification attempts. Request a fresh code."
    default:
      return maybe.message || "Unable to complete this request right now."
  }
}

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const source = searchParams.get("source") || ""
  const delivery = searchParams.get("delivery") || ""
  const { toast } = useToast()

  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState(() => {
    if (!email) return ""
    if (delivery === "sent") return "A verification code is already on its way to your inbox."
    if (delivery === "failed") return "We could not send the first code automatically. We will retry now."
    if (source === "signin") return "We need to send a verification code before you can continue."
    return "Check your inbox for a 6-digit verification code."
  })
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const initialSendAttempted = useRef(false)

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = window.setTimeout(() => setResendCooldown((value) => Math.max(value - 1, 0)), 1000)
    return () => window.clearTimeout(timer)
  }, [resendCooldown])

  const requestCode = useCallback(
    async (action: "send" | "resend") => {
      if (!email) return false

      setIsSending(true)
      try {
        if (action === "send") {
          await requestOtpEmail(email)
        } else {
          await resendOtpEmail(email)
        }

        setStatusMessage(
          action === "send"
            ? "A verification code has been sent to your email."
            : "A fresh verification code has been sent to your email."
        )
        setResendCooldown(60)
        toast({
          title: action === "send" ? "Code sent" : "Code resent",
          description: `We sent a verification code to ${maskEmail(email)}`
        })
        return true
      } catch (error) {
        const message = getRequestErrorMessage(error)
        setStatusMessage(message)
        toast({ title: "Unable to send code", description: message, variant: "destructive" })
        return false
      } finally {
        setIsSending(false)
      }
    },
    [email, toast]
  )

  useEffect(() => {
    if (!email || delivery === "sent" || initialSendAttempted.current) return

    initialSendAttempted.current = true
    void requestCode("send")
  }, [delivery, email, requestCode])

  function handleInput(index: number, value: string) {
    if (value && !/^\d$/.test(value)) return

    const nextCode = [...code]
    nextCode[index] = value
    setCode(nextCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (value && index === 5 && nextCode.every((digit) => digit !== "")) {
      void handleVerify(nextCode.join(""))
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(event: React.ClipboardEvent) {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length !== 6) return

    const nextCode = pasted.split("")
    setCode(nextCode)
    inputRefs.current[5]?.focus()
    void handleVerify(pasted)
  }

  async function handleVerify(fullCode?: string) {
    const otp = fullCode || code.join("")
    if (otp.length !== 6) {
      toast({ title: "Incomplete code", description: "Enter the full 6-digit code.", variant: "destructive" })
      return
    }

    if (!email) {
      toast({ title: "Missing email", description: "Go back and request a new verification link.", variant: "destructive" })
      return
    }

    setIsVerifying(true)
    try {
      const formData = new FormData()
      formData.set("email", email)
      formData.set("otp", otp)

      const result = await verifyEmailAction(null, formData)
      if (result?.verified) {
        setStatusMessage("Email verified successfully. Redirecting to sign in.")
        toast({ title: "Email verified", description: "You can now sign in." })
        window.setTimeout(() => {
          router.push(buildAppUrl(`/auth/signin?email=${encodeURIComponent(email)}`))
        }, 1200)
        return
      }

      const message = result?.error || "Unable to verify code."
      setStatusMessage(message)
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
      toast({ title: "Verification failed", description: message, variant: "destructive" })
    } catch (error) {
      const message = getRequestErrorMessage(error)
      setStatusMessage(message)
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
      toast({ title: "Verification failed", description: message, variant: "destructive" })
    } finally {
      setIsVerifying(false)
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || isSending || !email) return

    await requestCode("resend")
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,133,78,0.16),_transparent_42%),linear-gradient(180deg,_#0b0b0b_0%,_#111111_60%,_#161616_100%)] text-white">
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-semibold tracking-tight text-white">
              Dectra
            </Link>
            <nav className="flex items-center gap-6 text-sm text-white/65">
              <Link href={buildAppUrl("/auth/signin")} className="transition-colors hover:text-white">
                Sign In
              </Link>
              <Link href={buildAppUrl("/auth/signup")} className="transition-colors hover:text-white">
                Create Account
              </Link>
              <Link href="/docs" className="transition-colors hover:text-white">
                FAQ
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-[#d4854e]">Verification</p>
            <h1 className="mt-3 text-3xl font-semibold">Missing email address</h1>
            <p className="mt-3 text-sm leading-6 text-white/70">
              We need the email that received the verification code. Go back to sign up and start the flow again.
            </p>
            <Link
              href={buildAppUrl("/auth/signup")}
              className="mt-8 inline-flex rounded-full bg-[#d4854e] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-[#e5965f]"
            >
              Return to sign up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const showAutoSendBanner = delivery !== "sent"

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,133,78,0.16),_transparent_42%),linear-gradient(180deg,_#0b0b0b_0%,_#111111_60%,_#161616_100%)] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight text-white">
            Dectra
          </Link>
          <nav className="flex items-center gap-6 text-sm text-white/65">
            <Link href={buildAppUrl("/auth/signin")} className="transition-colors hover:text-white">
              Sign In
            </Link>
            <Link href={buildAppUrl("/auth/signup")} className="transition-colors hover:text-white">
              Create Account
            </Link>
            <Link href="/docs" className="transition-colors hover:text-white">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4854e]">Step 2 of 2</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Verify your email
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Enter the 6-digit code sent to <span className="font-medium text-white">{maskEmail(email)}</span> to
              complete account creation and activate your login.
            </p>

            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                delivery === "failed"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
                  : showAutoSendBanner
                    ? "border-white/10 bg-white/5 text-white/70"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
              }`}
            >
              {statusMessage}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-white/50">
              <span className="rounded-full border border-white/10 px-3 py-1">Expires in 5 minutes</span>
              <span className="rounded-full border border-white/10 px-3 py-1">6 attempts max</span>
              <span className="rounded-full border border-white/10 px-3 py-1">1 minute resend cooldown</span>
            </div>

            <div className="mt-8 flex justify-center gap-3" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleInput(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  aria-label={`Verification digit ${index + 1}`}
                  className={`h-16 w-12 rounded-2xl border bg-white/5 text-center text-2xl font-semibold tracking-[0.3em] text-white outline-none transition focus:border-[#d4854e] focus:bg-white/10 focus:ring-2 focus:ring-[#d4854e]/30 ${
                    digit ? "border-white/20" : "border-white/10"
                  }`}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {isVerifying && (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying code
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => void handleVerify()}
                disabled={isVerifying || code.some((digit) => digit === "")}
                className="inline-flex min-w-40 items-center justify-center rounded-full bg-[#d4854e] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-[#e5965f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify email"}
              </button>

              <button
                type="button"
                onClick={() => void handleResend()}
                disabled={isSending || resendCooldown > 0}
                className="inline-flex min-w-40 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend code"}
              </button>
            </div>
          </section>

          <aside className="rounded-[32px] border border-white/10 bg-[#0f0f0f]/80 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">What happens next</p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-white/68">
              <p>1. Enter the 6-digit code from the email you received.</p>
              <p>2. We validate the code against the canonical backend OTP service.</p>
              <p>3. Your email is marked as verified in the app database.</p>
              <p>4. You are redirected to sign in with the same email prefilled.</p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              If you do not see the email, check spam or click resend after the cooldown ends.
            </div>

            <div className="mt-8 flex flex-col gap-3 text-sm">
              <Link href={buildAppUrl("/auth/signin")} className="text-white/80 transition-colors hover:text-white">
                Back to sign in
              </Link>
              <Link href={buildAppUrl("/auth/signup")} className="text-white/80 transition-colors hover:text-white">
                Start over with a different email
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0b0b] text-white">
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#d4854e]" />
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
