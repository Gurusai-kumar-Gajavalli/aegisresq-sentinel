// Shared domain types for AEGISRESQ SENTINEL.
// These interfaces define the contract the frontend expects so the mock
// service layer can later be swapped for a FastAPI backend without UI changes.

export type Severity = 'critical' | 'warning' | 'elevated' | 'safe' | 'info'

export type AssetType =
  | 'zone'
  | 'bridge'
  | 'road'
  | 'hospital'
  | 'shelter'
  | 'team'
  | 'sensor'
  | 'river'

export interface LngLat {
  lng: number
  lat: number
}

export interface Zone {
  id: string // Z01
  name: string
  population: number
  risk: number // 0-100
  status: Severity
  isolationProbability: number // 0-100
  isolationMinutes: number
  connected: boolean
  center: LngLat
}

export interface Bridge {
  id: string // B01
  name: string
  status: Severity
  structuralRisk: number
  failureProbability: number
  riverLevel: number // meters
  crossesRoadId: string
  location: LngLat
}

export interface Road {
  id: string // R05
  name: string
  status: Severity
  accessibility: number // 0-100 %
  open: boolean
  risk: number
  path: LngLat[]
}

export interface Hospital {
  id: string // H01
  name: string
  status: Severity
  capacity: number
  occupancy: number
  risk: number
  location: LngLat
}

export interface Shelter {
  id: string // S01
  name: string
  status: Severity
  capacity: number
  occupancy: number
  location: LngLat
}

export type TeamStatus = 'available' | 'en-route' | 'busy' | 'standby'

export interface RescueTeam {
  id: string // T01
  name: string
  status: TeamStatus
  destinationZoneId?: string
  etaMinutes?: number
  location: LngLat
  personnel: number
}

export interface Sensor {
  id: string // SN01
  type: 'river' | 'rainfall' | 'structural' | 'traffic'
  label: string
  value: number
  unit: string
  status: Severity
  location: LngLat
}

export interface FloodZone {
  id: string
  name: string
  severity: Severity
  polygon: LngLat[]
}

export interface RiverSegment {
  id: string // R01 (river)
  name: string
  level: number
  riseRate: number // m/min
  path: LngLat[]
}

export interface EvacuationRoute {
  id: string
  label: string
  status: Severity
  path: LngLat[]
}

export interface CascadeNode {
  id: string
  label: string
  type: AssetType
  risk: number
  status: Severity
  x: number // normalized 0-1 layout coords
  y: number
}

export interface CascadeEdge {
  from: string
  to: string
  critical: boolean
}

export interface CascadeGraph {
  nodes: CascadeNode[]
  edges: CascadeEdge[]
  criticalPath: string[]
  impact: {
    people: number
    hospitals: number
    roads: number
    shelters: number
  }
}

export interface RiskTrajectoryPoint {
  t: number // minutes relative to now (negative = past)
  label: string
  flood: number
  infrastructure: number
  population: number
  predicted: boolean
}

export interface ForecastPoint {
  label: string
  minutes: number
  rainfall: number // mm/hr
  riverLevel: number // m
  floodRisk: number
  infraFailure: number
}

export interface Mission {
  id: string // M-024
  teamId: string
  zoneId: string
  status: TeamStatus
  etaMinutes: number
  route: string[]
  risk: Severity
  priority: number
}

export interface AlertEvent {
  id: string
  time: string // HH:MM:SS
  timestamp: number
  severity: Severity
  category: 'infrastructure' | 'flood' | 'road' | 'medical' | 'operations'
  message: string
  location?: string
  source: string
  status: 'active' | 'acknowledged' | 'escalated' | 'resolved'
}

export interface CopilotMessage {
  id: string
  role: 'commander' | 'copilot'
  content: string
  timestamp: number
}

export interface SituationMetrics {
  overallRisk: number
  overallStatus: Severity
  isolationWindowSeconds: number
  isolationZoneId: string
  activeIncidents: number
  criticalIncidents: number
  peopleAtRisk: number
  peopleTrendPct: number
}

export interface OptimizedResponse {
  mission: string
  route: string[]
  travelMinutes: number
  risk: Severity
  reason: string
  teamId: string
  zoneId: string
}

export interface SimulationState {
  active: boolean
  scenario: string
  bridge: { id: string; status: Severity; label: string }
  road: { id: string; open: boolean; label: string }
  zone: { id: string; status: Severity; label: string }
  isolationMinutes: number
  peopleAtRisk: number
  newRoute: string[]
  teamId: string
}
