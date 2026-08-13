'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { adminUsers, type AdminUser } from '@/features/auth/data';

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF') => Promise<boolean>;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const storedUser = window.localStorage.getItem('admin_user');
      return storedUser ? (JSON.parse(storedUser) as AdminUser) : null;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      return null;
    }
  });
  const router = useRouter();

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const foundUser = adminUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('admin_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('admin_user');
    router.push('/login');
  }, [router]);

  const register = useCallback(async (name: string, email: string, password: string, role: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF' = 'STAFF'): Promise<boolean> => {
    const exists = adminUsers.find((u) => u.email === email);
    if (exists) {
      return false;
    }
    const newUser: AdminUser = {
      id: String(adminUsers.length + 1),
      email,
      name,
      password,
      role,
    };
    adminUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('admin_user', JSON.stringify(newUser));
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, isAuthLoaded: true }}>
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