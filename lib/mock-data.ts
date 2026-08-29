import type {
  AlertEvent,
  Bridge,
  CascadeGraph,
  CopilotMessage,
  EvacuationRoute,
  FloodZone,
  ForecastPoint,
  Hospital,
  Mission,
  OptimizedResponse,
  RescueTeam,
  RiskTrajectoryPoint,
  RiverSegment,
  Road,
  Sensor,
  Shelter,
  SituationMetrics,
  Zone,
} from './types'

// Fictional disaster region: "Region Alpha" — a river valley in central India.
// Map is centered here. All coordinates are internally consistent.
export const REGION_CENTER = { lng: 78.42, lat: 20.53 }
export const REGION_NAME = 'Region Alpha'
export const SCENARIO = 'Monsoon Flood — Region Alpha'

export const zones: Zone[] = [
  {
    id: 'Z01',
    name: 'Riverside North',
    population: 8200,
    risk: 64,
    status: 'warning',
    isolationProbability: 41,
    isolationMinutes: 240,
    connected: true,
    center: { lng: 78.401, lat: 20.566 },
  },
  {
    id: 'Z02',
    name: 'Central Market',
    population: 15400,
    risk: 52,
    status: 'elevated',
    isolationProbability: 28,
    isolationMinutes: 320,
    connected: true,
    center: { lng: 78.437, lat: 20.541 },
  },
  {
    id: 'Z03',
    name: 'Lowland Village',
    population: 24850,
    risk: 91,
    status: 'critical',
    isolationProbability: 78,
    isolationMinutes: 102,
    connected: true,
    center: { lng: 78.463, lat: 20.508 },
  },
  {
    id: 'Z04',
    name: 'East Ridge',
    population: 6100,
    risk: 33,
    status: 'safe',
    isolationProbability: 12,
    isolationMinutes: 520,
    connected: true,
    center: { lng: 78.481, lat: 20.548 },
  },
  {
    id: 'Z05',
    name: 'South Fields',
    population: 9700,
    risk: 47,
    status: 'elevated',
    isolationProbability: 22,
    isolationMinutes: 410,
    connected: true,
    center: { lng: 78.445, lat: 20.486 },
  },
]

export const bridges: Bridge[] = [
  {
    id: 'B01',
    name: 'Sentinel River Crossing',
    status: 'critical',
    structuralRisk: 82,
    failureProbability: 82,
    riverLevel: 7.8,
    crossesRoadId: 'R05',
    location: { lng: 78.451, lat: 20.523 },
  },
  {
    id: 'B02',
    name: 'North Valley Bridge',
    status: 'warning',
    structuralRisk: 58,
    failureProbability: 58,
    riverLevel: 6.4,
    crossesRoadId: 'R02',
    location: { lng: 78.414, lat: 20.559 },
  },
  {
    id: 'B03',
    name: 'Market Overpass',
    status: 'elevated',
    structuralRisk: 44,
    failureProbability: 44,
    riverLevel: 5.9,
    crossesRoadId: 'R03',
    location: { lng: 78.44, lat: 20.53 },
  },
  {
    id: 'B04',
    name: 'East Ridge Span',
    status: 'safe',
    structuralRisk: 21,
    failureProbability: 21,
    riverLevel: 4.8,
    crossesRoadId: 'R07',
    location: { lng: 78.476, lat: 20.536 },
  },
  {
    id: 'B05',
    name: 'South Fields Bridge',
    status: 'elevated',
    structuralRisk: 39,
    failureProbability: 39,
    riverLevel: 5.5,
    crossesRoadId: 'R09',
    location: { lng: 78.45, lat: 20.5 },
  },
  {
    id: 'B06',
    name: 'Old Mill Footbridge',
    status: 'warning',
    structuralRisk: 61,
    failureProbability: 61,
    riverLevel: 6.7,
    crossesRoadId: 'R11',
    location: { lng: 78.428, lat: 20.515 },
  },
  {
    id: 'B07',
    name: 'Highway Viaduct',
    status: 'safe',
    structuralRisk: 18,
    failureProbability: 18,
    riverLevel: 4.2,
    crossesRoadId: 'R01',
    location: { lng: 78.39, lat: 20.55 },
  },
  {
    id: 'B08',
    name: 'Canal Access Bridge',
    status: 'elevated',
    structuralRisk: 47,
    failureProbability: 47,
    riverLevel: 5.7,
    crossesRoadId: 'R12',
    location: { lng: 78.466, lat: 20.492 },
  },
]

