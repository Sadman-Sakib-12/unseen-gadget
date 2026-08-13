'use client';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/95 backdrop-blur">
      <CardContent className="pt-10 pb-8 px-8 sm:px-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1c2b6e] to-[#2d4a9e] text-white mb-4 shadow-md">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Reset link sent!'); }}>
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
                required
                className="pl-11 rounded-full bg-[#f8fafc] border-gray-200/80 focus-visible:ring-[#1c2b6e] focus-visible:bg-white h-12 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full rounded-full h-12 bg-gradient-to-r from-[#1c2b6e] to-[#2d4a9e] text-white font-semibold text-base shadow-md disabled:opacity-50"
            >
              Send Reset Link
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/login" className="inline-flex items-center gap-1 text-[#1c2b6e] font-semibold hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
