'use client'

import { useMemo } from 'react'
import { SEVERITY_COLOR } from '@/lib/severity'
import type { CascadeGraph as CascadeGraphData, CascadeNode } from '@/lib/types'

interface CascadeGraphProps {
  graph: CascadeGraphData
  height?: number
  selectedId?: string | null
  onSelect?: (node: CascadeNode) => void
}

// Renders the dependency network as a proportional SVG using normalized
// node coordinates (0–1). Not a hand-drawn map — a schematic graph.
export function CascadeGraph({ graph, height = 220, selectedId, onSelect }: CascadeGraphProps) {
  const W = 1000
  const H = 400

  const nodeById = useMemo(
    () => Object.fromEntries(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes],
  )

  const isCriticalEdge = (from: string, to: string) => {
    const path = graph.criticalPath
    const i = path.indexOf(from)
    return i !== -1 && path[i + 1] === to
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height }}
      role="img"
      aria-label="Cascading dependency network graph"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-muted-foreground)" />
        </marker>
        <marker id="arrow-crit" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={SEVERITY_COLOR.critical} />
        </marker>
      </defs>

      {/* Edges */}
      {graph.edges.map((e) => {
        const from = nodeById[e.from]
        const to = nodeById[e.to]
        if (!from || !to) return null
        const x1 = from.x * W
        const y1 = from.y * H
        const x2 = to.x * W
        const y2 = to.y * H
        const crit = e.critical || isCriticalEdge(e.from, e.to)
        return (
          <line
            key={`${e.from}-${e.to}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={crit ? SEVERITY_COLOR.critical : 'var(--color-border)'}
            strokeWidth={crit ? 3 : 2}
            strokeDasharray={crit ? undefined : '5 4'}
            markerEnd={crit ? 'url(#arrow-crit)' : 'url(#arrow)'}
            opacity={crit ? 0.9 : 0.6}
          />
        )
      })}

      {/* Nodes */}
      {graph.nodes.map((n) => {
        const cx = n.x * W
        const cy = n.y * H
        const color = SEVERITY_COLOR[n.status]
        const selected = selectedId === n.id
        const onCritical = graph.criticalPath.includes(n.id)
        return (
          <g
            key={n.id}
            transform={`translate(${cx}, ${cy})`}
            onClick={() => onSelect?.(n)}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}
          >
            {onCritical && (
              <circle r={30} fill="none" stroke={color} strokeWidth={1} opacity={0.35}>
                <animate attributeName="r" from="26" to="34" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              r={24}
              fill="var(--color-card)"
              stroke={color}
              strokeWidth={selected ? 4 : 2.5}
            />
            <circle r={7} fill={color} />
            <text
              y={44}
              textAnchor="middle"
              fill="var(--color-foreground)"
              fontSize={20}
              fontWeight={600}
              fontFamily="var(--font-mono)"
            >
              {n.label}
            </text>
            <text y={64} textAnchor="middle" fill={color} fontSize={18} fontFamily="var(--font-mono)">
              {n.risk}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}
