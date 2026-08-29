'use client'

import { type ReactNode, useState } from 'react'
import { CommandSidebar } from './command-sidebar'
import { TopBar } from './top-bar'

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <CommandSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">{children}</main>
      </div>
    </div>
  )
}
