"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { salesTrendData } from "@/features/dashboard/data";
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SalesTrendProps {
  className?: string;
}

export function SalesTrend({ className }: SalesTrendProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={salesTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(value)} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#000000" strokeWidth={2} name="Sales" />
            <Line type="monotone" dataKey="orders" stroke="#737373" strokeWidth={2} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
