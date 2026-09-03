export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  roleId?: string;
  role: string | Role;
  permissions?: string[];
  status: string;
  lastLogin: string | null;
  password?: string;
}
