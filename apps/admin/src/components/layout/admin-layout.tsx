'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthLoaded, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoaded, isAuthenticated, router]);

  if (!isAuthLoaded || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export { AdminLayout };