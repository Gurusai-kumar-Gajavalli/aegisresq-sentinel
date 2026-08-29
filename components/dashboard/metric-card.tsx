import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SEVERITY_TEXT } from '@/lib/severity'
import type { Severity } from '@/lib/types'
import { StatusBadge } from '@/components/ui/status-badge'

interface MetricCardProps {
  label: string
  value: string
  severity?: Severity
  statusLabel?: string
  explanation: string
  trend?: { direction: 'up' | 'down'; value: string; good?: boolean }
  icon?: ReactNode
  mono?: boolean
}

export function MetricCard({
  label,
  value,
  severity,
  statusLabel,
  explanation,
  trend,
  icon,
  mono,
}: MetricCardProps) {
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-md border border-border bg-card p-3.5">
      {severity && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 top-0 h-0.5',
            severity === 'critical' && 'bg-critical',
            severity === 'warning' && 'bg-warning',
            severity === 'elevated' && 'bg-elevated',
            severity === 'safe' && 'bg-safe',
            severity === 'info' && 'bg-info',
          )}
        />
      )}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {icon}
          {label}
        </span>
        {severity && <StatusBadge severity={severity} label={statusLabel} size="sm" />}
      </div>

      <div className="flex items-end gap-2">
        <span
          className={cn(
            'text-3xl font-bold leading-none tracking-tight text-foreground',
            mono && 'font-mono tabular-nums',
            severity && SEVERITY_TEXT[severity],
          )}
        >
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              'mb-0.5 flex items-center gap-0.5 text-[11px] font-semibold',
              trend.good ? 'text-safe' : 'text-critical',
            )}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>

      <p className="text-[11px] leading-snug text-muted-foreground text-pretty">{explanation}</p>
    </div>
  )
}
