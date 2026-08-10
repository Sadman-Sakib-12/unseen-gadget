"use client";
import { useState } from "react";
import { Role } from "@/features/admin-management/types";

interface RoleFormProps {
  role?: Role;
  onSave: (role: Role) => void;
  onCancel: () => void;
}

export function RoleForm({ role, onSave, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    id: role?.id || "ROLE-" + String(Date.now()).slice(-3),
    name: role?.name || "",
    permissions: role?.permissions || [],
  });
  const allPermissions = ["read", "write", "delete", "manage_users", "manage_settings", "manage_orders", "manage_products", "manage_reports"];
  const togglePermission = (perm: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(perm)
        ? formData.permissions.filter((p) => p !== perm)
        : [...formData.permissions, perm],
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Role);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">{role ? "Edit Role" : "Create Role"}</h3>
      <div>
        <label className="block text-sm font-medium mb-1">Role Name</label>
        <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Permissions</label>
        <div className="flex flex-wrap gap-2">
          {allPermissions.map((perm) => (
            <button
              key={perm}
              type="button"
              onClick={() => togglePermission(perm)}
              className={"rounded-full px-3 py-1 text-xs " + (formData.permissions.includes(perm) ? "bg-black text-white" : "bg-gray-100 text-gray-700")}
            >
              {perm}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Role</button>
      </div>
    </form>
  );
}
