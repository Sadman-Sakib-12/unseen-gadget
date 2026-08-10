"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quickActions } from "@/features/dashboard/data";
import { Package, ShoppingCart, UserPlus, Truck, Receipt, BarChart3 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Package,
  ShoppingCart,
  UserPlus,
  Truck,
  Receipt,
  BarChart3,
};

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => {
            const Icon = iconMap[action.icon] || Package;
            return (
              <Link
                key={action.id}
                href={action.href}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <Icon className="h-8 w-8 mb-2 text-gray-700" />
                <span className="text-sm font-medium text-center">{action.title}</span>
                <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