export const roads: Road[] = [
  {
    id: 'R01',
    name: 'National Highway 12',
    status: 'safe',
    accessibility: 96,
    open: true,
    risk: 15,
    path: [
      { lng: 78.37, lat: 20.57 },
      { lng: 78.4, lat: 20.55 },
      { lng: 78.43, lat: 20.545 },
    ],
  },
  {
    id: 'R02',
    name: 'North Valley Road',
    status: 'warning',
    accessibility: 63,
    open: true,
    risk: 55,
    path: [
      { lng: 78.401, lat: 20.566 },
      { lng: 78.414, lat: 20.559 },
      { lng: 78.437, lat: 20.541 },
    ],
  },
  {
    id: 'R03',
    name: 'Market Connector',
    status: 'elevated',
    accessibility: 78,
    open: true,
    risk: 40,
    path: [
      { lng: 78.437, lat: 20.541 },
      { lng: 78.44, lat: 20.53 },
      { lng: 78.451, lat: 20.523 },
    ],
  },
  {
    id: 'R05',
    name: 'Riverside Arterial',
    status: 'warning',
    accessibility: 74,
    open: true,
    risk: 74,
    path: [
      { lng: 78.451, lat: 20.523 },
      { lng: 78.458, lat: 20.515 },
      { lng: 78.463, lat: 20.508 },
    ],
  },
  {
    id: 'R07',
    name: 'East Ridge Route',
    status: 'safe',
    accessibility: 92,
    open: true,
    risk: 20,
    path: [
      { lng: 78.481, lat: 20.548 },
      { lng: 78.476, lat: 20.536 },
      { lng: 78.47, lat: 20.52 },
      { lng: 78.463, lat: 20.508 },
    ],
  },
  {
    id: 'R09',
    name: 'South Fields Lane',
    status: 'elevated',
    accessibility: 71,
    open: true,
    risk: 38,
    path: [
      { lng: 78.445, lat: 20.486 },
      { lng: 78.45, lat: 20.5 },
      { lng: 78.458, lat: 20.515 },
    ],
  },
  {
    id: 'R11',
    name: 'Old Mill Track',
    status: 'warning',
    accessibility: 52,
    open: true,
    risk: 58,
    path: [
      { lng: 78.428, lat: 20.515 },
      { lng: 78.44, lat: 20.512 },
      { lng: 78.451, lat: 20.51 },
    ],
  },
  {
    id: 'R12',
    name: 'Canal Access Road',
    status: 'elevated',
    accessibility: 66,
    open: true,
    risk: 44,
    path: [
      { lng: 78.466, lat: 20.492 },
      { lng: 78.464, lat: 20.5 },
      { lng: 78.463, lat: 20.508 },
    ],
  },
]

export const hospitals: Hospital[] = [
  {
    id: 'H01',
    name: 'Region Alpha General',
    status: 'safe',
    capacity: 420,
    occupancy: 288,
    risk: 24,
    location: { lng: 78.435, lat: 20.545 },
  },
  {
    id: 'H02',
    name: 'Lowland Community Hospital',
    status: 'warning',
    capacity: 180,
    occupancy: 166,
    risk: 61,
    location: { lng: 78.467, lat: 20.505 },
  },
  {
    id: 'H03',
    name: 'East Ridge Medical Center',
    status: 'safe',
    capacity: 260,
    occupancy: 141,
    risk: 19,
    location: { lng: 78.483, lat: 20.544 },
  },
  {
    id: 'H04',
    name: 'North Valley Clinic',
    status: 'elevated',
    capacity: 90,
    occupancy: 74,
    risk: 43,
    location: { lng: 78.406, lat: 20.561 },
  },
  {
    id: 'H05',
    name: 'South Fields Trauma Unit',
    status: 'elevated',
    capacity: 120,
    occupancy: 88,
    risk: 37,
    location: { lng: 78.447, lat: 20.489 },
  },
]

