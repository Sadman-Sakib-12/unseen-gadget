'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface RoleObject {
  id: string;
  name: string;
  permissions?: string[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF' | string;
  roleObject?: RoleObject;
  permissions?: string[];
}

function normalizeAdminUser(raw: unknown): AdminUser | null {
  if (!raw || typeof raw !== 'object') return null;
  const rawObj = raw as Record<string, unknown>;
  const rawRole = rawObj.role;
  const roleName =
    typeof rawRole === 'object' && rawRole !== null
      ? (rawRole as { name?: string }).name
      : typeof rawRole === 'string'
      ? rawRole
      : 'STAFF';

  return {
    id: String(rawObj.id ?? ''),
    name: String(rawObj.name ?? 'Admin'),
    email: String(rawObj.email ?? ''),
    role: (roleName as 'SUPER_ADMIN' | 'MANAGER' | 'STAFF') || 'STAFF',
    roleObject: typeof rawRole === 'object' && rawRole !== null ? (rawRole as RoleObject) : undefined,
    permissions: Array.isArray(rawObj.permissions) ? (rawObj.permissions as string[]) : undefined,
  };
}

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF') => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (active && data.success) {
            setUser(normalizeAdminUser(data.data));
          }
        }
      } catch {
        // Not authenticated
      } finally {
        if (active) setIsAuthLoaded(true);
      }
    };
    checkAuth();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setUser(normalizeAdminUser(data.data));
        return { success: true };
      }
      return { success: false, error: data.message || data.error?.message || 'Invalid email or password' };
    } catch {
      return { success: false, error: 'Network error or server unavailable' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/admin/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore errors
    }
    setUser(null);
    router.push('/login');
  }, [router]);

  const register = useCallback(async (name: string, email: string, password: string, role: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF' = 'STAFF'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/admin/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.message || data.error?.message || 'Registration failed' };
    } catch {
      return { success: false, error: 'Network error or server unavailable' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, isAuthLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isAuthLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      router.push('/login');
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [isAuthLoaded, isAuthenticated, allowedRoles, user, router]);

  if (!isAuthLoaded) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export { AuthProvider, useAuth, ProtectedRoute };
