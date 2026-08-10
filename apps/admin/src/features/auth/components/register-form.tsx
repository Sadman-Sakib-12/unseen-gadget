'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User, Briefcase } from 'lucide-react';

interface RegisterFormProps {
  onRegister?: (name: string, email: string, password: string, role?: 'SUPER_ADMIN' | 'MANAGER' | 'STAFF') => void;
}

const RegisterForm = ({ onRegister }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'MANAGER' | 'STAFF'>('STAFF');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Note: Since useAuth might not have register fully wired for direct access by default, 
  // but it is available in context, we can use it.
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setIsLoading(true);
    if (onRegister) {
      onRegister(name, email, password, role);
    } else {
      const success = await register(name, email, password, role);
      if (success) {
        alert('Registration successful! Please login.');
        router.push('/login');
      } else {
        alert('Email already exists or registration failed.');
      }
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/95 backdrop-blur">
      <CardContent className="pt-12 pb-10 px-8 sm:px-12">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1c2b6e] text-white mb-4 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h2>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">Create New Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Briefcase className="h-4 w-4" />
              </div>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'SUPER_ADMIN' | 'MANAGER' | 'STAFF')}
                required
                className="w-full pl-11 pr-4 rounded-full bg-[#f8fafc] border border-gray-200/80 focus:border-[#1c2b6e] focus:ring-2 focus:ring-[#1c2b6e]/20 focus:bg-white h-12 transition-all shadow-sm appearance-none outline-none text-sm"
              >
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
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
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-11 pr-11 rounded-full bg-[#f8fafc] border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white h-12 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full rounded-full h-12 bg-[#1c2b6e] text-white font-medium text-base transition-all shadow-md hover:bg-[#1c2b6e]" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 font-medium">
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
