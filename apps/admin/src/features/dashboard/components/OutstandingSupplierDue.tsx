"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supplierDues } from "@/features/dashboard/data";
import { getStatusBadgeVariant } from "@/lib/load-dashboard-data";

interface OutstandingSupplierDueProps {
  className?: string;
}

export function OutstandingSupplierDue({ className }: OutstandingSupplierDueProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Outstanding Supplier Dues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {supplierDues.map((due) => (
            <div key={due.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{due.supplierName}</p>
                <p className="text-xs text-gray-500">Due: {due.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(due.amount)}</p>
                <Badge variant={getStatusBadgeVariant(due.status) as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"}>{due.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
