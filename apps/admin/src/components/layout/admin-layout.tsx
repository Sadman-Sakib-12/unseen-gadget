'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';
import { NAV_ITEMS } from '@/config/navigation';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthLoaded, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthLoaded, isAuthenticated, user, router]);

  const userRole = (
    typeof user?.role === 'object' && user?.role !== null
      ? (user.role as { name?: string }).name
      : user?.role
  )?.toUpperCase();

  const userPermissions = (
    user?.permissions ||
    user?.roleObject?.permissions ||
    []
  ).map((p: string) => String(p).toLowerCase());

  const isRestrictedRoute = useMemo(() => {
    if (!userRole) return false;
    // Super admin has full access to all routes
    if (userRole === 'SUPER_ADMIN') return false;

    // Check if the current pathname matches a restricted nav item
    const matched = NAV_ITEMS.find((item) => {
      if (pathname === item.href) return true;
      if (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) return true;
      if (item.subItems) {
        return item.subItems.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + '/'));
      }
      return false;
    });

    if (!matched) return false;

    if (matched.allowedRoles && matched.allowedRoles.length > 0) {
      const allowedUpper = matched.allowedRoles.map((r) => r.toUpperCase());
      if (!allowedUpper.includes(userRole)) return true;
    }

    if (matched.requiredPermission) {
      const req = matched.requiredPermission.toLowerCase();
      const legacyMap: Record<string, string[]> = {
        orders: ['orders', 'manage_orders'],
        products: ['products', 'manage_products'],
        inventory: ['inventory', 'manage_inventory', 'manage_products'],
        categories: ['categories', 'manage_products'],
        pos: ['pos', 'manage_pos', 'manage_orders'],
        cms: ['cms', 'manage_cms'],
        reports: ['reports', 'manage_reports'],
        settings: ['settings', 'manage_settings'],
        admin_management: ['admin_management', 'manage_users'],
        customers: ['customers', 'manage_users'],
        expenses: ['expenses', 'manage_settings'],
        suppliers: ['suppliers', 'manage_products'],
        purchases: ['purchases', 'manage_products'],
        coupons: ['coupons', 'manage_products'],
        promotions: ['promotions', 'manage_products', 'manage_cms'],
        delivery: ['delivery', 'manage_orders'],
        payments: ['payments', 'manage_orders'],
        returns: ['returns', 'manage_orders'],
        reviews: ['reviews', 'manage_products'],
        notifications: ['notifications', 'dashboard'],
        dashboard: ['dashboard'],
      };

      const allowedKeys = legacyMap[req] || [req];
      const isPermitted =
        userPermissions.includes('all') ||
        userPermissions.includes('*') ||
        allowedKeys.some((k) => userPermissions.includes(k));

      if (!isPermitted && userPermissions.length > 0) {
        return true;
      }
    }

    return false;
  }, [pathname, userRole, userPermissions]);

  if ((!isAuthLoaded && !user) || (!isAuthenticated && !user)) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-lg">
            UG
          </div>
          <p className="text-sm text-gray-500">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-gray-50">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {isRestrictedRoute ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 shadow-sm">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                You do not have permission to access this section. Only authorized administrators with the required role can view this page.
              </p>
              <Button
                className="mt-6"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export { AdminLayout };