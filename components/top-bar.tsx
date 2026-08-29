'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, ChevronDown, FlaskConical, Menu, Radio, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const scenarios = [
  'Monsoon Flood — Region Alpha',
  'Cyclone Surge — Coastal Delta',
  'Flash Flood — Hill District',
]

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [now, setNow] = useState<Date | null>(null)
  const [dataAge, setDataAge] = useState(12)
  const [scenario, setScenario] = useState(scenarios[0])
  const [scenarioOpen, setScenarioOpen] = useState(false)

  useEffect(() => {
    setNow(new Date())
    const clock = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(clock)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setDataAge((a) => (a >= 30 ? 1 : a + 1))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-3 backdrop-blur-md sm:px-4">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title block */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-mono text-sm font-bold tracking-wider text-foreground">
              AEGISRESQ SENTINEL
            </h1>
            <span className="hidden items-center gap-1 rounded-sm border border-critical/40 bg-critical/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-critical sm:inline-flex">
              Live Disaster Response
            </span>
          </div>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="relative ml-1 hidden md:block">
        <button
          onClick={() => setScenarioOpen((o) => !o)}
          className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-2.5 py-1.5 text-[12px] font-medium text-foreground hover:border-primary/50"
          aria-haspopup="listbox"
          aria-expanded={scenarioOpen}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Scenario
          </span>
          <span className="max-w-[220px] truncate">{scenario}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {scenarioOpen && (
          <ul
            className="absolute left-0 top-full z-40 mt-1 w-72 overflow-hidden rounded-md border border-border bg-popover py-1 shadow-xl"
            role="listbox"
          >
            {scenarios.map((s) => (
              <li key={s}>
                <button
                  role="option"
                  aria-selected={s === scenario}
                  onClick={() => {
                    setScenario(s)
                    setScenarioOpen(false)
                  }}
                  className={cn(
                    'block w-full px-3 py-2 text-left text-[12px] hover:bg-accent',
                    s === scenario ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Live status */}
        <div className="hidden items-center gap-1.5 rounded-md border border-critical/30 bg-critical/10 px-2 py-1.5 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-critical" />
          </span>
          <span className="font-mono text-[11px] font-bold tracking-widest text-critical">
            LIVE
          </span>
        </div>

        {/* Data freshness + clock */}
        <div className="hidden flex-col items-end leading-tight lg:flex">
          <span className="font-mono text-[13px] font-semibold tabular-nums text-foreground">
            {now
              ? now.toLocaleTimeString('en-GB', { hour12: false })
              : '--:--:--'}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Radio className="h-3 w-3 text-safe" />
            Updated {dataAge}s ago
          </span>
        </div>

        {/* Simulation mode */}
        <Link
          href="/simulation"
          className="hidden h-9 items-center gap-1.5 rounded-md border border-border bg-background/50 px-2.5 text-[12px] font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground sm:flex"
        >
          <FlaskConical className="h-4 w-4" />
          <span className="hidden xl:inline">Simulation Mode</span>
        </Link>

        {/* Notifications */}
        <Link
          href="/alerts"
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          aria-label="View alerts"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 text-[9px] font-bold text-critical-foreground">
            7
          </span>
        </Link>

        {/* Commander profile */}
        <button
          className="flex h-9 items-center gap-2 rounded-md border border-border bg-background/50 px-1.5 pr-2.5 hover:border-primary/50"
          aria-label="Commander profile"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
            <UserRound className="h-3.5 w-3.5" />
          </span>
          <span className="hidden text-[12px] font-medium text-foreground xl:inline">
            Commander
          </span>
        </button>
      </div>
    </header>
  )
}
