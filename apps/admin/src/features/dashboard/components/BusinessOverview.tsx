'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chartAxis, chartColors, chartTooltip } from '@/lib/chart-theme';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SalesOverview } from '@/features/dashboard/types';

interface BusinessOverviewProps {
  className?: string;
  data: SalesOverview[];
}

export function BusinessOverview({ className, data }: BusinessOverviewProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">
              Business Overview
            </CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Revenue, Cost & Profit trend</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.28} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.amber} stopOpacity={0.22} />
                <stop offset="95%" stopColor={chartColors.amber} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.emerald} stopOpacity={0.22} />
                <stop offset="95%" stopColor={chartColors.emerald} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
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
              {...chartTooltip}
              formatter={(value: number) =>
                new Intl.NumberFormat('en-BD', {
                  style: 'currency',
                  currency: 'BDT',
                }).format(value)
              }
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={chartColors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke={chartColors.amber}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCost)"
              name="Cost"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke={chartColors.emerald}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
              name="Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
