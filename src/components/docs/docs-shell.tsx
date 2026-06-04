'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type TocItem = {
  id: string
  label: string
  level?: 1 | 2
}

type DocsShellProps = {
  children: ReactNode
  tocItems: TocItem[]
  activeId?: string
}

const navGroups = [
  {
    title: 'GET STARTED',
    items: [
      { label: 'Welcome', href: '/docs' },
      { label: 'Quickstart', href: '/docs/quickstart' },
      { label: 'Models', href: '/docs#models' },
      { label: 'Pricing', href: '/docs#resources' },
    ],
  },
  {
    title: 'BUILD',
    items: [
      { label: 'API Reference', href: '/docs#jump-straight-in' },
      { label: 'Integrations', href: '/docs#resources' },
      { label: 'Webhooks', href: '/docs#resources' },
    ],
  },
  {
    title: 'RESOURCES',
    items: [
      { label: 'Compliance', href: '/docs#resources' },
      { label: 'Security', href: '/docs#resources' },
      { label: 'Support', href: '/docs#resources' },
    ],
  },
]

export function DocsShell({ children, tocItems, activeId }: DocsShellProps) {
  const pathname = usePathname()
  const [tocOpen, setTocOpen] = useState(false)

  const isActiveLink = useMemo(
    () => (href: string) => {
      if (href === '/docs') return pathname === '/docs'
      return pathname === href || pathname.startsWith(`${href}/`)
    },
    [pathname],
  )

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-[#050505]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Link href="/docs" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Dectra" width={112} height={32} className="h-8 w-auto" priority />
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center px-4 md:flex">
            <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-500">
              <Search size={15} />
              <span>Search</span>
              <span className="ml-auto rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-400">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              API Console
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 pt-16 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)_240px]">
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] overflow-y-auto border-r border-zinc-800/80 pr-4 lg:block">
            {navGroups.map((group) => (
              <div key={group.title} className="mb-8">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-zinc-500">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActiveLink(item.href)
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`block rounded-md border-l-2 px-3 py-2 text-sm transition ${
                          active
                            ? 'border-purple-500 bg-white/5 pl-4 text-white'
                            : 'border-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </aside>

          <main className="min-w-0 py-8 lg:py-10">
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setTocOpen((open) => !open)}
                className="ml-auto mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300"
              >
                <Menu size={16} />
                Page outline
              </button>
              {tocOpen ? (
                <div className="mb-6 rounded-2xl border border-zinc-800 bg-[#161616] p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-zinc-500">
                    On this page
                  </div>
                  <div className="space-y-1">
                    {tocItems.map((item) => {
                      const active = activeId === item.id
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block rounded-md px-3 py-2 text-sm ${
                            item.level === 2 ? 'pl-6' : ''
                          } ${active ? 'text-white' : 'text-zinc-400'}`}
                        >
                          {item.label}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            {children}
          </main>

          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] overflow-y-auto pl-4 lg:block">
            <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.05em] text-zinc-500">
                On this page
              </div>
              <div className="space-y-1">
                {tocItems.map((item) => {
                  const active = activeId === item.id
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block rounded-md px-3 py-2 text-sm transition ${
                        item.level === 2 ? 'pl-6' : ''
                      } ${active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {item.label}
                    </a>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
