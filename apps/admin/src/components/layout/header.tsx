'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { formatRelativeDay } from '@/lib/format';
import { api } from '@/lib/api';

interface HeaderProps {
  onMenuClick: () => void;
}

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  MANAGER: 'Store Manager',
  STAFF: 'Staff',
};

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

interface HeaderNotification {
  id?: string;
  title?: string;
  message?: string;
  read?: boolean;
  time?: string;
  createdAt?: string;
  type?: string;
  actionUrl?: string;
  [key: string]: unknown;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api.notifications
      .list()
      .then((res) => setNotifications((res.data as HeaderNotification[]) ?? []))
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const latestNotifications = notifications.slice(0, 4);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search products, orders, customers..."
          containerClassName="sm:w-full sm:max-w-md"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <DropdownMenu
          align="end"
          trigger={
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              ) : null}
            </Button>
          }
        >
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-72 overflow-y-auto">
            {latestNotifications.map((notification) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  onSelect={() => notification.actionUrl && router.push(notification.actionUrl)}
                >
                  <span className="flex min-w-0 flex-col gap-0.5 py-0.5">
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          notification.read ? 'bg-gray-300' : 'bg-blue-600'
                        }`}
                      />
                      <span className="truncate font-medium text-gray-900">
                        {notification.title}
                      </span>
                    </span>
                    <span className="truncate pl-3.5 text-xs text-gray-500">
                      {formatRelativeDay(notification.time)}
                    </span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))}
          </div>
          <DropdownMenuItem onSelect={() => router.push('/notifications')}>
            <Bell className="h-4 w-4" />
            View all notifications
          </DropdownMenuItem>
        </DropdownMenu>

        <DropdownMenu
          align="end"
          trigger={
            <Button variant="ghost" className="gap-2 px-1.5 py-1" aria-label="Account menu">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initialsOf(user?.name ?? 'Admin')}
              </span>
              <span className="hidden text-left md:block">
                <span className="block max-w-[9rem] truncate text-sm font-medium text-gray-900">
                  {user?.name ?? 'Admin'}
                </span>
                <span className="block text-xs text-gray-500">
                  {user
                    ? roleLabel[typeof user.role === 'object' && user.role !== null ? (user.role as { name?: string }).name ?? '' : user.role] ??
                      (typeof user.role === 'object' && user.role !== null ? (user.role as { name?: string }).name ?? '' : String(user.role ?? ''))
                    : ''}
                </span>
              </span>
            </Button>
          }
        >
          <DropdownMenuLabel>{user?.email ?? 'Account'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => router.push('/settings')}>
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
};

export { Header };