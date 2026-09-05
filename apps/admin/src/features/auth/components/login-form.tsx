'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
    try {
      if (onLogin) {
        onLogin(email, password);
      } else {
        const result = await login(email, password);
        if (result.success) {
          toast.success('Signed in successfully');
          router.push('/dashboard');
        } else {
          toast.error(result.error || 'Invalid email or password');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/95 backdrop-blur">
      <CardContent className="p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#1c2b6e] to-[#2d4a9e] rounded-2xl flex items-center justify-center mb-5 shadow-lg">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h2>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">Enter your credentials to access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#1c2b6e] transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="admin@unseengadget.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 rounded-xl bg-gray-50/50 border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white focus-visible:border-[#1c2b6e] h-12 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#1c2b6e] transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11 pr-11 rounded-xl bg-gray-50/50 border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white focus-visible:border-[#1c2b6e] h-12 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-xs font-medium text-[#1c2b6e] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full rounded-xl h-12 bg-gradient-to-r from-[#1c2b6e] to-[#2d4a9e] text-white font-semibold text-base shadow-md disabled:opacity-50" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#1c2b6e] font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export { LoginForm };