export const shelters: Shelter[] = [
  {
    id: 'S01',
    name: 'Central School Shelter',
    status: 'safe',
    capacity: 1200,
    occupancy: 640,
    location: { lng: 78.438, lat: 20.536 },
  },
  {
    id: 'S02',
    name: 'East Ridge Community Hall',
    status: 'safe',
    capacity: 800,
    occupancy: 310,
    location: { lng: 78.479, lat: 20.541 },
  },
  {
    id: 'S03',
    name: 'Lowland Relief Camp',
    status: 'warning',
    capacity: 950,
    occupancy: 902,
    location: { lng: 78.46, lat: 20.512 },
  },
  {
    id: 'S04',
    name: 'North Valley Gymnasium',
    status: 'elevated',
    capacity: 600,
    occupancy: 421,
    location: { lng: 78.41, lat: 20.556 },
  },
  {
    id: 'S05',
    name: 'South Fields Depot',
    status: 'safe',
    capacity: 500,
    occupancy: 188,
    location: { lng: 78.449, lat: 20.492 },
  },
  {
    id: 'S06',
    name: 'Market Ground Camp',
    status: 'elevated',
    capacity: 700,
    occupancy: 512,
    location: { lng: 78.442, lat: 20.528 },
  },
]

export const rescueTeams: RescueTeam[] = [
  { id: 'T01', name: 'Team 01', status: 'available', location: { lng: 78.436, lat: 20.544 }, personnel: 6 },
  {
    id: 'T02',
    name: 'Team 02',
    status: 'en-route',
    destinationZoneId: 'Z03',
    etaMinutes: 18,
    location: { lng: 78.455, lat: 20.518 },
    personnel: 8,
  },
  { id: 'T03', name: 'Team 03', status: 'available', location: { lng: 78.48, lat: 20.54 }, personnel: 6 },
  {
    id: 'T04',
    name: 'Team 04',
    status: 'busy',
    destinationZoneId: 'Z01',
    etaMinutes: 6,
    location: { lng: 78.404, lat: 20.562 },
    personnel: 7,
  },
  { id: 'T05', name: 'Team 05', status: 'available', location: { lng: 78.447, lat: 20.49 }, personnel: 5 },
  { id: 'T06', name: 'Team 06', status: 'standby', location: { lng: 78.438, lat: 20.535 }, personnel: 6 },
  {
    id: 'T07',
    name: 'Team 07',
    status: 'en-route',
    destinationZoneId: 'Z02',
    etaMinutes: 12,
    location: { lng: 78.44, lat: 20.534 },
    personnel: 8,
  },
  { id: 'T08', name: 'Team 08', status: 'available', location: { lng: 78.47, lat: 20.5 }, personnel: 6 },
  { id: 'T09', name: 'Team 09', status: 'busy', destinationZoneId: 'Z05', etaMinutes: 9, location: { lng: 78.448, lat: 20.494 }, personnel: 7 },
  { id: 'T10', name: 'Team 10', status: 'available', location: { lng: 78.415, lat: 20.55 }, personnel: 6 },
  { id: 'T11', name: 'Team 11', status: 'standby', location: { lng: 78.46, lat: 20.53 }, personnel: 5 },
  { id: 'T12', name: 'Team 12', status: 'available', location: { lng: 78.43, lat: 20.52 }, personnel: 6 },
]

