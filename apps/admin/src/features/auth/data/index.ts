export interface AdminUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF';
}

export const adminUsers: AdminUser[] = [
  {
    id: '1',
    email: 'superadmin@unseengadget.com',
    name: 'Super Admin',
    password: 'admin123',
    role: 'SUPER_ADMIN',
  },
  {
    id: '2',
    email: 'manager@unseengadget.com',
    name: 'Store Manager',
    password: 'manager123',
    role: 'MANAGER',
  },
  {
    id: '3',
    email: 'staff@unseengadget.com',
    name: 'Staff Member',
    password: 'staff123',
    role: 'STAFF',
  },
];