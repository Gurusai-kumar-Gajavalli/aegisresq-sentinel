'use client'

import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import {
  bridges,
  evacuationRoutes,
  floodZones,
  hospitals,
  REGION_CENTER,
  rescueTeams,
  rivers,
  roads,
  shelters,
  zones,
} from '@/lib/mock-data'
import { SEVERITY_COLOR } from '@/lib/severity'
import type { LngLat } from '@/lib/types'
import { MapLegend } from './map-legend'
import { Crosshair, Layers, Maximize2, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type LayerKey =
  | 'flood'
  | 'rivers'
  | 'roads'
  | 'bridges'
  | 'hospitals'
  | 'shelters'
  | 'teams'
  | 'evac'

const LAYER_LABELS: Record<LayerKey, string> = {
  flood: 'Flood zones',
  rivers: 'Rivers',
  roads: 'Roads',
  bridges: 'Bridges',
  hospitals: 'Hospitals',
  shelters: 'Shelters',
  teams: 'Rescue teams',
  evac: 'Evacuation routes',
}

const coords = (p: LngLat): [number, number] => [p.lng, p.lat]

// Minimal dark raster style — no token required (MapLibre + Carto dark tiles).
const darkStyle: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    carto: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap © CARTO',
    },
  },
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': '#0b1220' } },
    { id: 'carto', type: 'raster', source: 'carto', paint: { 'raster-opacity': 0.85 } },
  ],
}

