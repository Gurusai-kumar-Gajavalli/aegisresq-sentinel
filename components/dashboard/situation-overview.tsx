'use client'

import { useEffect, useState } from 'react'
import { AlertOctagon, Timer, Siren, Users } from 'lucide-react'
import { situationMetrics } from '@/lib/mock-data'
import { formatCountdown } from '@/lib/severity'
import { MetricCard } from './metric-card'

export function SituationOverview() {
  const [seconds, setSeconds] = useState(situationMetrics.isolationWindowSeconds)

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s <= 0 ? 0 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Overall Risk"
        value={`${situationMetrics.overallRisk}`}
        severity="critical"
        statusLabel="Critical"
        explanation="Composite risk index across flood, infrastructure and population exposure (0–100)."
        trend={{ direction: 'up', value: '+6', good: false }}
        icon={<AlertOctagon className="h-3.5 w-3.5" />}
      />
      <MetricCard
        label="Isolation Window"
        value={formatCountdown(seconds)}
        severity="warning"
        statusLabel="Countdown"
        explanation="Estimated time until Zone Z03 (Lowland Village) becomes isolated."
        icon={<Timer className="h-3.5 w-3.5" />}
        mono
      />
      <MetricCard
        label="Active Incidents"
        value={String(situationMetrics.activeIncidents).padStart(2, '0')}
        severity="warning"
        statusLabel={`${situationMetrics.criticalIncidents} critical`}
        explanation="Open incidents currently tracked across all operational zones."
        icon={<Siren className="h-3.5 w-3.5" />}
        mono
      />
      <MetricCard
        label="People at Risk"
        value={situationMetrics.peopleAtRisk.toLocaleString()}
        severity="critical"
        statusLabel="Rising"
        explanation="Estimated population within projected flood and isolation zones."
        trend={{ direction: 'up', value: `+${situationMetrics.peopleTrendPct}% / 30m`, good: false }}
        icon={<Users className="h-3.5 w-3.5" />}
      />
    </div>
  )
}
