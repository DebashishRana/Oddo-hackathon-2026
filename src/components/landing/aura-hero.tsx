"use client"

import { useEffect, useState } from "react"

export default function AuraHero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <main className="hero-shell relative flex min-h-screen w-full flex-col overflow-hidden bg-[#050505] text-white antialiased selection:bg-white selection:text-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"
      >
        <source src="https://cdn.sceneai.art/Hero%20Section%20Video/55cd759f-9358-4141-a9df-713afcf1245a.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none" />

      <nav className="relative z-50 flex w-full items-center justify-between px-6 py-8 animate-step delay-0 md:px-12">
        <div className="cursor-pointer text-[20px] font-bold tracking-tight text-white">aura</div>

        <div className="hidden items-center space-x-8 md:flex lg:space-x-12">
          {['Features', 'App', 'Card', 'Security', 'Pricing'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[15px] font-medium text-[#a3a3a3] transition-colors duration-300 hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a href="#" className="text-[15px] font-medium text-white transition-colors duration-300 hover:text-[#a3a3a3]">
            Get Access
          </a>
        </div>

        <button
          type="button"
          className={`z-50 flex h-8 w-8 flex-col items-center justify-center space-y-1.5 focus:outline-none md:hidden ${isMenuOpen ? "menu-open" : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className={`h-0.5 w-6 rounded bg-white transition-all duration-300 ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 rounded bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`h-0.5 w-6 rounded bg-white transition-all duration-300 ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "open" : ""}`}
      >
        <div className="flex w-full flex-col items-center space-y-8 px-6">
          {['Features', 'App', 'Card', 'Security', 'Pricing'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[24px] font-medium text-[#a3a3a3] transition-colors duration-300 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="my-2 h-px w-12 bg-white/20" />
          <a href="#" className="text-[24px] font-medium text-white" onClick={() => setIsMenuOpen(false)}>
            Get Access
          </a>
        </div>
      </div>

      <div className="relative z-10 flex flex-grow flex-col items-center justify-center px-4 pb-20 pt-32 text-center md:px-8 md:pt-48">
        <h1 className="animate-step delay-1 max-w-4xl text-[32px] font-bold leading-[1.1] tracking-tight text-white md:text-[52px]">
          Move toward the light. Your <br className="hidden sm:block" /> next chapter is waiting.
        </h1>

        <p className="animate-step delay-2 mt-4 max-w-2xl text-[14px] font-normal leading-relaxed text-[#a3a3a3] md:mt-5 md:text-[17px]">
          Aura is the AI-powered crypto wallet that guides you from <br className="hidden sm:block" /> your first dollar to your first thousand.
        </p>

        <div className="animate-step delay-3 mt-6 md:mt-8">
          <a
            href="#"
            className="inline-block rounded-full border border-white/30 bg-transparent px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 ease-in-out hover:bg-white hover:text-black"
          >
            Get Early Access
          </a>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

        :root {
          font-family: 'Inter', sans-serif;
        }

        body {
          margin: 0;
          padding: 0;
          background: #050505;
          color: #ffffff;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        .hero-shell {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          background-color: #050505;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-step {
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
        }

        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 1s; }
        .delay-2 { animation-delay: 2s; }
        .delay-3 { animation-delay: 3s; }

        #mobile-menu {
          transform: translateX(100%);
        }

        #mobile-menu.open {
          transform: translateX(0);
        }

        .menu-open .w-6 {
          transform-origin: center;
        }
      `}</style>
    </main>
  )
}
