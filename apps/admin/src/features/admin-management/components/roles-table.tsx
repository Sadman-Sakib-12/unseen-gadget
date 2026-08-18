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

export function RolesTable({ data, onEdit }: RolesTableProps) {
  return (
    <TablePanel title="Roles" count={data.length}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Permissions</TableHead>
            {onEdit ? <TableHead className="text-right">Actions</TableHead> : null}
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
          ))}
        </TableBody>
      </Table>
    </TablePanel>
  );
}