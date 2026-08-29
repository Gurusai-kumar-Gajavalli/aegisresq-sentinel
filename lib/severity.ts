import type { Severity } from './types'

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'Critical',
  warning: 'Warning',
  elevated: 'Elevated',
  safe: 'Safe',
  info: 'Information',
}

// Hex/oklch color values for non-CSS contexts (map, canvas, svg).
export const SEVERITY_COLOR: Record<Severity, string> = {
  critical: 'oklch(0.62 0.22 25)',
  warning: 'oklch(0.72 0.16 55)',
  elevated: 'oklch(0.82 0.15 92)',
  safe: 'oklch(0.72 0.15 155)',
  info: 'oklch(0.68 0.13 232)',
}

// Tailwind text color classes.
export const SEVERITY_TEXT: Record<Severity, string> = {
  critical: 'text-critical',
  warning: 'text-warning',
  elevated: 'text-elevated',
  safe: 'text-safe',
  info: 'text-info',
}

// Soft badge backgrounds using color-mix so we stay on the token system.
export const SEVERITY_BADGE: Record<Severity, string> = {
  critical: 'bg-critical/15 text-critical border-critical/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  elevated: 'bg-elevated/15 text-elevated border-elevated/30',
  safe: 'bg-safe/15 text-safe border-safe/30',
  info: 'bg-info/15 text-info border-info/30',
}

export const SEVERITY_DOT: Record<Severity, string> = {
  critical: 'bg-critical',
  warning: 'bg-warning',
  elevated: 'bg-elevated',
  safe: 'bg-safe',
  info: 'bg-info',
}

export function riskToSeverity(risk: number): Severity {
  if (risk >= 80) return 'critical'
  if (risk >= 60) return 'warning'
  if (risk >= 40) return 'elevated'
  return 'safe'
}

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':')
}
