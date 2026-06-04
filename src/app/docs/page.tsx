'use client'

import Link from 'next/link'
import { useEffect, useState, type ComponentType } from 'react'
import {
  ArrowRight,
  Bot,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  FileText,
  Layers3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { CodeWindow } from '@/components/docs/code-window'
import { DocsShell, type TocItem } from '@/components/docs/docs-shell'

const heroTabs = [
  {
    id: 'python',
    label: 'Python',
    code: `from dectra_sdk import Client

client = Client(api_key="your_api_key")
result = client.verify.create(model="dectra-v3")
result.append(document("passport.jpg"))
result.append(face("selfie.jpg"))

response = result.process()
print(response.status)`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    code: `import { Client } from "dectra-sdk";

const client = new Client({ apiKey: "your_api_key" });
const result = client.verify.create({ model: "dectra-v3" });
result.append(document("passport.jpg"));
result.append(face("selfie.jpg"));

const response = await result.process();
console.log(response.status);`,
  },
  {
    id: 'python-openai',
    label: 'Python (OpenAI)',
    code: `from openai import OpenAI

client = OpenAI(api_key="your_api_key")
result = client.responses.create(
    model="dectra-v3",
    input="Verify this identity document",
)

print(result.output_text)`,
  },
  {
    id: 'javascript-openai',
    label: 'JavaScript (OpenAI)',
    code: `import OpenAI from "openai";

const client = new OpenAI({ apiKey: "your_api_key" });
const result = await client.responses.create({
  model: "dectra-v3",
  input: "Verify this identity document",
});

console.log(result.output_text);`,
  },
  {
    id: 'bash',
    label: 'Bash',
    code: `export DECTRA_API_KEY="your_api_key"`,
  },
] as const

const jumpTabs = [
  {
    id: 'text',
    label: 'Text',
    code: `from dectra_sdk import Client

client = Client(api_key="your_api_key")
result = client.verify.create(model="dectra-v3")
result.append(document("passport.jpg"))
result.append(text("Extract and validate the fields"))
print(result.process())`,
  },
  {
    id: 'voice',
    label: 'Voice',
    code: `from dectra_sdk import Client

client = Client(api_key="your_api_key")
result = client.verify.create(model="dectra-v3")
result.append(voice("customer-call.mp3"))
print(result.process())`,
  },
  {
    id: 'image',
    label: 'Image',
    code: `from dectra_sdk import Client

client = Client(api_key="your_api_key")
result = client.verify.create(model="dectra-v3")
result.append(image("front-of-id.png"))
print(result.process())`,
  },
  {
    id: 'video',
    label: 'Video',
    code: `from dectra_sdk import Client

client = Client(api_key="your_api_key")
result = client.verify.create(model="dectra-v3")
result.append(video("capture.mp4"))
print(result.process())`,
  },
] as const

const modelCards = [
  {
    title: 'Document Verification',
    icon: FileText,
    description:
      'High-precision OCR, document authenticity checks, and structured extraction for identity workflows.',
    rows: [
      ['Context', '1 million tokens'],
      ['Input', '$1.25 / 1M tokens'],
      ['Output', '$2.50 / 1M tokens'],
      ['Reasoning', 'Configurable ↗'],
    ],
    primary: 'View model',
    secondary: 'Try in playground',
    disabledSecondary: false,
  },
  {
    title: 'Face Verification',
    icon: Bot,
    description:
      'Fast face matching and liveness-aware verification for onboarding and step-up authentication.',
    rows: [
      ['Context', '512k tokens'],
      ['Input', '$1.25 / 1M tokens'],
      ['Output', '$2.50 / 1M tokens'],
      ['Reasoning', 'Low-latency ↗'],
    ],
    primary: 'Read docs',
    secondary: 'Playground coming soon',
    disabledSecondary: true,
  },
  {
    title: 'Compliance Intelligence',
    icon: ShieldCheck,
    description:
      'Risk scoring, audit trails, and compliance-ready reporting for regulated verification flows.',
    rows: [
      ['Context', '1 million tokens'],
      ['Input', '$1.25 / 1M tokens'],
      ['Output', '$2.50 / 1M tokens'],
      ['Reasoning', 'Multimodal ↗'],
    ],
    primary: 'Read docs',
    secondary: 'Try in playground',
    disabledSecondary: true,
  },
] as const

const homeToc: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'jump-straight-in', label: 'Jump straight in' },
  { id: 'models', label: 'Models' },
  { id: 'resources', label: 'Resources' },
]

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? '')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.15, 0.3, 0.6] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-zinc-500">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-[32px] font-semibold leading-[1.2] text-white">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-2xl text-base leading-6 text-zinc-400">{subtitle}</p> : null}
    </div>
  )
}

