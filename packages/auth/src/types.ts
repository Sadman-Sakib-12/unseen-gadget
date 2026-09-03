export interface AccessTokenPayload {
  sub: string;
  ver: number;
  type: "access";
  email?: string;
  role?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  ver: number;
  type: "refresh";
}

export type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

export interface AuthCustomer {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  status: string;
  avatar: string | null;
  tokenVersion: number;
}

export interface AuthAdmin {
  id: string;
  email: string;
  name: string;
  roleId: string;
  status: string;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
}
