// Service layer for AEGISRESQ SENTINEL.
//
// Every function here returns a Promise so the mock implementation can later be
// swapped for real REST / WebSocket calls to the Python FastAPI backend without
// touching the UI. Replace the bodies with `fetch(API_BASE + ...)` when ready.

import {
  alerts,
  bridges,
  cascadeGraph,
  copilotResponses,
  evacuationRoutes,
  floodZones,
  forecast,
  forecastSeries,
  hospitals,
  missions,
  optimizedResponse,
  rescueTeams,
  riskTrajectory,
  rivers,
  roads,
  sensors,
  shelters,
  situationMetrics,
  zones,
} from './mock-data'
import type {
  AlertEvent,
  CopilotMessage,
  SimulationState,
} from './types'

// export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api'

const latency = (ms = 120) => new Promise((r) => setTimeout(r, ms))

export async function getSituationMetrics() {
  await latency()
  return situationMetrics
}

export async function getZones() {
  await latency()
  return zones
}

export async function getInfrastructure() {
  await latency()
  return { bridges, roads, hospitals, shelters }
}

export async function getMapData() {
  await latency()
  return { zones, bridges, roads, hospitals, shelters, rescueTeams, sensors, rivers, floodZones, evacuationRoutes }
}

export async function getRiskData() {
  await latency()
  return {
    trajectory: riskTrajectory,
    current: 91,
    predictedPeak: 96,
    confidence: 89,
  }
}

export async function getCascadeGraph() {
  await latency()
  return cascadeGraph
}

export async function getForecast() {
  await latency()
  return { steps: forecast, series: forecastSeries }
}

export async function getRescueTeams() {
  await latency()
  return rescueTeams
}

export async function getMissions() {
  await latency()
  return missions
}

export async function getRoutes() {
  await latency()
  return { roads, evacuationRoutes }
}

export async function getOptimizedResponse() {
  await latency()
  return optimizedResponse
}

export async function getAlerts() {
  await latency()
  return alerts
}

// Simulation: compute the post-failure state for a scenario.
export async function runSimulation(scenario: string): Promise<SimulationState> {
  await latency(400)
  // Deterministic mock result for the "Bridge B01 Failure" scenario.
  return {
    active: true,
    scenario,
    bridge: { id: 'B01', status: 'critical', label: 'FAILED' },
    road: { id: 'R05', open: false, label: 'CLOSED' },
    zone: { id: 'Z03', status: 'critical', label: 'HIGH RISK' },
    isolationMinutes: 102,
    peopleAtRisk: 24850,
    newRoute: ['R07', 'Z03'],
    teamId: 'T02',
  }
}

// Mock copilot — keyed intent matching with a sensible fallback.
export async function sendCopilotMessage(message: string): Promise<CopilotMessage> {
  await latency(600)
  const key = message.trim().toLowerCase()
  const matched =
    copilotResponses[key] ??
    Object.entries(copilotResponses).find(([k]) => key.includes(k.split(' ')[0]))?.[1]

  const content =
    matched ??
    `Based on current telemetry, Zone Z03 remains the highest priority with 91% overall risk and a 102-minute isolation window. Ask about a specific asset (e.g. "Bridge B01") or request an evacuation plan for a detailed decision-support breakdown.`

  return {
    id: `c-${Date.now()}`,
    role: 'copilot',
    content,
    timestamp: Date.now(),
  }
}

// Placeholder for the real-time alert stream (WebSocket in production).
export function subscribeToAlerts(onAlert: (a: AlertEvent) => void): () => void {
  // In production: const ws = new WebSocket(WS_URL); ws.onmessage = ...
  const pool: Omit<AlertEvent, 'id' | 'time' | 'timestamp'>[] = [
    { severity: 'warning', category: 'flood', message: 'River R01 level up 0.03 m in last minute', location: 'Sentinel River', source: 'Sensor SN01', status: 'active' },
    { severity: 'info', category: 'operations', message: 'Team 07 arrived at Zone Z02 staging point', location: 'Central Market', source: 'Dispatch', status: 'acknowledged' },
    { severity: 'elevated', category: 'road', message: 'Market Connector flow reduced to 76%', location: 'Market Connector', source: 'Sensor SN14', status: 'active' },
    { severity: 'critical', category: 'infrastructure', message: 'Bridge B06 strain rising toward critical', location: 'Old Mill Footbridge', source: 'Sensor SN08', status: 'active' },
  ]
  let i = 0
  const interval = setInterval(() => {
    const base = pool[i % pool.length]
    const now = new Date()
    const time = now.toTimeString().slice(0, 8)
    onAlert({
      ...base,
      id: `A-live-${now.getTime()}`,
      time,
      timestamp: now.getTime(),
    })
    i += 1
  }, 9000)
  return () => clearInterval(interval)
}
