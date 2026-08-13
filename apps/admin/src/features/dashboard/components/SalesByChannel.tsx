'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesByChannelData } from '@/features/dashboard/data';
import { chartAxis, chartColors, chartTooltip } from '@/lib/chart-theme';
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

const CHANNEL_COLORS = [
  chartColors.primary,
  '#4152b8',
  '#6b7ee6',
  chartColors.emerald,
];

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
          <p className="text-xs text-gray-500 mt-0.5">Revenue breakdown per channel</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={salesByChannelData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
      </CardContent>
    </Card>
  );
}