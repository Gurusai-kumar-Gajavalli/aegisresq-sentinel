'use client'

import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { formatCountdown } from '@/lib/severity'
import { situationMetrics } from '@/lib/mock-data'

const factors = [
  { label: 'River level', value: 88, severity: 'critical' as const },
  { label: 'Rainfall rate', value: 74, severity: 'warning' as const },
  { label: 'Bridge condition', value: 82, severity: 'critical' as const },
  { label: 'Road accessibility', value: 61, severity: 'warning' as const },
]

const marks = [
  { label: 'NOW', pos: 0 },
  { label: '30 MIN', pos: 30 },
  { label: '60 MIN', pos: 60 },
  { label: '102 MIN', pos: 102 },
  { label: 'ISOLATION', pos: 102 },
]

const barColor: Record<'critical' | 'warning', string> = {
  critical: 'bg-critical',
  warning: 'bg-warning',
}

export function IsolationCountdown() {
  const [seconds, setSeconds] = useState(situationMetrics.isolationWindowSeconds)

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s <= 0 ? 0 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const elapsedPct = Math.min(
    100,
    ((situationMetrics.isolationWindowSeconds - seconds) /
      situationMetrics.isolationWindowSeconds) *
      100,
  )

  return (
    <Panel
      title="Time-to-Isolation"
      subtitle="Zone Z03 · Lowland Village"
      icon={<Timer className="h-4 w-4" />}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md border border-border bg-secondary/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Isolation Prob.
            </div>
            <div className="font-mono text-xl font-bold text-critical">78%</div>
          </div>
          <div className="rounded-md border border-border bg-secondary/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Est. Isolation
            </div>
            <div className="font-mono text-xl font-bold text-warning">102m</div>
          </div>
          <div className="rounded-md border border-warning/30 bg-warning/10 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Countdown
            </div>
            <div className="font-mono text-xl font-bold tabular-nums text-warning">
              {formatCountdown(seconds)}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="relative mt-2 h-2 rounded-full bg-secondary">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-warning to-critical transition-all duration-1000"
              style={{ width: `${elapsedPct}%` }}
            />
            {marks.slice(0, 4).map((m) => (
              <span
                key={m.label}
                className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-border"
                style={{ left: `${(m.pos / 102) * 100}%` }}
                aria-hidden="true"
              />
            ))}
            <span
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-critical transition-all duration-1000"
              style={{ left: `${elapsedPct}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
            {marks.slice(0, 4).map((m) => (
              <span key={m.label}>{m.label}</span>
            ))}
          </div>
        </div>

        {/* Factors */}
        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Contributing Factors
          </div>
          <ul className="flex flex-col gap-2">
            {factors.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[12px] text-foreground">{f.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${barColor[f.severity]}`}
                    style={{ width: `${f.value}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {f.value}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  )
}