function SpecCard({
  title,
  icon: Icon,
  description,
  rows,
  primary,
  secondary,
  disabledSecondary,
}: {
  title: string
  icon: ComponentType<{ size?: number; className?: string }>
  description: string
  rows: ReadonlyArray<readonly [string, string]>
  primary: string
  secondary: string
  disabledSecondary?: boolean
}) {
  return (
    <article className="rounded-3xl border border-zinc-800 bg-[#161616] p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-[20px] font-semibold text-white">{title}</h3>
        <Icon size={18} className="mt-1 text-zinc-400" />
      </div>

      <p className="min-h-[3rem] text-sm leading-6 text-zinc-400">{description}</p>

      <div className="mt-5 space-y-2 border-t border-zinc-800 pt-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-zinc-500">{label}</span>
            <span className="text-right text-white">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black"
        >
          {primary}
        </button>
        <button
          type="button"
          disabled={disabledSecondary}
          className={`inline-flex w-full items-center justify-center rounded-lg border px-4 py-3 text-sm font-semibold transition ${
            disabledSecondary
              ? 'cursor-not-allowed border-zinc-800 text-zinc-600'
              : 'border-zinc-700 text-white hover:bg-white/5'
          }`}
        >
          {secondary}
        </button>
      </div>
    </article>
  )
}

export default function DocsPage() {
  const activeId = useActiveSection(homeToc.map((item) => item.id))

  return (
    <DocsShell tocItems={homeToc} activeId={activeId}>
      <div className="space-y-16">
        <section id="overview" className="scroll-mt-24">
          <div className="rounded-[32px] border border-zinc-800 bg-[#050505] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div className="flex flex-col justify-between">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Available
                </div>

                <div className="mt-6">
                  <h1 className="max-w-xl text-[48px] font leading-[1.1] text-white">
                    Get started with{' '}
                    <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      Dectra
                    </span>
                  </h1>
                  <p className="mt-5 max-w-[480px] text-base leading-7 text-zinc-400">
                    Complete identity verification solution with document validation, face recognition, and compliance reporting.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100"
                  >
                    Create API key
                    <ArrowRight size={16} />
                  </button>
                  <Link
                    href="/docs/quickstart"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              <CodeWindow tabs={heroTabs as unknown as Array<{ id: string; label: string; code: string }>} defaultTabId="python" />
            </div>
          </div>
        </section>

        <section id="jump-straight-in" className="scroll-mt-24">
          <SectionHeading
            title="Jump straight in"
            subtitle="Try document, face, image, and compliance verification below"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-zinc-900 p-1">
                {jumpTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      index === 0 ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <CodeWindow tabs={jumpTabs as unknown as Array<{ id: string; label: string; code: string }>} defaultTabId="text" />
            </div>

            <aside className="rounded-3xl border border-zinc-800 bg-[#161616] p-6">
              <h3 className="text-[20px] font-semibold text-white">Verification API</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Verify identities, validate documents, and build compliance-ready applications.
              </p>

              <div className="mt-6 space-y-3">
                {['Document OCR', 'Multi-turn chat', 'Function calling'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 size={16} className="text-green-400" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-zinc-800 pt-5">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <DollarSign size={16} className="text-zinc-500" />
                    Input tokens
                  </div>
                  <span className="text-white">$1.25 / 1M</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <DollarSign size={16} className="text-zinc-500" />
                    Output tokens
                  </div>
                  <span className="text-white">$2.50 / 1M</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Read docs
              </button>
            </aside>
          </div>
        </section>

        <section id="models" className="scroll-mt-24">
          <SectionHeading
            eyebrow="BUILDING BLOCKS"
            title="Models"
            subtitle="Specification cards for the document, face, and multimodal flows that power the product."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {modelCards.map((card) => (
              <SpecCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section id="resources" className="scroll-mt-24 pb-10">
          <SectionHeading
            eyebrow="RESOURCES"
            title="What to do next"
            subtitle="The docs homepage stays focused, but these paths cover the rest of the workflow."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <article
              id="compliance"
              className="rounded-3xl border border-zinc-800 bg-[#161616] p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <Layers3 size={18} className="text-zinc-400" />
                <h3 className="text-lg font-semibold text-white">Compliance</h3>
              </div>
              <p className="text-sm leading-6 text-zinc-400">
                Review policy checks, audit trails, and reporting workflows for regulated deployments.
              </p>
            </article>

            <article
              id="security"
              className="rounded-3xl border border-zinc-800 bg-[#161616] p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck size={18} className="text-zinc-400" />
                <h3 className="text-lg font-semibold text-white">Security</h3>
              </div>
              <p className="text-sm leading-6 text-zinc-400">
                Understand key management, access control, and secure processing expectations.
              </p>
            </article>

            <article id="support" className="rounded-3xl border border-zinc-800 bg-[#161616] p-6">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen size={18} className="text-zinc-400" />
                <h3 className="text-lg font-semibold text-white">Support</h3>
              </div>
              <p className="text-sm leading-6 text-zinc-400">
                Find the handoff points for implementation help, troubleshooting, and account questions.
              </p>
            </article>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Quickstart
              <ChevronRight size={16} />
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              API Reference
            </button>
          </div>
        </section>
      </div>
    </DocsShell>
  )
}
