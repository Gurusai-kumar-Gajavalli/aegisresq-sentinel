import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PanelProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  /** Removes body padding for maps / flush content. */
  flush?: boolean
}

export function Panel({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  bodyClassName,
  flush,
}: PanelProps) {
  return (
    <section
      className={cn(
        'flex flex-col overflow-hidden rounded-md border border-border bg-card',
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-3.5 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
            <div className="min-w-0">
              {title && (
                <h2 className="truncate text-xs font-semibold uppercase tracking-wider text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className={cn(!flush && 'p-3.5', 'min-h-0 flex-1', bodyClassName)}>
        {children}
      </div>
    </section>
  )
}
