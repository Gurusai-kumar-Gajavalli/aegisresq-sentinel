import { SEVERITY_COLOR } from '@/lib/severity'

const items = [
  { label: 'Critical', color: SEVERITY_COLOR.critical, kind: 'dot' },
  { label: 'Warning', color: SEVERITY_COLOR.warning, kind: 'dot' },
  { label: 'Safe', color: SEVERITY_COLOR.safe, kind: 'dot' },
  { label: 'Flood zone', color: SEVERITY_COLOR.critical, kind: 'fill' },
  { label: 'Rescue team', color: '#3b82f6', kind: 'circle' },
  { label: 'Shelter', color: SEVERITY_COLOR.elevated, kind: 'square' },
  { label: 'Hospital', color: SEVERITY_COLOR.safe, kind: 'square' },
] as const

export function MapLegend() {
  return (
    <div className="rounded-md border border-border bg-card/90 p-2.5 backdrop-blur-sm">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Legend
      </p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-1.5 text-[11px] text-foreground">
            {it.kind === 'dot' && (
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: it.color }} />
            )}
            {it.kind === 'circle' && (
              <span
                className="h-2.5 w-2.5 rounded-full border-2"
                style={{ borderColor: it.color, background: 'transparent' }}
              />
            )}
            {it.kind === 'square' && (
              <span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: it.color }} />
            )}
            {it.kind === 'fill' && (
              <span
                className="h-2.5 w-3.5 rounded-[2px] border"
                style={{ backgroundColor: `${it.color}44`, borderColor: it.color }}
              />
            )}
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