export function DisasterMap({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [ready, setReady] = useState(false)
  const [layersOpen, setLayersOpen] = useState(false)
  const [visible, setVisible] = useState<Record<LayerKey, boolean>>({
    flood: true,
    rivers: true,
    roads: true,
    bridges: true,
    hospitals: true,
    shelters: true,
    teams: true,
    evac: true,
  })

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: darkStyle,
      center: coords(REGION_CENTER),
      zoom: 12.4,
      attributionControl: false,
    })
    mapRef.current = map

    map.on('load', () => {
      // ---- Flood zones (polygons) ----
      map.addSource('flood', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: floodZones.map((fz) => ({
            type: 'Feature',
            properties: { color: SEVERITY_COLOR[fz.severity], name: fz.name },
            geometry: {
              type: 'Polygon',
              coordinates: [[...fz.polygon.map(coords), coords(fz.polygon[0])]],
            },
          })),
        },
      })
      map.addLayer({
        id: 'flood-fill',
        type: 'fill',
        source: 'flood',
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.22 },
      })
      map.addLayer({
        id: 'flood-line',
        type: 'line',
        source: 'flood',
        paint: { 'line-color': ['get', 'color'], 'line-width': 1.5, 'line-dasharray': [2, 1] },
      })

      // ---- Rivers ----
      map.addSource('rivers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: rivers.map((r) => ({
            type: 'Feature',
            properties: { name: r.name },
            geometry: { type: 'LineString', coordinates: r.path.map(coords) },
          })),
        },
      })
      map.addLayer({
        id: 'rivers-line',
        type: 'line',
        source: 'rivers',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': 0.7 },
      })

      // ---- Roads ----
      map.addSource('roads', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: roads.map((r) => ({
            type: 'Feature',
            properties: { color: SEVERITY_COLOR[r.status], name: r.name, id: r.id },
            geometry: { type: 'LineString', coordinates: r.path.map(coords) },
          })),
        },
      })
      map.addLayer({
        id: 'roads-line',
        type: 'line',
        source: 'roads',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 3 },
      })

      // ---- Evacuation routes ----
      map.addSource('evac', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: evacuationRoutes.map((e) => ({
            type: 'Feature',
            properties: { color: SEVERITY_COLOR[e.status], name: e.label },
            geometry: { type: 'LineString', coordinates: e.path.map(coords) },
          })),
        },
      })
      map.addLayer({
        id: 'evac-line',
        type: 'line',
        source: 'evac',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2.5,
          'line-dasharray': [1.5, 1],
        },
      })

      map.on('click', 'roads-line', (e) => {
        const f = e.features?.[0]
        if (!f) return
        const p = f.properties as { name: string; id: string }
        new maplibregl.Popup({ offset: 12 })
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="padding:10px 12px"><div style="font-size:11px;color:#93a1b3">${p.id}</div><div style="font-weight:600;font-size:13px">${p.name}</div></div>`,
          )
          .addTo(map)
      })
      map.on('mouseenter', 'roads-line', () => (map.getCanvas().style.cursor = 'pointer'))
      map.on('mouseleave', 'roads-line', () => (map.getCanvas().style.cursor = ''))

      setReady(true)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // HTML markers (created once map is ready)
  const markersRef = useRef<maplibregl.Marker[]>([])
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const addMarker = (
      lngLat: LngLat,
      html: string,
      popupHtml: string,
      layer: LayerKey,
    ) => {
      const el = document.createElement('div')
      el.innerHTML = html
      el.style.cursor = 'pointer'
      el.dataset.layer = layer
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(coords(lngLat))
        .setPopup(new maplibregl.Popup({ offset: 16 }).setHTML(popupHtml))
        .addTo(map)
      markersRef.current.push(marker)
    }

    const pin = (color: string, glyph: string, ring = false) =>
      `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;background:${color};color:#0b1220;font-size:11px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.5);${ring ? `outline:2px solid ${color};outline-offset:2px;` : ''}">${glyph}</div>`

    // Bridges
    bridges.forEach((b) => {
      addMarker(
        b.location,
        pin(SEVERITY_COLOR[b.status], '╫', b.status === 'critical'),
        `<div style="padding:12px;min-width:190px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-weight:700;font-size:13px">Bridge ${b.id}</span>
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;color:${SEVERITY_COLOR[b.status]}">${b.status}</span>
          </div>
          <div style="font-size:11px;color:#93a1b3;margin-bottom:8px">${b.name}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">
            <div><div style="color:#93a1b3">Structural Risk</div><div style="font-weight:700;font-size:13px">${b.structuralRisk}%</div></div>
            <div><div style="color:#93a1b3">Failure Prob.</div><div style="font-weight:700;font-size:13px">${b.failureProbability}%</div></div>
            <div><div style="color:#93a1b3">River Level</div><div style="font-weight:700;font-size:13px">${b.riverLevel} m</div></div>
            <div><div style="color:#93a1b3">Status</div><div style="font-weight:700;font-size:13px;color:${SEVERITY_COLOR[b.status]}">${b.status.toUpperCase()}</div></div>
          </div>
        </div>`,
        'bridges',
      )
    })

    // Hospitals
    hospitals.forEach((h) => {
      addMarker(
        h.location,
        pin(SEVERITY_COLOR[h.status], '✚'),
        `<div style="padding:12px;min-width:170px">
          <div style="font-weight:700;font-size:13px">${h.id} · Hospital</div>
          <div style="font-size:11px;color:#93a1b3;margin-bottom:6px">${h.name}</div>
          <div style="font-size:11px">Occupancy: <b>${h.occupancy}/${h.capacity}</b></div>
          <div style="font-size:11px">Risk: <b style="color:${SEVERITY_COLOR[h.status]}">${h.risk}%</b></div>
        </div>`,
        'hospitals',
      )
    })

    // Shelters
    shelters.forEach((s) => {
      addMarker(
        s.location,
        pin(SEVERITY_COLOR[s.status], '⌂'),
        `<div style="padding:12px;min-width:170px">
          <div style="font-weight:700;font-size:13px">${s.id} · Shelter</div>
          <div style="font-size:11px;color:#93a1b3;margin-bottom:6px">${s.name}</div>
          <div style="font-size:11px">Occupancy: <b>${s.occupancy}/${s.capacity}</b></div>
        </div>`,
        'shelters',
      )
    })

    // Rescue teams
    rescueTeams
      .filter((t) => ['en-route', 'busy'].includes(t.status) || t.id === 'T02')
      .forEach((t) => {
        const dest = t.destinationZoneId ? `Destination: Zone ${t.destinationZoneId}` : ''
        const eta = t.etaMinutes ? `ETA: ${t.etaMinutes} min` : ''
        addMarker(
          t.location,
          `<div style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#3b82f6;color:#fff;font-size:10px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.5);border:2px solid #0b1220">${t.id.replace('T', '')}</div>`,
          `<div style="padding:12px;min-width:170px">
            <div style="font-weight:700;font-size:13px">${t.name}</div>
            <div style="font-size:11px;margin-top:4px">Status: <b style="text-transform:uppercase">${t.status.replace('-', ' ')}</b></div>
            ${dest ? `<div style="font-size:11px">${dest}</div>` : ''}
            ${eta ? `<div style="font-size:11px">${eta}</div>` : ''}
          </div>`,
          'teams',
        )
      })

    // Zone centroids (label markers)
    zones.forEach((z) => {
      addMarker(
        z.center,
        `<div style="padding:2px 6px;border-radius:4px;background:rgba(11,18,32,.8);border:1px solid ${SEVERITY_COLOR[z.status]};color:${SEVERITY_COLOR[z.status]};font-size:10px;font-weight:700;white-space:nowrap">${z.id} · ${z.risk}%</div>`,
        `<div style="padding:12px;min-width:170px">
          <div style="font-weight:700;font-size:13px">${z.id} · ${z.name}</div>
          <div style="font-size:11px;color:#93a1b3">Population: ${z.population.toLocaleString()}</div>
          <div style="font-size:11px;margin-top:4px">Overall risk: <b style="color:${SEVERITY_COLOR[z.status]}">${z.risk}%</b></div>
          <div style="font-size:11px">Isolation prob.: <b>${z.isolationProbability}%</b></div>
        </div>`,
        'flood',
      )
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
    }
  }, [ready])

  // Toggle layer visibility
  const toggleLayer = (key: LayerKey) => {
    const map = mapRef.current
    if (!map) return
    const next = !visible[key]
    setVisible((v) => ({ ...v, [key]: next }))
    const vis = next ? 'visible' : 'none'
    const layerMap: Record<LayerKey, string[]> = {
      flood: ['flood-fill', 'flood-line'],
      rivers: ['rivers-line'],
      roads: ['roads-line'],
      bridges: [],
      hospitals: [],
      shelters: [],
      teams: [],
      evac: ['evac-line'],
    }
    layerMap[key].forEach((id) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', vis)
    })
    // HTML markers
    markersRef.current.forEach((m) => {
      const el = m.getElement()
      if (el.dataset.layer === key) el.style.display = next ? '' : 'none'
    })
  }

  const zoomIn = () => mapRef.current?.zoomIn()
  const zoomOut = () => mapRef.current?.zoomOut()
  const recenter = () =>
    mapRef.current?.flyTo({ center: coords(REGION_CENTER), zoom: 12.4 })
  const fullscreen = () => {
    const el = containerRef.current?.parentElement
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen?.()
  }

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <div ref={containerRef} className="absolute inset-0" />

      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading tactical map…
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
        <div className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
          <button onClick={zoomIn} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Zoom in">
            <Plus className="h-4 w-4" />
          </button>
          <button onClick={zoomOut} className="flex h-8 w-8 items-center justify-center border-t border-border text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Zoom out">
            <Minus className="h-4 w-4" />
          </button>
        </div>
        <button onClick={recenter} className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Locate region">
          <Crosshair className="h-4 w-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => setLayersOpen((o) => !o)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
              layersOpen && 'border-primary/50 text-primary',
            )}
            aria-label="Toggle layers"
            aria-expanded={layersOpen}
          >
            <Layers className="h-4 w-4" />
          </button>
          {layersOpen && (
            <div className="absolute right-9 top-0 w-44 rounded-md border border-border bg-popover p-1.5 shadow-xl">
              <p className="px-1.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Layers
              </p>
              {(Object.keys(LAYER_LABELS) as LayerKey[]).map((k) => (
                <label
                  key={k}
                  className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[12px] text-foreground hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={visible[k]}
                    onChange={() => toggleLayer(k)}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  {LAYER_LABELS[k]}
                </label>
              ))}
            </div>
          )}
        </div>
        <button onClick={fullscreen} className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Fullscreen">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10">
        <MapLegend />
      </div>
    </div>
  )
}
