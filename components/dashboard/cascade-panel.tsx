import Link from 'next/link'
import { Building2, Network, Route, Tent, Users } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { CascadeGraph } from '@/components/cascade-graph'
import { cascadeGraph } from '@/lib/mock-data'

export function CascadePanel() {
  const { impact } = cascadeGraph
  const stats = [
    { icon: Users, label: 'People', value: impact.people.toLocaleString() },
    { icon: Building2, label: 'Hospital', value: impact.hospitals },
    { icon: Route, label: 'Roads', value: impact.roads },
    { icon: Tent, label: 'Shelters', value: impact.shelters },
  ]

  return (
    <Panel
      title="Cascading Risk Graph"
      icon={<Network className="h-4 w-4" />}
      actions={
        <Link
          href="/risk-graph"
          className="rounded-md border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          Open Risk Graph
        </Link>
      }
    >
      <div className="flex flex-col gap-3">
        <CascadeGraph graph={cascadeGraph} height={190} />

        <div className="rounded-md border border-critical/30 bg-critical/10 px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Cascade Path
          </div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-critical">
            R01 → B01 → R05 → Z03
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-md border border-border bg-secondary/40 px-2 py-2 text-center"
            >
              <s.icon className="mx-auto mb-1 h-3.5 w-3.5 text-muted-foreground" />
              <div className="font-mono text-sm font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}
