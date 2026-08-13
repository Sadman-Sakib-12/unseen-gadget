'use client';

import { useState } from 'react';
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

const Header = ({ onMenuClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

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
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
          }
        >
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => {}}>New order received</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>Low stock alert</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>Payment received</DropdownMenuItem>
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
                  {user ? roleLabel[user.role] ?? user.role : ''}
                </span>
              </span>
            </Button>
          }
        >
          <DropdownMenuLabel>{user?.email ?? 'Account'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => {}}>
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