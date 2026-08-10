"use client";
import { useState } from "react";
import { Admin } from "@/features/admin-management/types";
import { Role } from "@/features/admin-management/types";

interface AdminFormProps {
  admin?: Admin;
  roles: Role[];
  onSave: (admin: Admin) => void;
  onCancel: () => void;
}

export function AdminForm({ admin, roles, onSave, onCancel }: AdminFormProps) {
  const [formData, setFormData] = useState({
    id: admin?.id || "ADMIN-" + String(Date.now()).slice(-3),
    name: admin?.name || "",
    email: admin?.email || "",
    role: admin?.role || roles[0]?.name || "",
    permissions: admin?.permissions || [],
    status: admin?.status || "active",
    lastLogin: admin?.lastLogin || "",
  });

  const selectedRole = roles.find((r) => r.name === formData.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Admin);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">{admin ? "Edit Admin" : "Create Admin"}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Permissions</label>
          <div className="flex flex-wrap gap-2">
            {selectedRole?.permissions.map((p) => (
              <span key={p} className="rounded-full bg-gray-100 px-3 py-1 text-xs">{p}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Admin</button>
      </div>
    </form>
  );
}
