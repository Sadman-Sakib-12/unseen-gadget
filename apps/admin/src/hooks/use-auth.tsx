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

  // 1. Initial hydration from localStorage (synchronous on client mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        try {
          setUser(normalizeAdminUser(JSON.parse(storedUser)));
        } catch {
          // invalid stored json
        }
      }
    }
  }, []);

  // 2. Validate session with backend
  useEffect(() => {
    let active = true;
    const checkAuth = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_access_token') : null;
        const headers: Record<string, string> = {};
        if (storedToken) {
          headers['Authorization'] = `Bearer ${storedToken}`;
        }

        const res = await fetch(`${API_URL}/api/admin/auth/me`, {
          headers,
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (active && data.success) {
            const normalized = normalizeAdminUser(data.data);
            setUser(normalized);
            if (typeof window !== 'undefined' && normalized) {
              localStorage.setItem('admin_user', JSON.stringify(normalized));
            }
          }
        } else if (res.status === 401) {
          // Token is actually invalid or expired
          if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin_user');
          }
          if (active) setUser(null);
        }
      } catch {
        // Network error - retain cached user so offline/temporary blips don't log admin out
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
        const normalized = normalizeAdminUser(data.data);
        setUser(normalized);
        const token = data.data?.accessToken || data.data?.token;
        if (typeof window !== 'undefined') {
          if (token) localStorage.setItem('admin_access_token', token);
          if (normalized) localStorage.setItem('admin_user', JSON.stringify(normalized));
        }
        return { success: true };
      }
      return { success: false, error: data.message || data.error?.message || 'Invalid email or password' };
    } catch {
      return { success: false, error: 'Network error or server unavailable' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_access_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${API_URL}/api/admin/auth/logout`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch {
      // Ignore errors
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_user');
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
    if (isAuthLoaded && !isAuthenticated && !user) {
      router.push('/login');
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [isAuthLoaded, isAuthenticated, allowedRoles, user, router]);

  if (!isAuthLoaded && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export { AuthProvider, useAuth, ProtectedRoute };
