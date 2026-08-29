import Link from 'next/link'
import { LifeBuoy, Truck, Wrench } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { StatusBadge } from '@/components/ui/status-badge'
import { rescueTeams } from '@/lib/mock-data'
import type { TeamStatus } from '@/lib/types'

const teamStatusMap: Record<TeamStatus, { severity: 'safe' | 'info' | 'warning' | 'elevated'; label: string }> = {
  available: { severity: 'safe', label: 'Available' },
  'en-route': { severity: 'info', label: 'En Route' },
  busy: { severity: 'warning', label: 'Busy' },
  standby: { severity: 'elevated', label: 'Standby' },
}

export function ResourcePanel() {
  const featured = rescueTeams.slice(0, 4)
  const available = rescueTeams.filter((t) => t.status === 'available').length

  return (
    <Panel
      title="Rescue Operations"
      icon={<LifeBuoy className="h-4 w-4" />}
      actions={
        <Link
          href="/resources"
          className="rounded-md border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          View Resources
        </Link>
      }
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Rescue Teams
            </span>
            <span className="font-mono text-[11px] text-foreground">
              {available} / {rescueTeams.length} Available
            </span>
          </div>
          <ul className="flex flex-col gap-1">
            {featured.map((t) => {
              const meta = teamStatusMap[t.status]
              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-2.5 py-1.5"
                >
                  <div>
                    <span className="text-[12px] font-medium text-foreground">{t.name}</span>
                    {t.destinationZoneId && (
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        Zone {t.destinationZoneId}
                        {t.etaMinutes ? ` · ETA ${t.etaMinutes}m` : ''}
                      </span>
                    )}
                  </div>
                  <StatusBadge severity={meta.severity} label={meta.label} size="sm" dot={false} />
                </li>
              )
            })}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-secondary/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Truck className="h-3.5 w-3.5" /> Vehicles
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-foreground">24 / 31</div>
            <div className="text-[10px] text-muted-foreground">Available</div>
          </div>
          <div className="rounded-md border border-border bg-secondary/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Wrench className="h-3.5 w-3.5" /> Equipment
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-safe">72%</div>
            <div className="text-[10px] text-muted-foreground">Ready</div>
          </div>
        </div>
      </div>
    </Panel>
  )
}
