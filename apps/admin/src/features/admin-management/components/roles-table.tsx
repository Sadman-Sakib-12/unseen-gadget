"use client";
import { Role } from "@/features/admin-management/types";

export function RolesTable({ data }: { data: Role[] }) {
  return (
    <div className="rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Permissions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs">{role.id}</td>
              <td className="px-4 py-3 font-medium">{role.name}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((p) => (
                    <span key={p} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{p}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
