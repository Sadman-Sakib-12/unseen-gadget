'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesData } from '@/features/dashboard/data';
import {
  Area,
  AreaChart,
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
            Revenue Overview
          </CardTitle>
          <p className="text-xs text-gray-500 mt-0.5">Monthly revenue trend</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenueOverview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1c2b6e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1c2b6e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '12px',
              }}
              formatter={(value: number) =>
                new Intl.NumberFormat('en-BD', {
                  style: 'currency',
                  currency: 'BDT',
                }).format(value)
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1c2b6e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenueOverview)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}