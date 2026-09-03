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

export interface PermissionItem {
  id: string;
  label: string;
  desc?: string;
}

export interface PermissionGroup {
  name: string;
  permissions: PermissionItem[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: "General & Sales",
    permissions: [
      { id: "dashboard", label: "Dashboard" },
      { id: "pos", label: "POS (Sales Register)" },
      { id: "orders", label: "Orders Management" },
      { id: "notifications", label: "Notifications" },
    ],
  },
  {
    name: "Catalog & Stock",
    permissions: [
      { id: "products", label: "Products" },
      { id: "inventory", label: "Inventory & Stock" },
      { id: "categories", label: "Categories & Brands" },
    ],
  },
  {
    name: "Procurement & Customers",
    permissions: [
      { id: "suppliers", label: "Suppliers" },
      { id: "purchases", label: "Purchases" },
      { id: "customers", label: "Customers" },
    ],
  },
  {
    name: "Marketing & Operations",
    permissions: [
      { id: "coupons", label: "Coupons" },
      { id: "promotions", label: "Promotions" },
      { id: "delivery", label: "Delivery" },
      { id: "payments", label: "Payments" },
      { id: "returns", label: "Returns & Refunds" },
      { id: "reviews", label: "Reviews" },
    ],
  },
  {
    name: "Content, Finance & System",
    permissions: [
      { id: "cms", label: "CMS & Pages" },
      { id: "reports", label: "Reports" },
      { id: "expenses", label: "Expenses" },
      { id: "settings", label: "Settings" },
      { id: "admin_management", label: "Admin Management" },
    ],
  },
];

const ALL_SECTION_IDS = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.id));

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

  const selectAll = () => {
    setFormData({ ...formData, permissions: [...ALL_SECTION_IDS] });
  };

  const clearAll = () => {
    setFormData({ ...formData, permissions: [] });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = formData.id || `ROLE-${Date.now().toString().slice(-3)}`;
    onSave({ ...formData, id } as Role);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>{role ? "Edit Role & Section Access" : "Create Role & Section Access"}</DialogTitle>
        <DialogDescription>
          {role
            ? `Configure section access permissions for ${role.name}.`
            : "Create a new role and choose which sidebar sections this role can access."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="max-h-[80vh] overflow-y-auto custom-scrollbar">
        <form id="role-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Role Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              placeholder="e.g. ORDER_MANAGER"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Allowed Sections & Permissions ({formData.permissions.length}/{ALL_SECTION_IDS.length})
                </p>
                <p className="text-xs text-gray-500">Select which sections users with this role can view and access.</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={selectAll} className="h-7 text-xs">
                  Select All
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs text-gray-500">
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.name} className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    {group.name}
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {group.permissions.map((perm) => {
                      const isActive =
                        formData.permissions.includes(perm.id) ||
                        formData.permissions.includes(`manage_${perm.id}`) ||
                        formData.permissions.includes("all");
                      return (
                        <button
                          key={perm.id}
                          type="button"
                          onClick={() => togglePermission(perm.id)}
                          className={cn(
                            "flex items-center justify-between rounded-lg border p-2.5 text-left text-xs font-medium transition-all shadow-sm",
                            isActive
                              ? "border-primary bg-primary text-white shadow-primary/20"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          )}
                        >
                          <span className="truncate">{perm.label}</span>
                          <span
                            className={cn(
                              "ml-1.5 h-2 w-2 rounded-full shrink-0",
                              isActive ? "bg-white" : "bg-gray-300"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="role-form">
          {role ? "Update Role Access" : "Save Role"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}