export const sensors: Sensor[] = [
  { id: 'SN01', type: 'river', label: 'River gauge — Sentinel Crossing', value: 7.8, unit: 'm', status: 'critical', location: { lng: 78.451, lat: 20.523 } },
  { id: 'SN02', type: 'rainfall', label: 'Rainfall — Lowland', value: 62, unit: 'mm/hr', status: 'critical', location: { lng: 78.463, lat: 20.508 } },
  { id: 'SN03', type: 'river', label: 'River gauge — North Valley', value: 6.4, unit: 'm', status: 'warning', location: { lng: 78.414, lat: 20.559 } },
  { id: 'SN04', type: 'structural', label: 'Strain — Bridge B01', value: 82, unit: '%', status: 'critical', location: { lng: 78.451, lat: 20.523 } },
  { id: 'SN05', type: 'rainfall', label: 'Rainfall — Central', value: 48, unit: 'mm/hr', status: 'warning', location: { lng: 78.437, lat: 20.541 } },
  { id: 'SN06', type: 'traffic', label: 'Flow — Riverside Arterial', value: 74, unit: '%', status: 'warning', location: { lng: 78.458, lat: 20.515 } },
  { id: 'SN07', type: 'river', label: 'River gauge — Old Mill', value: 6.7, unit: 'm', status: 'warning', location: { lng: 78.428, lat: 20.515 } },
  { id: 'SN08', type: 'structural', label: 'Strain — Bridge B06', value: 61, unit: '%', status: 'warning', location: { lng: 78.428, lat: 20.515 } },
  { id: 'SN09', type: 'rainfall', label: 'Rainfall — East Ridge', value: 21, unit: 'mm/hr', status: 'safe', location: { lng: 78.481, lat: 20.548 } },
  { id: 'SN10', type: 'traffic', label: 'Flow — East Ridge Route', value: 92, unit: '%', status: 'safe', location: { lng: 78.476, lat: 20.536 } },
  { id: 'SN11', type: 'river', label: 'River gauge — South Fields', value: 5.5, unit: 'm', status: 'elevated', location: { lng: 78.45, lat: 20.5 } },
  { id: 'SN12', type: 'structural', label: 'Strain — Bridge B02', value: 58, unit: '%', status: 'warning', location: { lng: 78.414, lat: 20.559 } },
  { id: 'SN13', type: 'rainfall', label: 'Rainfall — South', value: 34, unit: 'mm/hr', status: 'elevated', location: { lng: 78.445, lat: 20.486 } },
  { id: 'SN14', type: 'traffic', label: 'Flow — Market Connector', value: 78, unit: '%', status: 'elevated', location: { lng: 78.44, lat: 20.53 } },
  { id: 'SN15', type: 'river', label: 'River gauge — Canal', value: 5.7, unit: 'm', status: 'elevated', location: { lng: 78.466, lat: 20.492 } },
  { id: 'SN16', type: 'structural', label: 'Strain — Bridge B05', value: 39, unit: '%', status: 'elevated', location: { lng: 78.45, lat: 20.5 } },
  { id: 'SN17', type: 'rainfall', label: 'Rainfall — North Valley', value: 55, unit: 'mm/hr', status: 'warning', location: { lng: 78.406, lat: 20.561 } },
  { id: 'SN18', type: 'traffic', label: 'Flow — North Valley Road', value: 63, unit: '%', status: 'warning', location: { lng: 78.414, lat: 20.559 } },
  { id: 'SN19', type: 'structural', label: 'Strain — Highway Viaduct', value: 18, unit: '%', status: 'safe', location: { lng: 78.39, lat: 20.55 } },
  { id: 'SN20', type: 'river', label: 'River gauge — East Ridge', value: 4.8, unit: 'm', status: 'safe', location: { lng: 78.476, lat: 20.536 } },
]

export const rivers: RiverSegment[] = [
  {
    id: 'R01-RIVER',
    name: 'Sentinel River',
    level: 7.8,
    riseRate: 0.12,
    path: [
      { lng: 78.38, lat: 20.58 },
      { lng: 78.41, lat: 20.56 },
      { lng: 78.44, lat: 20.535 },
      { lng: 78.451, lat: 20.523 },
      { lng: 78.458, lat: 20.508 },
      { lng: 78.47, lat: 20.49 },
      { lng: 78.49, lat: 20.475 },
    ],
  },
]

