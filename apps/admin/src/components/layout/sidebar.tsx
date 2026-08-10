'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  Warehouse,
  Truck,
  ShoppingBag,
  Users,
  Ticket,
  Megaphone,
  TruckIcon,
  CreditCard,
  RotateCcw,
  Star,
  Receipt,
  BarChart3,
  FileText,
  Settings,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: { text: string; variant: 'default' | 'success' | 'destructive' };
  subItems?: { title: string; href: string }[];
  allowedRoles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'POS', href: '/pos', icon: ShoppingCart, badge: { text: 'New', variant: 'success' } },
  { title: 'Orders', href: '/orders', icon: ClipboardList, badge: { text: '24', variant: 'default' } },
  { title: 'Products', href: '/products', icon: Package, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Inventory', href: '/inventory', icon: Warehouse, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Suppliers', href: '/suppliers', icon: Truck, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Purchases', href: '/purchases', icon: ShoppingBag, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Customers', href: '/customers', icon: Users, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Coupons', href: '/coupons', icon: Ticket, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Promotions', href: '/promotions', icon: Megaphone, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Delivery', href: '/delivery', icon: TruckIcon, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Payments', href: '/payments', icon: CreditCard, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Returns & Refunds', href: '/returns', icon: RotateCcw, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Reviews', href: '/reviews', icon: Star, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Expenses', href: '/expenses', icon: Receipt, allowedRoles: ['SUPER_ADMIN'] },
  { title: 'Reports', href: '/reports', icon: BarChart3, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { 
    title: 'CMS', 
    href: '/blog', 
    icon: FileText,
    allowedRoles: ['SUPER_ADMIN', 'MANAGER'],
    subItems: [
      { title: 'Banners', href: '/blog/banners' },
      { title: 'Navbar', href: '/blog/navbar' },
      { title: 'Landing Pages', href: '/blog/landing' },
      { title: 'About Us', href: '/blog/about' },
    ]
  },
  { title: 'Settings', href: '/settings', icon: Settings, allowedRoles: ['SUPER_ADMIN'] },
  { title: 'Admin & Roles', href: '/admin-management', icon: Shield, allowedRoles: ['SUPER_ADMIN'] },
];

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    '/blog': true // default expand CMS
  });
  const pathname = usePathname();

  const toggleSubmenu = (href: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col bg-white text-gray-600 transition-all duration-300 border-r border-gray-200 shadow-sm z-10 relative',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c2b6e] text-white font-bold shadow-md">
              UG
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">Unseen Gadget</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 custom-scrollbar">
        <ul className="space-y-1.5">
          {navItems
            .filter((item) => !item.allowedRoles || (user && item.allowedRoles.includes(user.role)))
            .map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && !item.subItems);
            const isSubmenuActive = item.subItems?.some(sub => pathname === sub.href);
            const isExpanded = expandedMenus[item.href];

            return (
              <li key={item.href}>
                <div
                  onClick={() => item.subItems ? toggleSubmenu(item.href) : null}
                  className={cn(
                    'group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 cursor-pointer',
                    isActive && !item.subItems
                      ? 'bg-[#1c2b6e] text-white shadow-md shadow-[#1c2b6e]/20'
                      : isSubmenuActive
                      ? 'bg-[#1c2b6e]/10 text-[#1c2b6e]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {item.subItems ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0 transition-colors',
                            (isActive && !item.subItems) ? 'text-white' : isSubmenuActive ? 'text-[#1c2b6e]' : 'text-gray-500 group-hover:text-[#1c2b6e]'
                          )}
                        />
                        {!collapsed && <span>{item.title}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown className={cn(
                          'h-4 w-4 transition-transform',
                          isExpanded && 'rotate-180',
                          (isActive && !item.subItems) ? 'text-white/80' : isSubmenuActive ? 'text-[#1c2b6e]' : 'text-gray-400 group-hover:text-gray-600'
                        )} />
                      )}
                    </div>
                  ) : (
                    <Link href={item.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0 transition-colors',
                            isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#1c2b6e]'
                          )}
                        />
                        {!collapsed && <span>{item.title}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <div
                          className={cn(
                            'flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-bold tracking-wide',
                            item.badge.variant === 'success' && 'bg-emerald-100 text-emerald-700',
                            item.badge.variant === 'default' && 'bg-[#1c2b6e]/10 text-[#1c2b6e]',
                            isActive && item.badge.variant === 'default' && 'bg-white/20 text-white',
                            isActive && item.badge.variant === 'success' && 'bg-white/20 text-white'
                          )}
                        >
                          {item.badge.text}
                        </div>
                      )}
                    </Link>
                  )}
                </div>

                {/* Submenu rendering */}
                {!collapsed && item.subItems && isExpanded && (
                  <ul className="mt-1 space-y-1 pl-11">
                    {item.subItems.map(subItem => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              isSubActive
                                ? 'bg-[#1c2b6e] text-white shadow-sm shadow-[#1c2b6e]/30'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            )}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-6 pt-0 mt-auto">
          <div className="text-center text-xs text-gray-400 font-medium">
            © 2025 Unseen Gadget
          </div>
        </div>
      )}
    </aside>
  );
};

export { Sidebar };