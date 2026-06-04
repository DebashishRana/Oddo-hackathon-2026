'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, Clipboard } from 'lucide-react'

type CodeTab = {
  id: string
  label: string
  code: string
}

type CodeWindowProps = {
  tabs: CodeTab[]
  defaultTabId?: string
  className?: string
}

const TOKEN_RE =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:import|from|def|return|class|if|else|elif|for|while|in|as|try|except|finally|with|lambda|yield|await|async|print|True|False|None|const|let|var|function|export|default|new|async|await)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][\w]*(?=\())/g

function renderToken(token: string): ReactNode {
  if (/^["']/.test(token)) {
    return <span className="text-[#a5d6ff]">{token}</span>
  }

  if (/^(import|from|def|return|class|if|else|elif|for|while|in|as|try|except|finally|with|lambda|yield|await|async|print|True|False|None|const|let|var|function|export|default|new)$/.test(token)) {
    return <span className="text-[#ff7b72]">{token}</span>
  }

  if (/^\d+(\.\d+)?$/.test(token)) {
    return <span className="text-[#79c0ff]">{token}</span>
  }

  if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) {
    return <span className="text-[#ffa657]">{token}</span>
  }

  return <span className="text-[#d2a8ff]">{token}</span>
}

function HighlightedCode({ code }: { code: string }) {
  const lines = useMemo(() => code.split('\n'), [code])

  return (
    <pre className="m-0 overflow-x-auto px-5 py-5 font-mono text-[13px] leading-6 text-[#d0d0e0]">
      {lines.map((line, index) => {
        if (line.trim().startsWith('#')) {
          return (
            <div key={`${index}-${line}`} className="whitespace-pre text-[#8b949e]">
              {line}
            </div>
          )
        }

        const parts: ReactNode[] = []
        let lastIndex = 0
        let match: RegExpExecArray | null
        TOKEN_RE.lastIndex = 0

        while ((match = TOKEN_RE.exec(line)) !== null) {
          const [token] = match
          const start = match.index

          if (start > lastIndex) {
            parts.push(
              <span key={`${index}-text-${lastIndex}`}>
                {line.slice(lastIndex, start)}
              </span>,
            )
          }

          parts.push(<span key={`${index}-token-${start}`}>{renderToken(token)}</span>)
          lastIndex = start + token.length
        }

        if (lastIndex < line.length) {
          parts.push(
            <span key={`${index}-tail-${lastIndex}`}>
              {line.slice(lastIndex)}
            </span>,
          )
        }

        return (
          <div key={`${index}-${line}`} className="whitespace-pre">
            {parts.length > 0 ? parts : <span>&nbsp;</span>}
          </div>
        )
      })}
    </pre>
  )
}

export function CodeWindow({
  tabs,
  defaultTabId,
  className,
}: CodeWindowProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId ?? tabs[0]?.id ?? '')
  const [copied, setCopied] = useState(false)

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  const handleCopy = async () => {
    if (!activeTab) return
    await navigator.clipboard.writeText(activeTab.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d0d] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-zinc-800/90 bg-[#121212]">
          <div className="flex min-w-0 items-center gap-0 overflow-x-auto">
            {tabs.map((tab) => {
              const active = tab.id === activeTab?.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`shrink-0 border-b-2 px-4 py-3 text-sm transition-colors ${
                    active
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white active:scale-95"
            aria-label="Copy code"
          >
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
          </button>
        </div>

        <HighlightedCode code={activeTab?.code ?? ''} />
      </div>
    </div>
  )
}
