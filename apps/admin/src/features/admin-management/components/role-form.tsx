"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import type { Role } from "@/features/admin-management/types";

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (role: Role) => void;
}

const ALL_PERMISSIONS = [
  "read",
  "write",
  "delete",
  "manage_users",
  "manage_settings",
  "manage_orders",
  "manage_products",
  "manage_reports",
];

export function RoleForm({ isOpen, onClose, role, onSave }: RoleFormProps) {
  const [formData, setFormData] = useState({
    id: role?.id ?? "",
    name: role?.name ?? "",
    permissions: role?.permissions ?? [],
  });

  const togglePermission = (perm: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(perm)
        ? formData.permissions.filter((p) => p !== perm)
        : [...formData.permissions, perm],
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = formData.id || `ROLE-${Date.now().toString().slice(-3)}`;
    onSave({ ...formData, id } as Role);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
        <DialogDescription>
          {role
            ? `Update the details for ${role.name}.`
            : "Create a new role and assign permissions."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <form id="role-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              placeholder="e.g. MANAGER"
              required
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Permissions</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_PERMISSIONS.map((perm) => {
                const isActive = formData.permissions.includes(perm);
                return (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => togglePermission(perm)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {perm}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="role-form">
          {role ? "Update Role" : "Save Role"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}