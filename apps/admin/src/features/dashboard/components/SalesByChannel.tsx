"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { salesByChannelData } from "@/features/dashboard/data";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#000000", "#404040", "#737373", "#a3a3a3"];

interface SalesByChannelProps {
  className?: string;
}

export function SalesByChannel({ className }: SalesByChannelProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales by Channel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesByChannelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(value)} />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
              {salesByChannelData.map((entry, index) => (
                <Cell key={entry.channel} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
