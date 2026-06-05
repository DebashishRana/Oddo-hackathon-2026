'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clipboard,
  FileText,
  Files,
  Sparkles,
} from 'lucide-react'
import { CodeWindow } from '@/components/docs/code-window'
import { DocsShell, type TocItem } from '@/components/docs/docs-shell'

const markdownText = `# Quickstart

Welcome! In this guide, we'll walk through the basics of using the Dectra API, from creating an account to making your first request.

## Step 1: Create a Dectra account

Sign up in the dashboard and confirm your workspace.

## Step 2: Generate an API key

\`\`\`bash
export DECTRA_API_KEY="your_api_key"
\`\`\`

Or add it to a \`.env\` file in your project directory:

\`\`\`bash
DECTRA_API_KEY="your_api_key"
\`\`\`

## Step 3: Install an SDK

\`\`\`bash
pip install dectra-sdk
\`\`\`

## Step 4: Make your first request

\`\`\`python
from dectra_sdk import Client

client = Client(api_key=os.getenv("DECTRA_API_KEY"))
result = client.verify.create(model="dectra-v3")
\`\`\`

## Step 5: Verify a document

Send a document to Dectra and get a verification result.`

const sdkTabs = [
  {
    id: 'python',
    label: 'Python',
    code: `pip install dectra-sdk`,
  },
  {
    id: 'python-openai',
    label: 'Python (OpenAI)',
    code: `pip install openai`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    code: `npm install dectra-sdk`,
  },
  {
    id: 'javascript-openai',
    label: 'JavaScript (OpenAI)',
    code: `npm install openai`,
  },
] as const

const firstRequestTabs = [
  {
    id: 'python',
    label: 'Python',
    code: `import os
from dectra_sdk import Client
from dectra_sdk.verification import document, face

client = Client(api_key=os.getenv("DECTRA_API_KEY"))

result = client.verify.create(model="dectra-v3")
result.append(document("passport.jpg"))
result.append(face("selfie.jpg"))

response = result.process()
print(response.status)`,
  },
  {
    id: 'python-openai',
    label: 'Python (OpenAI)',
    code: `from openai import OpenAI

client = OpenAI(api_key=os.getenv("DECTRA_API_KEY"))
response = client.responses.create(
    model="dectra-v3",
    input="Verify this identity document",
)

print(response.output_text)`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    code: `import { Client } from "dectra-sdk";

const client = new Client({ apiKey: process.env.DECTRA_API_KEY });
const result = client.verify.create({ model: "dectra-v3" });
result.append(document("passport.jpg"));
result.append(face("selfie.jpg"));

const response = await result.process();
console.log(response.status);`,
  },
  {
    id: 'javascript-openai',
    label: 'JavaScript (OpenAI)',
    code: `import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.DECTRA_API_KEY });
const response = await client.responses.create({
  model: "dectra-v3",
  input: "Verify this identity document",
});

console.log(response.output_text);`,
  },
  {
    id: 'bash',
    label: 'Bash',
    code: `export DECTRA_API_KEY="your_api_key"`,
  },
] as const

const verifyTabs = [
  {
    id: 'python',
    label: 'Python',
    code: `from dectra_sdk import Client

client = Client(api_key=os.getenv("DECTRA_API_KEY"))

result = client.verify.create(model="dectra-v3")
result.append(document("passport.jpg"))
result.append(face("selfie.jpg"))

response = result.process()
print(response.status)`,
  },
  {
    id: 'bash',
    label: 'Bash',
    code: `curl -X POST https://api.dectra.com/v1/verify \\
  -H "Authorization: Bearer $DECTRA_API_KEY" \\
  -F "document=@passport.jpg" \\
  -F "face=@selfie.jpg"`,
  },
] as const

