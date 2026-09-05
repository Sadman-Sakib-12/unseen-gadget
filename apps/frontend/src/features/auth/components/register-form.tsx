'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { useTranslation } from '@/hooks/use-translation';
import { Eye, EyeOff, Mail, Lock, User, Smartphone, ArrowRight, RefreshCw } from 'lucide-react';

export function RegisterForm() {
  const { t, language } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmPasswordValue) {
      toast.error(
        language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Please confirm your password'
      );
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      toast.error(
        language === 'bn'
          ? 'পাসওয়ার্ড দুটি মিলছে না! একই পাসওয়ার্ড দিন।'
          : 'Passwords do not match!'
      );
      return;
    }

    setIsLoading(true);
    try {
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
      const password = passwordValue;
      await authApi.register({ name, email, phone, password });
      router.push('/');
      toast.success(language === 'bn' ? 'অ্যাকাউন্ট তৈরি হয়েছে' : 'Account created', {
        description: language === 'bn' ? 'দয়া করে আপনার ইমেইল যাচাই করুন।' : 'Please verify your email.',
      });
    } catch (error: any) {
      toast.error(language === 'bn' ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' : 'Registration failed', {
        description: error.error || error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile-only Brand Header */}
      <div className="lg:hidden flex items-center justify-between gap-2 mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-800">
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
            <span className="text-zinc-900 dark:text-zinc-100">Unseen </span>
            <span className="text-blue-600 dark:text-blue-400">Gadget</span>
          </span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
          Home
        </Link>
      </div>

      {/* Header matching reference design */}
      <div className="mb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          {language === 'bn' ? 'নতুন অ্যাকাউন্ট' : 'START FOR FREE'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
          {language === 'bn' ? 'অ্যাকাউন্ট খুলুন' : 'Create Account'}
        </h1>
        <p className="mt-0.5 text-xs text-zinc-400">
          {language === 'bn' ? 'শুরু করতে আপনার সঠিক তথ্য প্রদান করুন।' : 'Enter your details to get started.'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name Input */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5 border-b border-zinc-300 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-100 py-1.5 transition-colors group">
            <User className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 shrink-0" />
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder={t('auth.fullNamePlaceholder')}
              className="w-full bg-transparent border-none p-0 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5 border-b border-zinc-300 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-100 py-1.5 transition-colors group">
            <Mail className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 shrink-0" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t('auth.emailPlaceholder')}
              className="w-full bg-transparent border-none p-0 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Phone Input */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5 border-b border-zinc-300 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-100 py-1.5 transition-colors group">
            <Smartphone className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 shrink-0" />
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder={t('auth.phonePlaceholder')}
              className="w-full bg-transparent border-none p-0 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Password Input with Strength Indicator */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5 border-b border-zinc-300 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-100 py-1.5 transition-colors group">
            <Lock className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 shrink-0" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder={t('auth.createPasswordPlaceholder')}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="w-full bg-transparent border-none p-0 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {passwordValue && (
            <div className="space-y-0.5 pt-1">
              <div className="flex gap-1">
                <div
                  className={`h-1 flex-1 rounded-full transition-all ${
                    passwordStrength >= 1 ? 'bg-red-500' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-all ${
                    passwordStrength >= 2 ? 'bg-amber-500' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-all ${
                    passwordStrength >= 3 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {passwordStrength === 1 && (language === 'bn' ? 'দুর্বল পাসওয়ার্ড' : 'Weak password')}
                {passwordStrength === 2 && (language === 'bn' ? 'মোটামুটি পাসওয়ার্ড' : 'Medium password')}
                {passwordStrength === 3 && (language === 'bn' ? 'শক্তিশালী পাসওয়ার্ড' : 'Strong password')}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5 border-b border-zinc-300 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-100 py-1.5 transition-colors group">
            <Lock className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 shrink-0" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={confirmPasswordValue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
              className="w-full bg-transparent border-none p-0 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {confirmPasswordValue && passwordValue !== confirmPasswordValue && (
            <p className="text-[10px] text-red-500 pt-0.5 font-medium">
              {language === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না' : 'Passwords do not match'}
            </p>
          )}
          {confirmPasswordValue && passwordValue === confirmPasswordValue && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 pt-0.5 font-medium">
              {language === 'bn' ? '✓ পাসওয়ার্ড মিলেছে' : '✓ Passwords match'}
            </p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start gap-2 pt-0.5">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-0.5 w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-blue-500 focus:ring-zinc-900 cursor-pointer accent-zinc-900 dark:accent-blue-500"
          />
          <label htmlFor="terms" className="text-[11px] text-zinc-500 dark:text-zinc-400 cursor-pointer leading-tight">
            {t('auth.agreeTerms')}{' '}
            <Link href="/terms" className="font-semibold text-zinc-800 hover:underline dark:text-zinc-200">
              {t('auth.termsAndConditions')}
            </Link>
          </label>
        </div>

        {/* Create Account Pill Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-6 rounded-full bg-[#1c2b6e] hover:bg-[#142055] text-white font-bold text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1c2b6e] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] group cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin h-3.5 w-3.5 text-white" />
              <span>{t('auth.creatingAccount')}</span>
            </>
          ) : (
            <>
              <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'CREATE ACCOUNT'}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="px-3 bg-white dark:bg-zinc-900 text-zinc-400 font-semibold">{t('auth.orSignUpWith')}</span>
          </div>
        </div>

        {/* Social Signup Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-700 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-750 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-2xs cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-zinc-700 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-750 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-2xs cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>
        </div>
      </form>

      {/* Sign In Link */}
      <p className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link href="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors">
          {t('auth.signIn')}
        </Link>
      </p>
    </div>
  );
}
