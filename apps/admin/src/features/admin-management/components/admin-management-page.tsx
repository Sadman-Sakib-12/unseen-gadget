"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { AdminsTable } from "@/features/admin-management/components/admins-table";
import { RolesTable } from "@/features/admin-management/components/roles-table";
import { AdminForm } from "@/features/admin-management/components/admin-form";
import { RoleForm } from "@/features/admin-management/components/role-form";
import initialAdmins from "@/features/admin-management/data/admins.json";
import initialRoles from "@/features/admin-management/data/roles.json";
import { Admin, Role } from "@/features/admin-management/types";

export function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [roles] = useState<Role[]>(initialRoles);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | undefined>(undefined);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

  const handleSaveAdmin = (admin: Admin) => {
    if (editingAdmin) {
      setAdmins(admins.map((a) => (a.id === admin.id ? admin : a)));
    } else {
      setAdmins([...admins, admin]);
    }
    setShowAdminForm(false);
    setEditingAdmin(undefined);
  };

  const handleSaveRole = (_role: Role) => {
    if (editingRole) {
      setShowRoleForm(false);
      setEditingRole(undefined);
    } else {
      setShowRoleForm(false);
      setEditingRole(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
        <p className="text-gray-500">Manage admin users and roles</p>
      </div>
      <Tabs defaultValue="admins">
        <TabsList>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="admins" className="mt-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { setEditingAdmin(undefined); setShowAdminForm(true); }}
              className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Plus size={16} />
              Add Admin
            </button>
          </div>
          {showAdminForm && (
            <AdminForm
              admin={editingAdmin}
              roles={roles}
              onSave={handleSaveAdmin}
              onCancel={() => { setShowAdminForm(false); setEditingAdmin(undefined); }}
            />
          )}
          <AdminsTable data={admins} />
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { setEditingRole(undefined); setShowRoleForm(true); }}
              className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Plus size={16} />
              Add Role
            </button>
          </div>
          {showRoleForm && (
            <RoleForm
              role={editingRole}
              onSave={handleSaveRole}
              onCancel={() => { setShowRoleForm(false); setEditingRole(undefined); }}
            />
          )}
          <RolesTable data={roles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
