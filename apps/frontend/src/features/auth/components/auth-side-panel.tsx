'use client';

import { usePathname } from 'next/navigation';
import { ShieldCheck, Truck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function AuthSidePanel() {
  const pathname = usePathname();
  const isRegister = pathname?.includes('/register');
  const isForgotPassword = pathname?.includes('/forgot-password');

  return (
    <div
      className="hidden lg:flex absolute top-0 bottom-0 right-0 w-[50%] bg-[#121620] text-white flex-col justify-between py-10 pl-14 pr-8 z-20 select-none overflow-hidden"
      style={{
        clipPath: 'polygon(16% 0, 100% 0, 100% 100%, 0% 100%)',
      }}
    >
      {/* Ambient background glow */}
      <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

      {/* Top: Mini Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/15 backdrop-blur-sm transition-transform group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <span className="text-sm font-extrabold tracking-tight text-white">
            Unseen<span className="text-blue-400">Gadget</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors bg-white/5 border border-white/10 rounded-full px-2.5 py-1 backdrop-blur-sm"
        >
          Storefront
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Center: Hero Typography matching reference image */}
      <div className="relative z-10 my-auto py-4">
        <div className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 mb-3">
          {isForgotPassword ? 'NEED HELP?' : isRegister ? 'HELLO THERE' : 'HELLO AGAIN'}
        </div>

        <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight uppercase">
          {isForgotPassword ? (
            <>
              RECOVER <br />
              <span>ACCESS!</span>
            </>
          ) : isRegister ? (
            <>
              JOIN US <br />
              <span>TODAY!</span>
            </>
          ) : (
            <>
              WELCOME <br />
              <span>BACK!</span>
            </>
          )}
        </h2>

        <p className="mt-4 text-xs xl:text-sm leading-relaxed text-zinc-400 max-w-xs font-normal">
          {isForgotPassword
            ? 'Reset your password and regain full access to your account in just a few clicks.'
            : 'Sign in to continue your journey and access everything waiting for you.'}
        </p>

        {/* Reference image accent line */}
        <div className="w-12 h-[2px] bg-white/40 mt-5 rounded-full" />

        {/* Compact trust perks */}
        <div className="mt-6 space-y-2 text-[11px] text-zinc-300 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>100% Genuine Apple & Flagship Tech</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Fast Nationwide Delivery in Bangladesh</span>
          </div>
        </div>
      </div>

      {/* Bottom: Minimalist note */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-white/5">
        <span>&copy; Unseen Gadget</span>
        <span className="text-zinc-600">Official Tech</span>
      </div>
    </div>
  );
}
