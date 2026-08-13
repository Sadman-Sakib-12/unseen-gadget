'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, User, Briefcase } from 'lucide-react';

interface RegisterFormProps {
  onRegister?: (
    name: string,
    email: string,
    password: string,
    role?: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF'
  ) => void;
}

const ROLE_LABELS: Record<'SUPER_ADMIN' | 'MANAGER' | 'STAFF', string> = {
  SUPER_ADMIN: 'Super Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
};

const RegisterForm = ({ onRegister }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'MANAGER' | 'STAFF'>('STAFF');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      if (onRegister) {
        onRegister(name, email, password, role);
      } else {
        const success = await register(name, email, password, role);
        if (success) {
          toast.success('Account created. Please sign in.');
          router.push('/login');
        } else {
          toast.error('An account with this email already exists.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/95 backdrop-blur">
      <CardContent className="pt-10 pb-8 px-8 sm:px-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1c2b6e] to-[#2d4a9e] text-white mb-4 shadow-md">
            <User className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">Set up your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-gray-600 ml-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-11 rounded-full bg-[#f8fafc] border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white h-12 transition-all shadow-sm"
              />
            </div>
          </div>

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
            <label htmlFor="role" className="text-xs font-semibold text-gray-600 ml-1">
              Account Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 z-10">
                <Briefcase className="h-4 w-4" />
              </div>
              <Select
                id="role"
                options={Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))}
                value={role}
                onChange={(e) => setRole(e.target.value as 'SUPER_ADMIN' | 'MANAGER' | 'STAFF')}
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11 pr-10 rounded-full bg-[#f8fafc] border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white h-12 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-600 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-11 pr-10 rounded-full bg-[#f8fafc] border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white h-12 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full rounded-full h-12 bg-gradient-to-r from-[#1c2b6e] to-[#2d4a9e] text-white font-semibold text-base shadow-md disabled:opacity-50" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#1c2b6e] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export { RegisterForm };
