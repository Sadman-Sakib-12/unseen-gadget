"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { salesData } from "@/features/dashboard/data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SalesOverviewProps {
  className?: string;
}

export function SalesOverview({ className }: SalesOverviewProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000000" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(value)} />
            <Area type="monotone" dataKey="revenue" stroke="#000000" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