export const floodZones: FloodZone[] = [
  {
    id: 'FZ01',
    name: 'Lowland Inundation',
    severity: 'critical',
    polygon: [
      { lng: 78.446, lat: 20.52 },
      { lng: 78.475, lat: 20.515 },
      { lng: 78.478, lat: 20.495 },
      { lng: 78.452, lat: 20.49 },
      { lng: 78.44, lat: 20.505 },
    ],
  },
  {
    id: 'FZ02',
    name: 'Riverside Overflow',
    severity: 'warning',
    polygon: [
      { lng: 78.4, lat: 20.57 },
      { lng: 78.43, lat: 20.55 },
      { lng: 78.445, lat: 20.535 },
      { lng: 78.435, lat: 20.525 },
      { lng: 78.41, lat: 20.545 },
      { lng: 78.392, lat: 20.562 },
    ],
  },
  {
    id: 'FZ03',
    name: 'South Fields Seepage',
    severity: 'elevated',
    polygon: [
      { lng: 78.438, lat: 20.495 },
      { lng: 78.455, lat: 20.492 },
      { lng: 78.458, lat: 20.478 },
      { lng: 78.44, lat: 20.478 },
    ],
  },
]

export const evacuationRoutes: EvacuationRoute[] = [
  {
    id: 'EV01',
    label: 'Primary — Z03 to East Ridge Shelter',
    status: 'safe',
    path: [
      { lng: 78.463, lat: 20.508 },
      { lng: 78.47, lat: 20.52 },
      { lng: 78.476, lat: 20.536 },
      { lng: 78.479, lat: 20.541 },
    ],
  },
  {
    id: 'EV02',
    label: 'Secondary — Central to Highway',
    status: 'warning',
    path: [
      { lng: 78.437, lat: 20.541 },
      { lng: 78.43, lat: 20.545 },
      { lng: 78.4, lat: 20.55 },
    ],
  },
]

export const situationMetrics: SituationMetrics = {
  overallRisk: 91,
  overallStatus: 'critical',
  isolationWindowSeconds: 6120, // 01:42:00
  isolationZoneId: 'Z03',
  activeIncidents: 7,
  criticalIncidents: 3,
  peopleAtRisk: 24850,
  peopleTrendPct: 12.4,
}

// Risk trajectory: past 60 min -> now -> next 60 min (predicted)
export const riskTrajectory: RiskTrajectoryPoint[] = [
  { t: -60, label: '-60m', flood: 48, infrastructure: 41, population: 44, predicted: false },
  { t: -50, label: '-50m', flood: 53, infrastructure: 45, population: 48, predicted: false },
  { t: -40, label: '-40m', flood: 59, infrastructure: 52, population: 55, predicted: false },
  { t: -30, label: '-30m', flood: 66, infrastructure: 58, population: 61, predicted: false },
  { t: -20, label: '-20m', flood: 74, infrastructure: 66, population: 69, predicted: false },
  { t: -10, label: '-10m', flood: 83, infrastructure: 74, population: 79, predicted: false },
  { t: 0, label: 'NOW', flood: 91, infrastructure: 82, population: 88, predicted: false },
  { t: 10, label: '+10m', flood: 93, infrastructure: 85, population: 90, predicted: true },
  { t: 20, label: '+20m', flood: 95, infrastructure: 87, population: 92, predicted: true },
  { t: 30, label: '+30m', flood: 96, infrastructure: 89, population: 93, predicted: true },
  { t: 40, label: '+40m', flood: 95, infrastructure: 90, population: 92, predicted: true },
  { t: 50, label: '+50m', flood: 93, infrastructure: 88, population: 90, predicted: true },
  { t: 60, label: '+60m', flood: 90, infrastructure: 86, population: 88, predicted: true },
]

export const forecast: ForecastPoint[] = [
  { label: 'NEXT 15 MIN', minutes: 15, rainfall: 64, riverLevel: 7.95, floodRisk: 93, infraFailure: 84 },
  { label: 'NEXT 30 MIN', minutes: 30, rainfall: 61, riverLevel: 8.15, floodRisk: 95, infraFailure: 88 },
  { label: 'NEXT 60 MIN', minutes: 60, rainfall: 54, riverLevel: 8.4, floodRisk: 96, infraFailure: 91 },
  { label: 'NEXT 120 MIN', minutes: 120, rainfall: 41, riverLevel: 8.1, floodRisk: 92, infraFailure: 87 },
]

