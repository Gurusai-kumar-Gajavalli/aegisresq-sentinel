'use client'

import { AlertTriangle, Activity, Info, Radio, ShieldAlert, Waves } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'
import { alerts } from '@/lib/mock-data'
import type { AlertEvent } from '@/lib/types'
import { SEVERITY_TEXT } from '@/lib/severity'

const iconFor: Record<AlertEvent['category'], typeof Info> = {
  flood: Waves,
  infrastructure: ShieldAlert,
  road: Activity,
  medical: AlertTriangle,
  operations: Radio,
}

const statusTone: Record<AlertEvent['status'], string> = {
  active: 'text-critical',
  escalated: 'text-warning',
  acknowledged: 'text-info',
  resolved: 'text-muted-foreground',
}

export function AlertStream({ className }: { className?: string }) {
  return (
    <Panel
      title="Live Alert Stream"
      subtitle="Real-time incident feed"
      className={className}
      contentClassName="p-0"
    >
      <ul className="divide-y divide-border/60">
        {alerts.map((alert) => {
          const Icon = iconFor[alert.category] ?? Info
          return (
            <li
              key={alert.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <div
                className={cn(
                  'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/40',
                  SEVERITY_TEXT[alert.severity],
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-sm text-foreground">
                    {alert.message}
                  </p>
                  <time className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {alert.time}
                  </time>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {alert.location ? `${alert.location} · ` : ''}
                  {alert.source}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge severity={alert.severity} size="sm" />
                  <span
                    className={cn(
                      'font-mono text-[10px] uppercase tracking-wide',
                      statusTone[alert.status],
                    )}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
