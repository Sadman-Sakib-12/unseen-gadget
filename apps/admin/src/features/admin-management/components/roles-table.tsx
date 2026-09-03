"use client";
import { Pencil, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TablePanel } from "@/components/ui/table-panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Role } from "@/features/admin-management/types";

interface RolesTableProps {
  data: Role[];
  onEdit?: (role: Role) => void;
}

const PERM_LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  pos: "POS",
  orders: "Orders",
  products: "Products",
  inventory: "Inventory",
  categories: "Categories",
  suppliers: "Suppliers",
  purchases: "Purchases",
  customers: "Customers",
  coupons: "Coupons",
  promotions: "Promotions",
  delivery: "Delivery",
  payments: "Payments",
  returns: "Returns",
  reviews: "Reviews",
  expenses: "Expenses",
  reports: "Reports",
  notifications: "Notifications",
  cms: "CMS",
  settings: "Settings",
  admin_management: "Admin Management",
};

export function RolesTable({ data, onEdit }: RolesTableProps) {
  return (
    <TablePanel title="Roles" count={data.length}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Section Access & Permissions</TableHead>
            {onEdit ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((role) => {
            const isFullAccess =
              role.name === "SUPER_ADMIN" ||
              role.permissions.includes("all") ||
              role.permissions.length >= 20;

            return (
              <TableRow key={role.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{role.id}</span>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-gray-900">{role.name}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5 max-w-xl">
                    {isFullAccess ? (
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        Full System & All Sections Access ({role.permissions.length}/21)
                      </Badge>
                    ) : (
                      role.permissions.map((p) => (
                        <Badge
                          key={p}
                          variant="secondary"
                          className="inline-flex items-center gap-1 text-[11px] font-medium"
                        >
                          <ShieldCheck className="h-3 w-3 text-primary" />
                          {PERM_LABEL_MAP[p.toLowerCase()] || p}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                {onEdit ? (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(role)}
                      aria-label={`Edit role ${role.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TablePanel>
  );
}