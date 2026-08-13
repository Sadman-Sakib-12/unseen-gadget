'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesTrendData } from '@/features/dashboard/data';
import { chartAxis, chartColors, chartTooltip } from '@/lib/chart-theme';
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface SalesTrendProps {
  className?: string;
}

export function SalesTrend({ className }: SalesTrendProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            Sales Trend
          </CardTitle>
          <p className="text-xs text-gray-500 mt-0.5">Monthly sales vs orders comparison</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesTrendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
            <Line
              type="monotone"
              dataKey="sales"
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={{ r: 3, fill: chartColors.primary, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              name="Sales"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke={chartColors.amber}
              strokeWidth={2}
              dot={{ r: 3, fill: chartColors.amber, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}