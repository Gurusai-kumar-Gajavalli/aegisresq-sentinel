import Link from 'next/link'
import { AlertTriangle, ArrowDown, FlaskConical, Network } from 'lucide-react'
import { Panel } from '@/components/ui/panel'

const chain = ['Bridge B01', 'Road R05', 'Zone Z03', 'Hospital H02']

export function ActiveThreat() {
  return (
    <Panel
      title="Critical Infrastructure Threat"
      icon={<AlertTriangle className="h-4 w-4 text-critical" />}
      className="border-critical/30"
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-critical/30 bg-critical/10 p-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bridge B01
              </div>
              <div className="text-sm text-foreground">Sentinel River Crossing</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl font-bold leading-none text-critical">82%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Failure Probability
              </div>
            </div>
          </div>
          <div className="mt-2.5 border-t border-critical/20 pt-2.5 text-[11px] text-muted-foreground">
            <span className="text-foreground">Primary cause:</span> Rapid river-level increase
            (0.12 m/min) exceeding structural tolerance.
          </div>
        </div>

        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Affected Network
          </div>
          <ol className="flex flex-col items-start gap-0.5">
            {chain.map((node, i) => (
              <li key={node} className="flex flex-col items-start">
                <span className="rounded-sm border border-border bg-secondary px-2 py-1 font-mono text-[12px] font-medium text-foreground">
                  {node}
                </span>
                {i < chain.length - 1 && (
                  <ArrowDown className="my-0.5 ml-3 h-3.5 w-3.5 text-critical" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/risk-graph"
            className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <Network className="h-4 w-4" />
            View Cascade
          </Link>
          <Link
            href="/simulation"
            className="flex items-center justify-center gap-1.5 rounded-md bg-critical px-3 py-2 text-[12px] font-semibold text-critical-foreground transition-colors hover:opacity-90"
          >
            <FlaskConical className="h-4 w-4" />
            Run What-If
          </Link>
        </div>
      </div>
    </Panel>
  )
}
