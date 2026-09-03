'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { useTranslation } from '@/hooks/use-translation';

export default function ForgotPasswordPage() {
  const { language } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error(
        language === 'bn'
          ? 'সঠিক ইমেইল এড্রেস লিখুন'
          : 'Please enter a valid email address'
      );
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setIsSubmitted(true);
      toast.success(
        language === 'bn'
          ? 'রিসেট লিঙ্ক পাঠানো হয়েছে!'
          : 'Reset link sent!',
        {
          description:
            language === 'bn'
              ? 'আপনার ইমেইলের ইনবক্স চেক করুন।'
              : 'Please check your email inbox for instructions.',
        }
      );
    } catch (err: any) {
      toast.error(
        language === 'bn' ? 'ব্যর্থ হয়েছে' : 'Failed to send reset email',
        {
          description: err.error || err.message || 'Something went wrong.',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile-only Brand Header */}
      <div className="lg:hidden flex items-center justify-between gap-2 mb-6 pb-3 border-b border-zinc-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <span className="text-base font-bold">
            <span className="text-zinc-900">Unseen </span>
            <span className="text-blue-600">Gadget</span>
          </span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900">
          Home
        </Link>
      </div>

      {isSubmitted ? (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-zinc-900">
              {language === 'bn' ? 'ইমেইল পাঠানো হয়েছে' : 'Check Your Inbox'}
            </h1>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              {language === 'bn'
                ? `আমরা ${email} ঠিকানায় একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়েছি। আপনার ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।`
                : `We have sent password reset instructions to ${email}. Please check your inbox or spam folder.`}
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-zinc-600 hover:text-zinc-900 font-semibold underline underline-offset-4"
            >
              {language === 'bn' ? 'অন্য ইমেইল দিয়ে চেষ্টা করুন' : 'Try another email'}
            </button>

            <div>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {language === 'bn' ? 'লগইন পেজে ফিরুন' : 'Back to Login'}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {language === 'bn' ? 'পাসওয়ার্ড উদ্ধার' : 'ACCOUNT RECOVERY'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 mt-0.5">
              {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              {language === 'bn'
                ? 'আপনার রেজিস্টার্ড ইমেইল লিখুন, আমরা পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়ে দেব।'
                : 'Enter your email and we will send you a reset link.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2.5 border-b border-zinc-300 focus-within:border-zinc-900 py-1.5 transition-colors group">
                <Mail className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 shrink-0" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার ইমেইল অ্যাড্রেস' : 'Enter your email address'}
                  className="w-full bg-transparent border-none p-0 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-6 rounded-full bg-[#1c2b6e] hover:bg-[#142055] text-white font-bold text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1c2b6e] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-3.5 w-3.5 text-white" />
                  <span>{language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'bn' ? 'রিসেট লিঙ্ক পাঠান' : 'SEND RESET LINK'}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 text-center border-t border-zinc-200 pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {language === 'bn' ? 'লগইন পেজে ফিরে যান' : 'Back to Login'}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