// Detailed forecast series for charts (per 15-min step)
export const forecastSeries: ForecastPoint[] = Array.from({ length: 9 }).map((_, i) => {
  const minutes = i * 15
  const rainfall = [58, 64, 63, 61, 57, 54, 49, 44, 41][i]
  const riverLevel = [7.8, 7.95, 8.05, 8.15, 8.3, 8.4, 8.35, 8.2, 8.1][i]
  const floodRisk = [91, 93, 94, 95, 96, 96, 95, 93, 92][i]
  const infraFailure = [82, 84, 86, 88, 90, 91, 90, 88, 87][i]
  return { label: `+${minutes}m`, minutes, rainfall, riverLevel, floodRisk, infraFailure }
})

export const cascadeGraph: CascadeGraph = {
  nodes: [
    { id: 'R01', label: 'River R01', type: 'river', risk: 88, status: 'critical', x: 0.08, y: 0.5 },
    { id: 'B01', label: 'Bridge B01', type: 'bridge', risk: 82, status: 'critical', x: 0.3, y: 0.5 },
    { id: 'R05', label: 'Road R05', type: 'road', risk: 74, status: 'warning', x: 0.52, y: 0.5 },
    { id: 'Z03', label: 'Village Z03', type: 'zone', risk: 91, status: 'critical', x: 0.74, y: 0.5 },
    { id: 'H02', label: 'Hospital H02', type: 'hospital', risk: 61, status: 'warning', x: 0.93, y: 0.3 },
    { id: 'S03', label: 'Shelter S03', type: 'shelter', risk: 57, status: 'warning', x: 0.93, y: 0.72 },
  ],
  edges: [
    { from: 'R01', to: 'B01', critical: true },
    { from: 'B01', to: 'R05', critical: true },
    { from: 'R05', to: 'Z03', critical: true },
    { from: 'Z03', to: 'H02', critical: false },
    { from: 'Z03', to: 'S03', critical: false },
  ],
  criticalPath: ['R01', 'B01', 'R05', 'Z03'],
  impact: { people: 24850, hospitals: 1, roads: 3, shelters: 2 },
}

export const missions: Mission[] = [
  { id: 'M-024', teamId: 'T02', zoneId: 'Z03', status: 'en-route', etaMinutes: 18, route: ['R05', 'R07'], risk: 'safe', priority: 1 },
  { id: 'M-023', teamId: 'T07', zoneId: 'Z02', status: 'en-route', etaMinutes: 12, route: ['R03'], risk: 'elevated', priority: 2 },
  { id: 'M-022', teamId: 'T04', zoneId: 'Z01', status: 'busy', etaMinutes: 6, route: ['R02'], risk: 'warning', priority: 2 },
  { id: 'M-021', teamId: 'T09', zoneId: 'Z05', status: 'busy', etaMinutes: 9, route: ['R09'], risk: 'safe', priority: 3 },
  { id: 'M-020', teamId: 'T01', zoneId: 'Z02', status: 'available', etaMinutes: 0, route: [], risk: 'safe', priority: 4 },
]

export const optimizedResponse: OptimizedResponse = {
  mission: 'Deploy Team 02 to Zone Z03',
  route: ['R05', 'R07', 'Z03'],
  travelMinutes: 18,
  risk: 'safe',
  reason:
    'Route R05 is currently the safest available path while avoiding the projected flood expansion in the Lowland inundation zone.',
  teamId: 'T02',
  zoneId: 'Z03',
}

