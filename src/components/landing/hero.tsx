"use client"

import Link from "next/link"
import { buildAppUrl } from "@/lib/site-url"

const Hero = () => {
  return (
    <main className="hero-shell relative flex w-full flex-col overflow-hidden bg-[#050505] text-white antialiased selection:bg-white selection:text-black">
      <div className="absolute inset-0 h-full w-full">
        <img src="/c.webp" alt="" className="h-full w-full object-cover" loading="eager" />
      </div>

      <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none" />

      <section className="relative z-10 flex flex-grow flex-col items-center justify-center px-4 pb-20 pt-32 text-center md:px-8 md:pt-48">
        <h1 className="animate-step delay-1 max-w-4xl text-[32px] font-bold leading-[1.1] tracking-tight text-white md:text-[52px]">
          Trust and Time matter. Save <br className="hidden sm:block" /> both with Dectra .
        </h1>

        <p className="animate-step delay-2 mt-4 max-w-2xl text-[14px] font-normal leading-relaxed text-auraGray md:mt-5 md:text-[17px]">
           Streamline your workflows, reduced compliance friction and trails <br className="hidden sm:block" /> securely
        </p>

        <div className="animate-step delay-3 mt-6 md:mt-8">
          <Link href={buildAppUrl("/auth/signup")} className="inline-block rounded-full border border-white/30 bg-transparent px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 ease-in-out hover:bg-white hover:text-black">
           Get Started
          </Link>
        </div>
      </section>

    </main>
  )
}

export default Hero
