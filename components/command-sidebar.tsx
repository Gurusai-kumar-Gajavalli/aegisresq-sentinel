'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldAlert, UserRound, X } from 'lucide-react'
import { navItems } from '@/lib/nav'
import { cn } from '@/lib/utils'

interface CommandSidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function CommandSidebar({ mobileOpen, onClose }: CommandSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-mono text-sm font-bold tracking-widest text-foreground">
              AEGISRESQ
            </div>
            <div className="font-mono text-[11px] font-medium tracking-[0.28em] text-primary">
              SENTINEL
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Operations
          </p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors',
                      active
                        ? 'bg-sidebar-accent text-foreground'
                        : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-6 w-1 shrink-0 rounded-full transition-colors',
                        active ? 'bg-primary' : 'bg-transparent',
                      )}
                      aria-hidden="true"
                    />
                    <Icon className={cn('h-4 w-4 shrink-0', active && 'text-primary')} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* System status */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <div className="rounded-md border border-sidebar-border bg-background/40 px-2.5 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              System Status
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-safe" />
              </span>
              <span className="text-[12px] font-medium text-foreground">
                All systems operational
              </span>
            </div>
          </div>

          {/* User */}
          <div className="mt-3 flex items-center gap-2.5 px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-1 ring-border">
              <UserRound className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="text-[12px] font-semibold text-foreground">
                Emergency Commander
              </div>
              <div className="text-[11px] text-muted-foreground">Command Center Alpha</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