export const alerts: AlertEvent[] = [
  { id: 'A-1042', time: '12:42:18', timestamp: 1042, severity: 'critical', category: 'infrastructure', message: 'Bridge B01 structural risk increased to 82%', location: 'Sentinel River Crossing', source: 'Sensor SN04', status: 'active' },
  { id: 'A-1041', time: '12:41:52', timestamp: 1041, severity: 'warning', category: 'flood', message: 'River R01 rising at 0.12 m/min', location: 'North Valley', source: 'Sensor SN03', status: 'active' },
  { id: 'A-1040', time: '12:41:20', timestamp: 1040, severity: 'info', category: 'operations', message: 'Team 02 dispatched to Zone Z03', location: 'Command Center Alpha', source: 'Dispatch', status: 'acknowledged' },
  { id: 'A-1039', time: '12:40:55', timestamp: 1039, severity: 'warning', category: 'road', message: 'Road R05 accessibility reduced to 74%', location: 'Riverside Arterial', source: 'Sensor SN06', status: 'active' },
  { id: 'A-1038', time: '12:40:12', timestamp: 1038, severity: 'critical', category: 'flood', message: 'Flood zone FZ01 expanding toward Zone Z03', location: 'Lowland Village', source: 'Hydrology Model', status: 'escalated' },
  { id: 'A-1037', time: '12:39:40', timestamp: 1037, severity: 'elevated', category: 'medical', message: 'Hospital H02 occupancy at 92% capacity', location: 'Lowland Community Hospital', source: 'Health Ops', status: 'acknowledged' },
  { id: 'A-1036', time: '12:38:58', timestamp: 1036, severity: 'warning', category: 'infrastructure', message: 'Bridge B06 strain crossed warning threshold', location: 'Old Mill Footbridge', source: 'Sensor SN08', status: 'active' },
  { id: 'A-1035', time: '12:38:11', timestamp: 1035, severity: 'info', category: 'operations', message: 'Shelter S03 nearing capacity — 902/950', location: 'Lowland Relief Camp', source: 'Shelter Ops', status: 'acknowledged' },
  { id: 'A-1034', time: '12:37:33', timestamp: 1034, severity: 'warning', category: 'flood', message: 'Rainfall intensity 62 mm/hr over Lowland', location: 'Lowland Village', source: 'Sensor SN02', status: 'active' },
  { id: 'A-1033', time: '12:36:49', timestamp: 1033, severity: 'elevated', category: 'road', message: 'North Valley Road flow reduced to 63%', location: 'North Valley', source: 'Sensor SN18', status: 'resolved' },
]

export const copilotConversation: CopilotMessage[] = [
  { id: 'c1', role: 'commander', content: 'Which zone requires immediate attention?', timestamp: 1 },
  {
    id: 'c2',
    role: 'copilot',
    content:
      'Zone Z03 (Lowland Village) has the highest combined risk. It currently has 91% overall risk, 78% isolation probability, a 102-minute estimated isolation window, and 24,850 people potentially affected. Recommended action: deploy Team 02 through Route R05.',
    timestamp: 2,
  },
]

export const copilotSuggestions = [
  'Why is Z03 critical?',
  'Show safest route',
  'What happens if Bridge B01 fails?',
  'Prepare evacuation plan',
]

// Canned copilot responses keyed by intent for the mock assistant.
export const copilotResponses: Record<string, string> = {
  'why is z03 critical?':
    'Zone Z03 is critical because three risk drivers are compounding: the Sentinel River is at 7.8 m and rising 0.12 m/min, Bridge B01 (its primary access) has an 82% failure probability, and Road R05 accessibility has dropped to 74%. If B01 fails, Z03 loses its main connection and isolation probability rises from 78% to over 90%.',
  'show safest route':
    'The safest available path to Zone Z03 is R05 → R07, an 18-minute route that avoids the projected flood expansion in zone FZ01. If Bridge B01 fails, the recommended alternative becomes R07 only, adding roughly 9 minutes but keeping the corridor open.',
  'what happens if bridge b01 fails?':
    'If Bridge B01 fails: Road R05 closes, Zone Z03 access drops to a single corridor, the isolation window shortens from 145 to 102 minutes, and 24,850 people are affected. The recommended response shifts Team 02 to Route R07. I can run this as a full What-If simulation.',
  'prepare evacuation plan':
    'Draft evacuation plan for Zone Z03: (1) Route 24,850 residents via EV01 toward East Ridge Community Hall (310/800 occupancy). (2) Pre-position Teams 02 and 08 at the R07 junction. (3) Alert Hospital H03 to receive overflow from H02. (4) Stage buses at the Market Ground before Bridge B01 failure window closes.',
}