const tocItems: TocItem[] = [
  { id: 'step-1', label: 'Step 1: Create a Dectra account' },
  { id: 'step-2', label: 'Step 2: Generate an API key' },
  { id: 'step-3', label: 'Step 3: Install an SDK' },
  { id: 'step-4', label: 'Step 4: Make your first request' },
  { id: 'step-5', label: 'Step 5: Verify a document' },
  { id: 'what-next', label: "What's next" },
  { id: 'resources', label: 'Resources', level: 2 },
  { id: 'copy-for-llm', label: 'Copy for LLM', level: 2 },
  { id: 'share-feedback', label: 'Share feedback', level: 2 },
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
      { rootMargin: '-18% 0px -58% 0px', threshold: [0.15, 0.3, 0.6] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}

export default function QuickstartPage() {
  const activeId = useActiveSection(tocItems.map((item) => item.id))
  const [showMarkdown, setShowMarkdown] = useState(false)

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdownText)
  }

  return (
    <DocsShell tocItems={tocItems} activeId={activeId}>
      <div className="space-y-10">
        <header className="max-w-3xl">
          <div className="mb-2 text-sm text-zinc-500">Quickstart</div>
          <h1 className="text-[48px] font-bold leading-[1.1] text-white">Quickstart</h1>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyMarkdown}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              <Clipboard size={16} />
              Copy for LLM
            </button>
            <button
              type="button"
              onClick={() => setShowMarkdown((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              <FileText size={16} />
              View as Markdown
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-purple-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-400"
            >
              Create API key
              <ArrowRight size={16} />
            </button>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400">
            Welcome! In this guide, we&apos;ll walk you through the basics of using the Dectra API, from creating an account to making your first request.
          </p>
        </header>

        <section id="step-1" className="scroll-mt-24">
          <h2 className="text-[32px] font-semibold leading-[1.2] text-white">Step 1: Create a Dectra account</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-400">
            Create your account, confirm the workspace, and land on the dashboard before you generate credentials.
          </p>
        </section>

        <section id="step-2" className="scroll-mt-24 space-y-5">
          <h2 className="text-[32px] font-semibold leading-[1.2] text-white">Step 2: Generate an API key</h2>
          <p className="max-w-3xl text-base leading-7 text-zinc-400">
            Use the <Link href="/docs#resources" className="border-b border-dotted border-white text-white">API Keys page</Link> to create a new key, then store it locally.
          </p>
          <CodeWindow
            tabs={[
              { id: 'bash', label: 'Bash', code: `export DECTRA_API_KEY="your_api_key"` },
            ]}
            defaultTabId="bash"
          />
          <p className="max-w-3xl text-base leading-7 text-zinc-400">
            Or add it to a .env file in your project directory:
          </p>
          <CodeWindow
            tabs={[
              { id: 'bash', label: 'Bash', code: `DECTRA_API_KEY="your_api_key"` },
            ]}
            defaultTabId="bash"
          />
        </section>

        <section id="step-3" className="scroll-mt-24 space-y-5">
          <h2 className="text-[32px] font-semibold leading-[1.2] text-white">Step 3: Install an SDK</h2>
          <p className="max-w-3xl text-base leading-7 text-zinc-400">
            Pick your language and install the SDK:
          </p>
          <CodeWindow tabs={sdkTabs as unknown as Array<{ id: string; label: string; code: string }>} defaultTabId="python" />
        </section>

        <section id="step-4" className="scroll-mt-24 space-y-5">
          <h2 className="text-[32px] font-semibold leading-[1.2] text-white">Step 4: Make your first request</h2>
          <p className="max-w-3xl text-base leading-7 text-zinc-400">
            Send a document to Dectra and get a verification result:
          </p>
          <CodeWindow tabs={firstRequestTabs as unknown as Array<{ id: string; label: string; code: string }>} defaultTabId="python" />
        </section>

        <section id="step-5" className="scroll-mt-24 space-y-5">
          <h2 className="text-[32px] font-semibold leading-[1.2] text-white">Step 5: Verify a document</h2>
          <p className="max-w-3xl text-base leading-7 text-zinc-400">
            The document flow combines OCR, document validation, and face matching into one response object.
          </p>
          <CodeWindow tabs={verifyTabs as unknown as Array<{ id: string; label: string; code: string }>} defaultTabId="python" />
        </section>

        <section id="what-next" className="scroll-mt-24 pb-12">
          <div className="rounded-3xl border border-zinc-800 bg-[#161616] p-6">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-zinc-400" />
              <h2 className="text-[32px] font-semibold leading-[1.2] text-white">What&apos;s next</h2>
            </div>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-400">
              Once the basic flow works, move on to the support, security, and compliance pages that round out a production setup.
            </p>

            <div id="resources" className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-black/20 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <BookOpen size={16} className="text-zinc-400" />
                  <span className="font-semibold text-white">Resources</span>
                </div>
                <p className="text-sm leading-6 text-zinc-400">
                  Revisit the docs homepage for models, pricing, and the broader API overview.
                </p>
              </div>
              <div id="copy-for-llm" className="rounded-2xl border border-zinc-800 bg-black/20 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Files size={16} className="text-zinc-400" />
                  <span className="font-semibold text-white">Copy for LLM</span>
                </div>
                <p className="text-sm leading-6 text-zinc-400">
                  Use the markdown export to hand the guide to another model or tool.
                </p>
              </div>
              <div id="share-feedback" className="rounded-2xl border border-zinc-800 bg-black/20 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-zinc-400" />
                  <span className="font-semibold text-white">Share feedback</span>
                </div>
                <p className="text-sm leading-6 text-zinc-400">
                  Collect implementation notes and keep the rollout tidy for the rest of the team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {showMarkdown ? (
          <section id="markdown" className="scroll-mt-24 pb-16">
            <h2 className="mb-4 text-[24px] font-semibold text-white">Markdown</h2>
            <CodeWindow
              tabs={[{ id: 'markdown', label: 'Markdown', code: markdownText }]}
              defaultTabId="markdown"
            />
          </section>
        ) : null}
      </div>
    </DocsShell>
  )
}
