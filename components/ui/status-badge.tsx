import { cn } from '@/lib/utils'
import { SEVERITY_BADGE, SEVERITY_DOT, SEVERITY_LABEL } from '@/lib/severity'
import type { Severity } from '@/lib/types'

interface StatusBadgeProps {
  severity: Severity
  label?: string
  dot?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export function StatusBadge({
  severity,
  label,
  dot = true,
  className,
  size = 'md',
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border font-medium uppercase tracking-wide',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]',
        SEVERITY_BADGE[severity],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn('h-1.5 w-1.5 rounded-full', SEVERITY_DOT[severity])}
        />
      )}
      {label ?? SEVERITY_LABEL[severity]}
    </span>
  )
}
