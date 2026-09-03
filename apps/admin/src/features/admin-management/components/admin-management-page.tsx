"use client";
import { useState, useEffect } from "react";
import { Plus, ShieldPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { AdminsTable } from "./admins-table";
import { RolesTable } from "./roles-table";
import { AdminForm } from "./admin-form";
import { RoleForm } from "./role-form";
import { api } from "@/lib/api";
import type { Admin, Role } from "@/features/admin-management/types";

export function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    Promise.all([
      api.admins.list().then((res) => setAdmins((res.data as Admin[]) ?? [])),
      api.roles.list().then((res) => setRoles((res.data as Role[]) ?? [])),
    ])
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveAdmin = async (admin: Admin) => {
    try {
      const payload: {
        name: string;
        email: string;
        roleId?: string;
        status: string;
        password?: string;
      } = {
        name: admin.name,
        email: admin.email,
        roleId:
          admin.roleId ||
          (typeof admin.role === "object" && admin.role !== null
            ? (admin.role as { id?: string })?.id
            : roles.find((r) => r.name === admin.role)?.id) ||
          roles[0]?.id,
        status: (admin.status || "ACTIVE").toUpperCase(),
        ...(admin.password ? { password: admin.password } : {}),
      };

      if (editingAdmin) {
        const res = await api.admins.update(admin.id, payload);
        const updated = res.data as Admin;
        setAdmins((prev) => prev.map((a) => (a.id === admin.id ? updated : a)));
      } else {
        const res = await api.admins.create(payload);
        const created = res.data as Admin;
        setAdmins((prev) => [...prev, created]);
      }
      setShowAdminForm(false);
      setEditingAdmin(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to save admin");
    }
  };

  const handleSaveRole = async () => {
    try {
      if (!editingRole) return;
      const res = editingRole.id
        ? await api.roles.update(editingRole.id, editingRole)
        : await api.roles.create(editingRole);
      const saved = res.data as Role;
      if (editingRole.id) {
        setRoles((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
      } else {
        setRoles((prev) => [...prev, saved]);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to save role");
    }
    setShowRoleForm(false);
    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Management"
        description="Manage admin users and roles"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditingRole(null);
                setShowRoleForm(true);
              }}
            >
              <ShieldPlus className="h-4 w-4" />
              Add Role
            </Button>
            <Button
              onClick={() => {
                setEditingAdmin(null);
                setShowAdminForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Admin
            </Button>
          </>
        }
      />
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
      <Tabs defaultValue="admins">
        <TabsList>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="admins" className="mt-4">
          <AdminsTable
            data={admins}
            onEdit={(admin) => {
              setEditingAdmin(admin);
              setShowAdminForm(true);
            }}
          />
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <RolesTable
            data={roles}
            onEdit={(role) => {
              setEditingRole(role);
              setShowRoleForm(true);
            }}
          />
        </TabsContent>
      </Tabs>
      )}

      <AdminForm
        key={editingAdmin ? editingAdmin.id : "new-admin"}
        isOpen={showAdminForm}
        onClose={() => {
          setShowAdminForm(false);
          setEditingAdmin(null);
        }}
        admin={editingAdmin}
        roles={roles}
        onSave={handleSaveAdmin}
      />

      <RoleForm
        key={editingRole ? editingRole.id : "new-role"}
        isOpen={showRoleForm}
        onClose={() => {
          setShowRoleForm(false);
          setEditingRole(null);
        }}
        role={editingRole}
        onSave={handleSaveRole}
      />
    </div>
  );
}