export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left: Form Section */}
        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Right: Visual Section - Hidden on mobile */}
        <div className="hidden lg:flex lg:items-center lg:justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 relative overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img
              src="https://i.postimg.cc/qB3j4CD2/sakibal.png"
              alt="Unseen Gadget - Premium Tech Products"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
