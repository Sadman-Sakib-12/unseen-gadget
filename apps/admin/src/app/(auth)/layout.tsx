export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main role="main" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f0ff] via-[#f8fafc] to-[#e6fffa] p-4">
      <div className="w-full max-w-lg">
        {children}
      </div>
    </main>
  );
}
