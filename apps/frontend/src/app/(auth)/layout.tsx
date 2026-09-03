import { AuthSidePanel } from "@/features/auth/components/auth-side-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#eef1f6] dark:bg-zinc-950">
      {/* Centered Floating Card with Shadow matching reference image */}
      <div className="relative w-full max-w-[860px] min-h-[480px] lg:min-h-[500px] bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18),0_0_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Form Section */}
        <div className="w-full lg:w-[54%] p-6 sm:p-8 lg:p-10 flex flex-col justify-center z-10">
          {children}
        </div>

        {/* Right: Slanted Dark Hero Panel */}
        <AuthSidePanel />
      </div>
    </main>
  );
}