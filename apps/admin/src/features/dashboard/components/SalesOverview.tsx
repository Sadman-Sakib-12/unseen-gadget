'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesData } from '@/features/dashboard/data';
import { chartAxis, chartColors, chartGridStroke, chartTooltip } from '@/lib/chart-theme';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface SalesOverviewProps {
  className?: string;
}

export function SalesOverview({ className }: SalesOverviewProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            Orders Overview
          </CardTitle>
          <p className="mt-0.5 text-xs text-gray-500">Monthly order volume</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
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
              width={34}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              {...chartTooltip}
              formatter={(value: number, name: string) => [value, name]}
            />
            <Bar
              dataKey="orders"
              name="Orders"
              fill={chartColors.primary}
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}