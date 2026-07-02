"use client"

import { useState, useRef } from "react"
import { motion } from "motion/react"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface CustomerStory {
  id: number
  company: string
  companyLogo?: string
  quote: string
  name: string
  role: string
  thumbnail: string
  ctaLabel: string
  ctaLink: string
  /** Accent colour used for the play button and CTA */
  accent: string
}

const stories: CustomerStory[] = [
  {
    id: 1,
    company: "Nextera Finance",
    quote:
      "Veri-Q transformed our compliance workflow. Document verification that used to take days now happens in minutes with unmatched accuracy, and we couldn't have done it without their team.",
    name: "David Park",
    role: "Chief Compliance Officer",
    thumbnail: "/images/1.png",
    ctaLabel: "Read customer story",
    ctaLink: "#",
    accent: "#ffffff",
  },
  {
    id: 2,
    company: "TrustLayer",
    quote:
      "Veri-Q is the only vendor that can service all of our employees across the globe in one unified system.",
    name: "Brandon Zell",
    role: "Chief Accounting Officer",
    thumbnail: "/images/2.png",
    ctaLabel: "Read customer story",
    ctaLink: "#",
    accent: "#ffffff",
  },
  {
    id: 3,
    company: "GovAssure",
    quote:
      "When our teams need something, they usually need it fast. The more time we can save doing tedious tasks, the more time we can dedicate to supporting our citizen services.",
    name: "Sarah Harris",
    role: "Secretary of Digital Services",
    thumbnail: "/images/3.png",
    ctaLabel: "Read customer story",
    ctaLink: "#",
    accent: "#ffffff",
  },
  {
    id: 4,
    company: "EduVerify",
    quote:
      "Switching to Veri-Q reduced our document fraud rate by 94%. The AI-powered checks catch things human reviewers simply can't at scale.",
    name: "Priya Mehta",
    role: "VP of Operations",
    thumbnail: "/images/4.png",
    ctaLabel: "Read customer story",
    ctaLink: "#",
    accent: "#ffffff",
  },
]

function StoryCard({ story }: { story: CustomerStory }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group flex-shrink-0 w-[340px] sm:w-[380px] md:w-[420px] cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: story.id * 0.08 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-900">
        <Image
          src={story.thumbnail}
          alt={`${story.company} customer story`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark overlay on hover */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            isHovered ? "opacity-60" : "opacity-20"
          }`}
        />

        {/* Company badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm">
            {story.company}
          </span>
        </div>

        {/* Play button */}
        <div className="absolute bottom-4 left-4 z-10">
          <motion.div
            className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
            style={{ backgroundColor: story.accent }}
            whileHover={{ scale: 1.15 }}
            animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0.3)", "0 0 0 12px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Play className="h-5 w-5 text-neutral-900 fill-neutral-900 ml-0.5" />
          </motion.div>
        </div>

        {/* Subtitle overlay */}
        <div
          className={`absolute bottom-4 right-4 left-20 z-10 text-right transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm font-medium text-white drop-shadow-lg leading-snug">
            &ldquo;...{story.quote.slice(0, 40)}&rdquo;
          </p>
        </div>
      </div>

      {/* Quote & CTA */}
      <div className="mt-5 space-y-4 px-1">
        <blockquote className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          &ldquo;{story.quote}&rdquo;
        </blockquote>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground/70 truncate">
              {story.name}, {story.role}
            </p>
          </div>

          <a
            href={story.ctaLink}
            className="flex-shrink-0 inline-flex items-center gap-1 rounded-full border border-foreground/80 bg-foreground text-background px-4 py-2 text-xs font-medium transition-all duration-200 hover:bg-foreground/90 hover:shadow-md hover:scale-105"
          >
            {story.ctaLabel}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function CustomerStories() {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return
    const amount = 440
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section id="customer-stories" className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground mb-4">
              Customer Stories
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Don&apos;t just take our word for it.
            </h2>
          </div>

          {/* Scroll arrows (desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <motion.button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/30 text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
              aria-label="Scroll left"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/30 text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
              aria-label="Scroll right"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Scrollable card row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stories.map((story) => (
            <div key={story.id} className="snap-start">
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
