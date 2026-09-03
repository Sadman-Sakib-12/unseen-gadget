'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useTranslation } from '@/hooks/use-translation';
import { Eye, EyeOff, Mail, Lock, KeyRound, ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function LoginForm() {
  const { t, language } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first OTP box when entering step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Step 1: Submit Credentials & Request OTP
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(language === 'bn' ? 'ইমেইল ও পাসওয়ার্ড দিন' : 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || json.message || 'Invalid credentials');
      }

      if (json.data?.requiresOtp) {
        setStep(2);
        setResendTimer(60);
        toast.success(language === 'bn' ? 'ভেরিফিকেশন কোড পাঠানো হয়েছে' : 'Verification code sent', {
          description: language === 'bn' ? `আপনার ইমেইলে (${email}) ৬-সংখ্যার কোড পাঠানো হয়েছে।` : `A 6-digit code was sent to ${email}`,
        });
      } else {
        // Direct login if no OTP required
        const nextAuthRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (nextAuthRes?.error) {
          toast.error(nextAuthRes.error);
        } else {
          toast.success('Login successful', { description: 'Welcome back!' });
          router.push('/account');
          router.refresh();
        }
      }
    } catch (error: any) {
      toast.error('Login failed', { description: error.message || 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted) {
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pasted[i] || '';
        }
        setOtp(newOtp);
        const nextIndex = Math.min(pasted.length, 5);
        otpInputsRef.current[nextIndex]?.focus();
      }
      return;
    }

    const clean = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    // Auto-focus next input
    if (clean && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP & Complete Login
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error(language === 'bn' ? '৬-সংখ্যার কোডটি সম্পূর্ণ লিখুন' : 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        otp: otpCode,
        redirect: false,
      });

      if (res?.error) {
        toast.error(language === 'bn' ? 'ভেরিফিকেশন ব্যর্থ হয়েছে' : 'Verification failed', {
          description: res.error === 'OTP_REQUIRED' ? 'Invalid verification code' : res.error,
        });
      } else {
        toast.success(language === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login successful!', {
          description: language === 'bn' ? 'স্বাগতম!' : 'Welcome back!',
        });
        router.push('/account');
        router.refresh();
      }
    } catch (error: any) {
      toast.error('Verification failed', { description: error.message || 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || json.message || 'Failed to resend code');
      }
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
      toast.success(language === 'bn' ? 'নতুন কোড পাঠানো হয়েছে' : 'New code sent', {
        description: language === 'bn' ? `আপনার ইমেইলে (${email}) নতুন কোড পাঠানো হয়েছে।` : `A new verification code was sent to ${email}`,
      });
    } catch (error: any) {
      toast.error('Resend failed', { description: error.message });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile-only Brand Header */}
      <div className="lg:hidden flex items-center justify-between gap-2 mb-8 pb-4 border-b border-zinc-200">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
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
          <span className="text-lg font-bold">
            <span className="text-zinc-900">Unseen </span>
            <span className="text-blue-600">Gadget</span>
          </span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900">
          Home
        </Link>
      </div>

      {step === 1 ? (
        <>
          {/* Header matching reference design */}
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {language === 'bn' ? 'স্বাগতম' : 'WELCOME BACK'}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mt-0.5">
              {language === 'bn' ? 'লগইন' : 'Login'}
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              {language === 'bn' ? 'আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন।' : 'Enter your details to continue.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            {/* Email / Username Input - Clean single underline style matching screenshot */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 border-b border-zinc-300 focus-within:border-zinc-900 py-2 transition-colors group">
                <Mail className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 shrink-0" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'bn' ? 'ইউজারনেম বা ইমেইল' : 'Username / Email'}
                  className="w-full bg-transparent border-none p-0 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Password Input - Clean single underline style matching screenshot */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 border-b border-zinc-300 focus-within:border-zinc-900 py-2 transition-colors group">
                <Lock className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 shrink-0" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  className="w-full bg-transparent border-none p-0 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-700 transition-colors shrink-0"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer accent-zinc-900"
                />
                <span className="text-xs text-zinc-500">{t("auth.rememberMe")}</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            {/* Submit Pill Button matching reference image */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 px-6 rounded-full bg-[#1c2b6e] hover:bg-[#142055] text-white font-bold text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1c2b6e] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-3.5 w-3.5 text-white" />
                  <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'bn' ? 'লগইন' : 'LOGIN'}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="px-3 bg-white text-zinc-400 font-semibold">{t("auth.orSignUpWith")}</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/account' })}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-zinc-200 rounded-full text-zinc-700 text-xs font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-2xs"
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
                onClick={() => signIn('facebook', { callbackUrl: '/account' })}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-zinc-200 rounded-full text-zinc-700 text-xs font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-2xs"
              >
                <svg className="h-3.5 w-3.5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-xs text-zinc-500">
            {t("auth.dontHaveAccount")}{' '}
            <Link href="/register" className="font-bold text-zinc-900 hover:underline transition-colors">
              {t("auth.signUp")}
            </Link>
          </p>
        </>
      ) : (
        <>
          {/* Step 2: OTP Verification Screen */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-4 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {language === 'bn' ? 'ইমেইল পরিবর্তন করুন' : 'Back to email'}
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {language === 'bn' ? 'ভেরিফিকেশন' : 'VERIFICATION'}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 leading-tight">
                  {language === 'bn' ? 'সিকিউরিটি কোড দিন' : 'Enter Code'}
                </h1>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
              {language === 'bn'
                ? `আমরা ${email} ঠিকানায় একটি ৬-সংখ্যার কোড পাঠিয়েছি। কোডটি নিচে লিখুন:`
                : `We sent a 6-digit code to ${email}. Enter it below to log in:`}
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border-2 border-zinc-200 bg-white text-center text-xl font-bold text-zinc-900 transition-all focus:border-zinc-900 focus:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 shadow-xs"
                />
              ))}
            </div>

            {/* Verify & Login Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full py-3.5 px-6 rounded-full bg-[#1c2b6e] hover:bg-[#142055] text-white font-bold text-xs sm:text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1c2b6e] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 text-white" />
                  <span>{language === 'bn' ? 'লগইন হচ্ছে...' : 'Verifying & Logging in...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'bn' ? 'ভেরিফাই ও লগইন' : 'VERIFY & LOG IN'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Resend Code Section */}
            <div className="text-center pt-2">
              {resendTimer > 0 ? (
                <p className="text-xs text-zinc-500">
                  {language === 'bn'
                    ? `পুনরায় কোড পাঠাতে অপেক্ষা করুন: ${resendTimer} সেকেন্ড`
                    : `Resend code in ${resendTimer}s`}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:underline transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
                  <span>{language === 'bn' ? 'কোড আবার পাঠান' : 'Resend Verification Code'}</span>
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
