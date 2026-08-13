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
  const [formData, setFormData] = useState({
    id: admin?.id ?? "",
    name: admin?.name ?? "",
    email: admin?.email ?? "",
    role: admin?.role ?? roles[0]?.name ?? "",
    permissions: admin?.permissions ?? [],
    status: admin?.status ?? "active",
    lastLogin: admin?.lastLogin ?? "",
  });

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const selectedRole = roles.find((r) => r.name === formData.role);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = formData.id || `ADMIN-${Date.now().toString().slice(-3)}`;
    onSave({ ...formData, id } as Admin);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>{admin ? "Edit Admin" : "Create Admin"}</DialogTitle>
        <DialogDescription>
          {admin
            ? `Update the details for ${admin.name}.`
            : "Create a new admin user to manage the store."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
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
            <Field label="Role">
              <Select
                value={formData.role}
                onChange={(e) => update({ role: e.target.value })}
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
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-gray-700">Permissions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedRole?.permissions.length ? (
                  selectedRole.permissions.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
                      {p}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No permissions assigned to this role.</p>
                )}
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