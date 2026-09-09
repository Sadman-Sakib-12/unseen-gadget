'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { useTranslation } from '@/hooks/use-translation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

export function RegisterForm() {
  const { t, language } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Verification State
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
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

  // Focus first OTP input when entering step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  // Step 1: Submit Registration Details
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
      await authApi.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: passwordValue,
      });

      const normalized = email.trim().toLowerCase();
      setRegisteredEmail(normalized);
      setStep(2);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);

      toast.success(
        language === 'bn' ? 'ভেরিফিকেশন কোড পাঠানো হয়েছে' : 'Verification code sent',
        {
          description:
            language === 'bn'
              ? `আপনার ইমেইলে (${normalized}) ৬-সংখ্যার কোড পাঠানো হয়েছে।`
              : `A 6-digit code was sent to ${normalized}`,
        }
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Registration failed';
      toast.error(language === 'bn' ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' : 'Registration failed', {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP Input Changes & Paste
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
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

    if (clean && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error(
        language === 'bn'
          ? '৬-সংখ্যার কোডটি সম্পূর্ণ লিখুন'
          : 'Please enter the complete 6-digit code'
      );
      return;
    }

    setIsVerifying(true);
    try {
      await authApi.verifyOtp({
        email: registeredEmail,
        otp: otpCode,
      });

      toast.success(
        language === 'bn' ? 'ইমেইল যাচাই সফল হয়েছে!' : 'Email verified successfully!',
        {
          description:
            language === 'bn'
              ? 'আপনার অ্যাকাউন্ট সক্রিয় হয়েছে। এবার পাসওয়ার্ড দিয়ে লগইন করুন।'
              : 'Your account is active. Please log in with your credentials.',
        }
      );

      // Redirect to login page with pre-filled email (NO auto-login)
      router.push(`/login?email=${encodeURIComponent(registeredEmail)}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Invalid or expired verification code';
      toast.error(
        language === 'bn' ? 'ভেরিফিকেশন ব্যর্থ হয়েছে' : 'Verification failed',
        {
          description: msg,
        }
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    try {
      await authApi.resendVerificationOtp({ email: registeredEmail });
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
      toast.success(
        language === 'bn' ? 'নতুন কোড পাঠানো হয়েছে' : 'New code sent',
        {
          description:
            language === 'bn'
              ? `আপনার ইমেইলে (${registeredEmail}) নতুন কোড পাঠানো হয়েছে।`
              : `A new verification code was sent to ${registeredEmail}`,
        }
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to resend code';
      toast.error(language === 'bn' ? 'কোড পাঠানো যায়নি' : 'Resend failed', {
        description: msg,
      });
    } finally {
      setIsResending(false);
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
        <Link
          href="/"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Home
        </Link>
      </div>

      {step === 1 ? (
        <>
          {/* Header matching reference design */}
          <div className="mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {language === 'bn' ? 'নতুন অ্যাকাউন্ট' : 'START FOR FREE'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
              {language === 'bn' ? 'অ্যাকাউন্ট খুলুন' : 'Create Account'}
            </h1>
            <p className="mt-0.5 text-xs text-zinc-400">
              {language === 'bn'
                ? 'শুরু করতে আপনার সঠিক তথ্য প্রদান করুন।'
                : 'Enter your details to get started.'}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    {passwordStrength === 1 &&
                      (language === 'bn' ? 'দুর্বল পাসওয়ার্ড' : 'Weak password')}
                    {passwordStrength === 2 &&
                      (language === 'bn' ? 'মোটামুটি পাসওয়ার্ড' : 'Medium password')}
                    {passwordStrength === 3 &&
                      (language === 'bn' ? 'শক্তিশালী পাসওয়ার্ড' : 'Strong password')}
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
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              <label
                htmlFor="terms"
                className="text-[11px] text-zinc-500 dark:text-zinc-400 cursor-pointer leading-tight"
              >
                {t('auth.agreeTerms')}{' '}
                <Link
                  href="/terms"
                  className="font-semibold text-zinc-800 hover:underline dark:text-zinc-200"
                >
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
                <span className="px-3 bg-white dark:bg-zinc-900 text-zinc-400 font-semibold">
                  {t('auth.orSignUpWith')}
                </span>
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
            <Link
              href="/login"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              {t('auth.signIn')}
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 mb-4 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {language === 'bn' ? 'তথ্য পরিবর্তন করুন' : 'Back to details'}
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {language === 'bn' ? 'ভেরিফিকেশন' : 'VERIFICATION'}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                  {language === 'bn' ? 'ইমেইল ভেরিফাই করুন' : 'Verify Your Email'}
                </h1>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {language === 'bn'
                ? `আমরা ${registeredEmail} ঠিকানায় একটি ৬-সংখ্যার কোড পাঠিয়েছি। কোডটি নিচে লিখে আপনার অ্যাকাউন্ট সক্রিয় করুন:`
                : `We sent a 6-digit code to ${registeredEmail}. Enter it below to activate your account:`}
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
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
                  className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center text-xl font-bold text-zinc-900 dark:text-zinc-100 transition-all focus:border-zinc-900 dark:focus:border-blue-500 focus:bg-zinc-50 dark:focus:bg-zinc-800/80 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 dark:focus:ring-blue-500/20 shadow-xs"
                />
              ))}
            </div>

            {/* Verify Email Button */}
            <button
              type="submit"
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full py-3.5 px-6 rounded-full bg-[#1c2b6e] hover:bg-[#142055] text-white font-bold text-xs sm:text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1c2b6e] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 text-white" />
                  <span>
                    {language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying Email...'}
                  </span>
                </>
              ) : (
                <>
                  <span>{language === 'bn' ? 'ইমেইল যাচাই করুন' : 'VERIFY EMAIL'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Resend Code Section */}
            <div className="text-center pt-2">
              {resendTimer > 0 ? (
                <p className="text-xs text-zinc-400">
                  {language === 'bn'
                    ? `${resendTimer} সেকেন্ড পর আবার পাঠাতে পারবেন`
                    : `Resend code in ${resendTimer}s`}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isResending && <RefreshCw className="animate-spin h-3.5 w-3.5" />}
                  <span>{language === 'bn' ? 'নতুন কোড পাঠান' : 'Resend Code'}</span>
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
