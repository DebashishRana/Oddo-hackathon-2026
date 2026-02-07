"use client"

import { motion } from "motion/react"
import { ArrowRight, Target, LayoutGrid, Filter, Clock } from "lucide-react"
import Link from "next/link"

/* ──────────────────────────────────────────────────────────
   Scatter-dot SVG chart — pure CSS/SVG, blends into the
   dark background like the Linear Insights reference.
   ────────────────────────────────────────────────────────── */

function ScatterChart() {
  // Deterministic "random" dots — 3 colour clusters
  const dots: { cx: number; cy: number; fill: string; r: number }[] = []

  // blue cluster (majority)
  const blueSeed = [
    [80, 320], [120, 310], [160, 305], [200, 295], [240, 290], [280, 280],
    [320, 270], [360, 260], [400, 250], [440, 240], [480, 230], [520, 218],
    [560, 208], [600, 195], [640, 182], [680, 168], [720, 155], [760, 140],
    [800, 128], [840, 115], [880, 105], [920, 95], [960, 88], [1000, 80],
    [1040, 75], [1080, 70], [110, 325], [150, 318], [190, 308], [230, 298],
    [270, 288], [310, 278], [350, 265], [390, 255], [430, 245], [470, 235],
    [510, 222], [550, 212], [590, 200], [630, 188], [670, 175], [710, 160],
    [750, 148], [790, 135], [830, 120], [870, 110], [910, 100], [950, 90],
    [990, 82], [1030, 76], [1070, 72], [100, 340], [180, 315], [260, 295],
    [340, 275], [420, 252], [500, 232], [580, 210], [660, 190], [740, 165],
    [820, 140], [900, 112], [980, 88], [1060, 74], [140, 330], [220, 302],
    [300, 285], [380, 262], [460, 242], [540, 220], [620, 198], [700, 172],
    [780, 148], [860, 118], [940, 96], [1020, 78], [1100, 68],
  ]
  blueSeed.forEach(([cx, cy]) => {
    dots.push({ cx, cy: cy + (cx % 7) * 3 - 10, fill: "rgba(96,165,250,0.7)", r: 2.5 + (cx % 3) * 0.5 })
  })

  // green accent dots
  const greenSeed = [
    [380, 268], [420, 258], [500, 238], [560, 215], [620, 198], [700, 178],
    [760, 152], [840, 125], [920, 102],
  ]
  greenSeed.forEach(([cx, cy]) => {
    dots.push({ cx, cy: cy + 4, fill: "rgba(52,211,153,0.75)", r: 3 })
  })

  // yellow accent dots
  const yellowSeed = [
    [300, 290], [440, 248], [520, 225], [640, 192], [780, 145], [880, 112],
    [960, 94],
  ]
  yellowSeed.forEach(([cx, cy]) => {
    dots.push({ cx, cy: cy + 2, fill: "rgba(250,204,21,0.7)", r: 2.8 })
  })

  // Y-axis labels
  const yLabels = ["7d", "6d", "5d", "4d", "3d", "2d", "1d", "0"]
  // X-axis labels
  const xLabels = ["Jul 2024", "Oct 2024", "Jan 2025", "Apr 2025", "Jul 2025", "Oct 2025", "Jan 2026"]

  return (
    <div className="relative w-full overflow-hidden">
      {/* Perspectived wrapper for the 3-D tilt */}
      <div className="relative" style={{ perspective: "1200px" }}>
        <div
          className="relative w-full"
          style={{
            transform: "rotateX(12deg) rotateY(-4deg) rotateZ(1deg)",
            transformOrigin: "50% 100%",
          }}
        >
          {/* Right-side config panel */}
          <div className="absolute -right-2 top-4 z-10 space-y-2 text-[10px] text-muted-foreground sm:right-4">
            {[
              { label: "Measure", value: "Cycle Time" },
              { label: "Slice", value: "Created date" },
              { label: "Segment", value: "" },
              { label: "Team", value: "" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-black/60 px-2.5 py-1.5 backdrop-blur"
              >
                <span className="text-muted-foreground/60">{item.label}</span>
                {item.value && <span className="font-medium text-foreground/70">{item.value}</span>}
              </div>
            ))}
          </div>

          <svg
            viewBox="0 0 1160 400"
            className="w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {yLabels.map((_, i) => (
              <line
                key={`h-${i}`}
                x1="60"
                x2="1120"
                y1={50 + i * 45}
                y2={50 + i * 45}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {yLabels.map((label, i) => (
              <text
                key={`yl-${i}`}
                x="48"
                y={55 + i * 45}
                textAnchor="end"
                className="fill-white/20 text-[10px]"
              >
                {label}
              </text>
            ))}

            {/* X-axis labels */}
            {xLabels.map((label, i) => (
              <text
                key={`xl-${i}`}
                x={80 + i * 160}
                y="390"
                textAnchor="middle"
                className="fill-white/20 text-[10px]"
              >
                {label}
              </text>
            ))}

            {/* Dots */}
            {dots.map((d, i) => (
              <motion.circle
                key={i}
                cx={d.cx}
                cy={d.cy}
                r={d.r}
                fill={d.fill}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.008, 1.2) }}
                viewport={{ once: true }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Bottom stat strip — percentile bars */}
      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground/50 sm:gap-4 sm:text-[11px]">
        {[
          { pct: "<25%", time: "41 minutes" },
          { pct: "<50%", time: "3 hours" },
          { pct: "<75%", time: "22 hours" },
          { pct: "<95%", time: "7 days" },
          { pct: ">95%", time: "7 days" },
        ].map((item) => (
          <div key={item.pct} className="text-center">
            <span className="font-medium text-muted-foreground/70">{item.pct}</span>
            <span className="mx-1">·</span>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Main Insights Section
   ────────────────────────────────────────────────────────── */

const Insights = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Subtle top divider */}
        <div className="mb-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-sky-500/40 to-transparent" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-transparent" />
        </div>

        {/* Header + Chart */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Dectra Insights
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Take the guesswork out of verification planning with real-time analytics and reporting dashboards.
            </p>

            <Link
              href="#features"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/30 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card/50"
            >
              Learn more
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <ScatterChart />
          </motion.div>
        </div>

        {/* Bottom feature pills — 4 across */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {[
            {
              icon: <Target className="h-4 w-4" />,
              title: "Tailored workflows",
              desc: "Track progress across custom verification flows for your team.",
            },
            {
              icon: <LayoutGrid className="h-4 w-4" />,
              title: "Custom views",
              desc: "Switch between list and board. Group documents with swimlanes.",
            },
            {
              icon: <Filter className="h-4 w-4" />,
              title: "Filters",
              desc: "Refine document lists down to what's most relevant to you.",
            },
            {
              icon: <Clock className="h-4 w-4" />,
              title: "SLAs",
              desc: "Automatically apply deadlines to time-sensitive verifications.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              viewport={{ once: true }}
              className="cursor-default"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-muted-foreground">{item.icon}</span>
                {item.title}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Insights
