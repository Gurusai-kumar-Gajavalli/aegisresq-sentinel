import {
  Activity,
  AlertTriangle,
  Bot,
  CloudRain,
  LayoutDashboard,
  LifeBuoy,
  Network,
  Boxes,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Risk Intelligence', href: '/risk-intelligence', icon: Activity },
  { label: 'Risk Graph', href: '/risk-graph', icon: Network },
  { label: 'Forecast', href: '/forecast', icon: CloudRain },
  { label: 'Rescue Operations', href: '/rescue-operations', icon: LifeBuoy },
  { label: 'Resources', href: '/resources', icon: Boxes },
  { label: 'What-If Simulation', href: '/simulation', icon: FlaskConical },
  { label: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { label: 'AI Copilot', href: '/copilot', icon: Bot },
]
