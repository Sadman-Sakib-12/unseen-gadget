'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Package, ShoppingCart, UserPlus, Truck, Receipt, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const iconMap: Record<string, React.ElementType> = {
  Package,
  ShoppingCart,
  UserPlus,
  Truck,
  Receipt,
  BarChart3,
};

const iconToneMap: Record<string, string> = {
  Package: 'bg-blue-50 text-blue-700',
  ShoppingCart: 'bg-primary/10 text-primary',
  UserPlus: 'bg-emerald-50 text-emerald-700',
  Truck: 'bg-amber-50 text-amber-700',
  Receipt: 'bg-gray-100 text-gray-700',
  BarChart3: 'bg-primary/10 text-primary',
};

const quickActions = [
  { id: '1', title: 'Add Product', description: 'Create a new product listing', href: '/products/new', icon: 'Package' },
  { id: '2', title: 'View Orders', description: 'Manage customer orders', href: '/orders', icon: 'ShoppingCart' },
  { id: '3', title: 'Add Customer', description: 'Register a new customer', href: '/customers', icon: 'UserPlus' },
  { id: '4', title: 'Deliveries', description: 'Track shipments and deliveries', href: '/delivery', icon: 'Truck' },
  { id: '5', title: 'Expenses', description: 'Track business expenses', href: '/expenses', icon: 'Receipt' },
  { id: '6', title: 'Reports', description: 'View sales and profit reports', href: '/reports', icon: 'BarChart3' },
];

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
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = iconMap[action.icon] ?? Package;
            return (
              <Link
                key={action.id}
                href={action.href}
                className="group flex flex-col rounded-xl border border-gray-200 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                <div
                  className={
                    'flex h-10 w-10 items-center justify-center rounded-xl ' +
                    (iconToneMap[action.icon] ?? 'bg-gray-100 text-gray-700')
                  }
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-3 text-sm font-semibold text-gray-900">
                  {action.title}
                </span>
                <span className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                  {action.description}
                </span>
                <span className="mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-primary group-hover:underline">
                  Open
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}