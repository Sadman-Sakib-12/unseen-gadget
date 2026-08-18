"use client";
import { useState } from "react";
import { Plus, ShieldPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { AdminsTable } from "./admins-table";
import { RolesTable } from "./roles-table";
import { AdminForm } from "./admin-form";
import { RoleForm } from "./role-form";
import initialAdmins from "@/features/admin-management/data/admins.json";
import initialRoles from "@/features/admin-management/data/roles.json";
import type { Admin, Role } from "@/features/admin-management/types";

export function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [roles] = useState<Role[]>(initialRoles);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleSaveAdmin = (admin: Admin) => {
    if (editingAdmin) {
      setAdmins(admins.map((a) => (a.id === admin.id ? admin : a)));
    } else {
      setAdmins([...admins, admin]);
    }
    setShowAdminForm(false);
    setEditingAdmin(null);
  };

  const handleSaveRole = () => {
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