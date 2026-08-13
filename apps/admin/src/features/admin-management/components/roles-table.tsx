"use client";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Role } from "@/features/admin-management/types";

export function RolesTable({ data }: { data: Role[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 p-4">
        <p className="text-sm font-medium text-gray-900">
          Roles <span className="text-gray-400">({data.length})</span>
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Permissions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <span className="font-mono text-xs text-gray-500">{role.id}</span>
              </TableCell>
              <TableCell>
                <p className="font-medium text-gray-900">{role.name}</p>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((p) => (
                    <Badge
                      key={p}
                      variant="secondary"
                      className="inline-flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {p}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}