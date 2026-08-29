'use client'

import { useState } from 'react'
import { CheckCircle2, Cpu, MapPin, Send } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { StatusBadge } from '@/components/ui/status-badge'
import { optimizedResponse } from '@/lib/mock-data'

export function OptimizedResponse() {
  const [dispatched, setDispatched] = useState(false)

  return (
    <Panel
      title="AI-Optimized Response"
      subtitle="Decision-support recommendation"
      icon={<Cpu className="h-4 w-4" />}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-secondary/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Recommended Mission
            </div>
            <div className="mt-0.5 text-[13px] font-semibold text-foreground">
              {optimizedResponse.mission}
            </div>
          </div>
          <div className="rounded-md border border-border bg-secondary/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Recommended Route
            </div>
            <div className="mt-0.5 font-mono text-[13px] font-semibold text-foreground">
              {optimizedResponse.route.join(' → ')}
            </div>
          </div>
          <div className="rounded-md border border-border bg-secondary/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Estimated Travel
            </div>
            <div className="mt-0.5 font-mono text-[13px] font-semibold text-foreground">
              {optimizedResponse.travelMinutes} minutes
            </div>
          </div>
          <div className="rounded-md border border-border bg-secondary/40 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Route Risk
            </div>
            <div className="mt-1">
              <StatusBadge severity="safe" label="Low" dot={false} />
            </div>
          </div>
        </div>

        <div className="rounded-md border-l-2 border-info bg-info/5 py-2 pl-3 pr-2 text-[12px] leading-snug text-muted-foreground">
          <span className="font-semibold text-foreground">Reasoning: </span>
          {optimizedResponse.reason}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDispatched(true)}
            disabled={dispatched}
            className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {dispatched ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Team Dispatched
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Dispatch Team
              </>
            )}
          </button>
          <button className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-accent">
            <MapPin className="h-4 w-4" /> View Route
          </button>
        </div>
      </div>
    </Panel>
  )
}
