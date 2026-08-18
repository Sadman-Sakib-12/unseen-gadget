'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
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
  Tags,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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
  { title: 'Categories', href: '/categories-brands', icon: Tags, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Coupons', href: '/coupons', icon: Ticket, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Promotions', href: '/promotions', icon: Megaphone, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Delivery', href: '/delivery', icon: TruckIcon, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Payments', href: '/payments', icon: CreditCard, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Returns & Refunds', href: '/returns', icon: RotateCcw, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Reviews', href: '/reviews', icon: Star, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Expenses', href: '/expenses', icon: Receipt, allowedRoles: ['SUPER_ADMIN'] },
  { title: 'Reports', href: '/reports', icon: BarChart3, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  { title: 'Notifications', href: '/notifications', icon: Bell, allowedRoles: ['SUPER_ADMIN', 'MANAGER'] },
  {
    title: 'CMS',
    href: '/cms',
    icon: FileText,
    allowedRoles: ['SUPER_ADMIN', 'MANAGER'],
    subItems: [
      { title: 'Brands', href: '/cms/brands' },
      { title: 'Footer', href: '/cms/footer' },
      { title: 'Pages', href: '/cms/pages' },
      { title: 'Blog', href: '/blog/posts' },
      { title: 'Banners', href: '/blog/banners' },
      { title: 'About', href: '/blog/about' },
      { title: 'Promotions', href: '/cms/promotions' },
      { title: 'Jobs', href: '/cms/jobs' },
      { title: 'Navbar', href: '/blog/navbar' },
      { title: 'Home Page', href: '/blog/landing' },
    ],
  },
  { title: 'Settings', href: '/settings', icon: Settings, allowedRoles: ['SUPER_ADMIN'] },
  { title: 'Admin & Roles', href: '/admin-management', icon: Shield, allowedRoles: ['SUPER_ADMIN'] },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar = ({ mobileOpen, onMobileClose }: SidebarProps) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    '/cms': true,
  });
  const pathname = usePathname();

  const toggleSubmenu = (href: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const isItemActive = (item: NavItem) =>
    pathname === item.href || (pathname.startsWith(item.href + '/') && !item.subItems);

  const isSubmenuActive = (item: NavItem) => item.subItems?.some((sub) => pathname === sub.href);

  const badgeClass = (item: NavItem, isActive: boolean) =>
    cn(
      'flex h-5 shrink-0 items-center justify-center rounded-full px-2 text-[10px] font-bold tracking-wide',
      item.badge?.variant === 'success' && 'bg-emerald-100 text-emerald-700',
      item.badge?.variant === 'destructive' && 'bg-red-100 text-red-700',
      (item.badge?.variant === 'default' || !item.badge) && 'bg-primary/10 text-primary',
      isActive &&
        (item.badge?.variant === 'default' || item.badge?.variant === 'success') &&
        'bg-white/20 text-white',
      isActive && item.badge?.variant === 'destructive' && 'bg-white/20 text-white'
    );

  const renderNav = (collapse: boolean, onNavigate?: () => void) => (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 custom-scrollbar">
      <ul className="space-y-1">
        {navItems
          .filter((item) => !item.allowedRoles || (user && item.allowedRoles.includes(user.role)))
          .map((item) => {
            const isActive = isItemActive(item);
            const subActive = isSubmenuActive(item);
            const isExpanded = expandedMenus[item.href];
            const Icon = item.icon;

            return (
              <li key={item.href} title={collapse ? item.title : undefined}>
                {item.subItems ? (
                  <div>
                    <div
                      className={cn(
                        'flex items-center rounded-lg transition-colors',
                        subActive || pathname === item.href
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-label={item.title}
                        className={cn(
                          'flex min-w-0 flex-1 items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors',
                          collapse ? 'justify-center px-0' : 'px-3',
                          subActive || pathname === item.href
                            ? 'text-primary-foreground'
                            : 'text-gray-600 hover:text-gray-900'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            subActive || pathname === item.href ? 'text-white' : 'text-gray-500'
                          )}
                        />
                        {!collapse && <span className="truncate">{item.title}</span>}
                      </Link>
                      {!collapse && (
                        <button
                          type="button"
                          onClick={() => toggleSubmenu(item.href)}
                          aria-expanded={isExpanded}
                          aria-label={`Toggle ${item.title} submenu`}
                          className={cn(
                            'mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors',
                            subActive || pathname === item.href
                              ? 'text-white/80 hover:bg-white/10'
                              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                          )}
                        >
                          <ChevronDown
                            className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
                          />
                        </button>
                      )}
                    </div>
                    {!collapse && isExpanded && (
                      <ul className="mt-1 space-y-0.5 pl-4">
                        {item.subItems.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                onClick={onNavigate}
                                className={cn(
                                  'block rounded-md border-l-2 py-2 pl-5 pr-3 text-sm font-medium transition-colors',
                                  isSubActive
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                )}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-label={collapse ? item.title : undefined}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors',
                      collapse ? 'px-0' : 'px-3',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <span
                      className={cn(
                        'flex min-w-0 items-center gap-3',
                        collapse && 'w-full justify-center'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive ? 'text-white' : 'text-gray-500'
                        )}
                      />
                      {!collapse && <span className="truncate">{item.title}</span>}
                    </span>
                    {!collapse && item.badge ? (
                      <span className={badgeClass(item, isActive)}>{item.badge.text}</span>
                    ) : null}
                  </Link>
                )}
              </li>
            );
          })}
      </ul>
    </nav>
  );

  const brandMark = (withClose?: () => void) => (
    <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm">
          UG
        </div>
        {!collapsed || withClose ? (
          <span className="truncate text-base font-bold tracking-tight text-gray-900">
            Unseen Gadget
          </span>
        ) : null}
      </div>
      {withClose ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={withClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );

  const sidebarFooter = (
    <div
      className={cn(
        'px-4 pb-4 pt-2 text-xs font-medium text-gray-400',
        collapsed && 'px-2 text-center'
      )}
    >
      {collapsed ? '© 2026' : '© 2026 Unseen Gadget'}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'relative z-10 hidden h-full shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:flex',
          collapsed ? 'lg:w-20' : 'lg:w-72'
        )}
      >
        {brandMark()}
        {renderNav(collapsed)}
        {sidebarFooter}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn('fixed inset-0 z-40 lg:hidden', !mobileOpen && 'pointer-events-none')}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-gray-950/50 backdrop-blur-sm transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onMobileClose}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {brandMark(onMobileClose)}
          {renderNav(false, onMobileClose)}
          {sidebarFooter}
        </div>
      </div>
    </>
  );
};

export { Sidebar };