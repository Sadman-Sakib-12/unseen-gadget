'use client';

import { Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProductStatusCardProps {
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  setStatus: (v: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK') => void;
  warranty: string;
  setWarranty: (v: string) => void;
  badge: string;
  setBadge: (v: string) => void;
}

export function ProductStatusCard({
  status,
  setStatus,
  warranty,
  setWarranty,
  badge,
  setBadge,
}: ProductStatusCardProps) {
  return (
    <Card className="border-gray-200 bg-white shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900">
          <Shield className="h-4 w-4 text-primary" />
          Status & Badges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Publication Status</label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { value: 'ACTIVE', label: 'Active (Visible on Storefront)' },
              { value: 'INACTIVE', label: 'Inactive (Hidden from Customers)' },
              { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Warranty Text</label>
          <Input
            value={warranty}
            onChange={(e) => setWarranty(e.target.value)}
            placeholder="e.g. 1 Year Official Apple Warranty"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Promo Badge Text</label>
          <Input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="e.g. New Arrival, Official, 10% OFF"
          />
        </div>
      </CardContent>
    </Card>
  );
}
