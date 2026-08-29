import { PageHeader } from '@/components/page-header'
import { SituationOverview } from '@/components/dashboard/situation-overview'
import { ActiveThreat } from '@/components/dashboard/active-threat'
import { DisasterMap } from '@/components/map/disaster-map'
import { IsolationCountdown } from '@/components/dashboard/isolation-countdown'
import { RiskChart } from '@/components/dashboard/risk-chart'
import { CascadePanel } from '@/components/dashboard/cascade-panel'
import { ResourcePanel } from '@/components/dashboard/resource-panel'
import { OptimizedResponse } from '@/components/dashboard/optimized-response'
import { CopilotPanel } from '@/components/copilot-panel'
import { AlertStream } from '@/components/dashboard/alert-stream'
import { Panel } from '@/components/ui/panel'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <PageHeader
        title="Command Center"
        description="Live operational picture — Monsoon Flood, Region Alpha"
      />

      {/* 1. Situation overview metrics */}
      <SituationOverview />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* 3. Live map takes two columns on wide screens */}
        <Panel
          title="Live Disaster Map"
          subtitle="Flood zones · infrastructure · rescue assets"
          className="xl:col-span-2"
          contentClassName="p-0"
        >
          <DisasterMap className="h-[520px] w-full" />
        </Panel>

        {/* 2 + 4. Active threat and isolation countdown */}
        <div className="flex flex-col gap-4">
          <ActiveThreat />
          <IsolationCountdown />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* 5. Risk trajectory */}
        <RiskChart />
        {/* 6. Cascade network */}
        <CascadePanel />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* 7. Resource status */}
        <ResourcePanel />
        {/* 8. Optimized response plan */}
        <OptimizedResponse />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* 9. AI copilot */}
        <CopilotPanel className="xl:col-span-2" />
        {/* 10. Live alert stream */}
        <AlertStream />
      </div>
    </div>
  )
}
