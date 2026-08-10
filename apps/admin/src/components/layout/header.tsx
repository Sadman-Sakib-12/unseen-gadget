'use client';

import { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu
          align="end"
          trigger={
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
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
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          }
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => {}}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={logout}>Logout</DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
};

export { Header };