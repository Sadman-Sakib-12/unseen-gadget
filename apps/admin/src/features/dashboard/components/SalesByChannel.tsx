'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesByChannelData } from '@/features/dashboard/data';
import { chartAxis, chartGridStroke, chartPalette, chartTooltip } from '@/lib/chart-theme';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CHANNEL_COLORS = chartPalette.slice(0, 4);

interface SalesByChannelProps {
  className?: string;
}

export function SalesByChannel({ className }: SalesByChannelProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            Sales by Channel
          </CardTitle>
          <p className="mt-0.5 text-xs text-gray-500">Revenue breakdown per channel</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={salesByChannelData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
            <XAxis
              dataKey="channel"
              tick={{ fontSize: chartAxis.fontSize, fill: chartAxis.tickFill }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: chartAxis.fontSize, fill: chartAxis.tickFill }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              {...chartTooltip}
              formatter={(value: number) =>
                new Intl.NumberFormat('en-BD', {
                  style: 'currency',
                  currency: 'BDT',
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {salesByChannelData.map((entry, index) => (
                <Cell
                  key={entry.channel}
                  fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-gray-100 pt-4">
          {salesByChannelData.map((entry, index) => (
            <div key={entry.channel} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CHANNEL_COLORS[index % CHANNEL_COLORS.length] }}
                />
                <span className="truncate">{entry.channel}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                {entry.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}