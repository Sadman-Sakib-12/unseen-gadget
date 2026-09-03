"use client";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
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
import { Select } from "@/components/ui/select";
import { cn } from "@/components/ui/utils";
import { PERMISSION_GROUPS } from "./role-form";
import type { Admin, Role } from "@/features/admin-management/types";

interface AdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  admin: Admin | null;
  roles: Role[];
  onSave: (admin: Admin) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function AdminForm({ isOpen, onClose, admin, roles, onSave }: AdminFormProps) {
  const currentRoleName =
    typeof admin?.role === "object" && admin?.role !== null
      ? (admin.role as { name?: string }).name ?? ""
      : typeof admin?.role === "string"
      ? admin.role
      : roles[0]?.name ?? "";

  const [formData, setFormData] = useState({
    id: admin?.id ?? "",
    name: admin?.name ?? "",
    email: admin?.email ?? "",
    password: "",
    role: currentRoleName,
    roleId:
      admin?.roleId ??
      (typeof admin?.role === "object" && admin.role !== null ? (admin.role as { id?: string })?.id : roles.find((r) => r.name === currentRoleName)?.id) ??
      "",
    status: admin?.status ? admin.status.toLowerCase() : "active",
    lastLogin: admin?.lastLogin ?? "",
  });

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const selectedRole = roles.find((r) => r.name === formData.role || r.id === formData.roleId) || roles[0];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const matchedRole = roles.find((r) => r.name === formData.role || r.id === formData.roleId) || roles[0];
    const payload: Admin = {
      id: formData.id || `ADMIN-${Date.now().toString().slice(-3)}`,
      name: formData.name,
      email: formData.email,
      roleId: matchedRole?.id,
      role: matchedRole?.name || formData.role,
      status: formData.status.toUpperCase(),
      lastLogin: formData.lastLogin,
      ...(formData.password ? { password: formData.password } : {}),
    };
    onSave(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>{admin ? "Edit Admin" : "Create Admin"}</DialogTitle>
        <DialogDescription>
          {admin
            ? `Update the details and permissions for ${admin.name}.`
            : "Create a new admin user and assign their role."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="max-h-[85vh] overflow-y-auto custom-scrollbar">
        <form id="admin-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="e.g. Rahim Uddin"
                required
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="e.g. rahim@unseengadget.com"
                required
              />
            </Field>
            <Field label={admin ? "New Password (Optional)" : "Password (Min 8 characters)"}>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => update({ password: e.target.value })}
                placeholder={admin ? "Leave blank to keep current password" : "••••••••"}
                required={!admin}
                minLength={admin ? undefined : 8}
              />
            </Field>
            <Field label="Role">
              <Select
                value={formData.role}
                onChange={(e) => {
                  const roleObj = roles.find((r) => r.name === e.target.value);
                  update({ role: e.target.value, roleId: roleObj?.id });
                }}
                options={roles.map((r) => ({ value: r.name, label: r.name }))}
              />
            </Field>
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(e) => update({ status: e.target.value })}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </Field>

            <div className="sm:col-span-2 space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  Sidebar Sections Allowed for &quot;{selectedRole?.name || formData.role}&quot;
                </p>
                <span className="text-[11px] text-gray-500">
                  Manage in <strong className="text-gray-700">Roles Tab</strong>
                </span>
              </div>

              <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 max-h-56 overflow-y-auto custom-scrollbar">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.name} className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {group.name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.permissions.map((perm) => {
                        const isGranted =
                          selectedRole?.permissions?.includes("all") ||
                          selectedRole?.permissions?.includes("*") ||
                          selectedRole?.permissions?.includes(perm.id) ||
                          selectedRole?.permissions?.includes(`manage_${perm.id}`) ||
                          (formData.role === "SUPER_ADMIN");

                        return (
                          <span
                            key={perm.id}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                              isGranted
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                                : "bg-gray-100 text-gray-400 border border-gray-200 line-through opacity-50"
                            )}
                          >
                            <ShieldCheck className={cn("h-3.5 w-3.5", isGranted ? "text-emerald-600" : "text-gray-300")} />
                            {perm.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="admin-form">
          {admin ? "Update Admin" : "Save Admin"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}