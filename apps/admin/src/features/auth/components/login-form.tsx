'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (onLogin) {
      onLogin(email, password);
    } else {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        alert('Invalid email or password');
      }
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/95 backdrop-blur">
      <CardContent className="pt-12 pb-10 px-8 sm:px-12">
        <div className="flex flex-col items-center mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1c2b6e] text-white mb-4 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h2>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">Secure Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-gray-600 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="admin@unseengadget.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 rounded-full bg-[#f8fafc] border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white h-12 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-gray-600 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11 pr-11 rounded-full bg-[#f8fafc] border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white h-12 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end pt-1.5">
              <Link href="/forgot-password" className="text-xs font-medium text-gray-500 hover:text-[#1c2b6e] transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full rounded-full h-12 bg-[#1c2b6e] text-white font-medium text-base transition-all shadow-md hover:bg-[#1c2b6e]" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#1c2b6e] font-semibold hover:underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export { LoginForm };
