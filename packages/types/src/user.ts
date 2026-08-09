export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  createdAt: Date;
}

export interface UserCreateInput {
  email: string;
  name?: string;
  phone?: string;
  password: string;
}
