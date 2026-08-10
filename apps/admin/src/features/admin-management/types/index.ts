export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: string;
  lastLogin: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}
