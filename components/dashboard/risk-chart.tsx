"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { riskTrajectory } from "@/lib/mock-data";

const seriesConfig = [
  {
    key: "flood",
    label: "Flood Risk",
    color: "var(--color-chart-1)",
  },
  {
    key: "infrastructure",
    label: "Infrastructure Risk",
    color: "var(--color-chart-2)",
  },
  {
    key: "population",
    label: "Population Risk",
    color: "var(--color-chart-3)",
  },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-border bg-popover px-2.5 py-2 shadow-xl">
      <div className="mb-1 font-mono text-[11px] font-semibold text-foreground">
        {label}
      </div>

      {payload.map((p: any, index: number) => (
        <div
          key={`${p.dataKey}-${index}`}
          className="flex items-center gap-2 text-[11px]"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />

          <span className="capitalize text-muted-foreground">{p.dataKey}</span>

          <span className="ml-auto font-mono font-semibold text-foreground">
            {p.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function RiskChart({ compact = false }: { compact?: boolean }) {
  return (
    <Panel
      title="Risk Trajectory"
      subtitle="Past 60 min · Now · Next 60 min (predicted)"
      icon={<TrendingUp className="h-4 w-4" />}
      actions={
        <div className="hidden items-center gap-3 sm:flex">
          {seriesConfig.map((s) => (
            <span
              key={s.key}
              className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      }
    >
      <div className={compact ? "h-48" : "h-56"}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={riskTrajectory}
            margin={{
              top: 6,
              right: 8,
              left: -18,
              bottom: 0,
            }}
          >
            <defs>
              {seriesConfig.map((s) => (
                <linearGradient
                  key={s.key}
                  id={`grad-${s.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.25} />

                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />

            <ReferenceArea
              x1="NOW"
              x2="+60m"
              fill="var(--color-primary)"
              fillOpacity={0.05}
            />

            <ReferenceLine
              x="NOW"
              stroke="var(--color-primary)"
              strokeDasharray="4 3"
              label={{
                value: "PREDICTION",
                position: "insideTopRight",
                fill: "var(--color-primary)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />

            <XAxis
              dataKey="label"
              tick={{
                fontSize: 10,
                fill: "var(--color-muted-foreground)",
              }}
              tickLine={false}
              axisLine={{
                stroke: "var(--color-border)",
              }}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[0, 100]}
              tick={{
                fontSize: 10,
                fill: "var(--color-muted-foreground)",
              }}
              tickLine={false}
              axisLine={false}
              width={40}
            />

            <Tooltip content={<ChartTooltip />} />

            {seriesConfig.map((s) => (
              <Area
                key={`area-${s.key}`}
                type="monotone"
                dataKey={s.key}
                stroke="none"
                fill={`url(#grad-${s.key})`}
                isAnimationActive={false}
              />
            ))}

            {seriesConfig.map((s) => (
              <Line
                key={`line-${s.key}`}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Current Risk
          </div>

          <div className="font-mono text-lg font-bold text-critical">91%</div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Predicted Peak
          </div>

          <div className="font-mono text-lg font-bold text-critical">96%</div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Confidence
          </div>

          <div className="font-mono text-lg font-bold text-info">89%</div>
        </div>
      </div>
    </Panel>
  );
}
