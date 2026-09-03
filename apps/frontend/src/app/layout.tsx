import type { Metadata, Viewport } from "next";
import { Open_Sans, Noto_Sans_Bengali } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { StorefrontShell } from "@/components/storefront-shell";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { GoogleTranslate } from "@/components/google-translate";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gadget BD - Apple Accessories Retailer Online Shopping in BD",
  description: "Bangladesh's trusted online store for genuine Apple accessories, MacBooks, iPhones, iPads, and premium tech gadgets.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#182C61",
};

import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/hooks/use-theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${bengali.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <AuthSessionProvider>
          <QueryProvider>
            <ThemeProvider>
              <LanguageProvider>
                <StorefrontShell>{children}</StorefrontShell>
                <Toaster position="bottom-center" richColors toastOptions={{ style: { fontSize: "13px" } }} />
                <GoogleTranslate />
              </LanguageProvider>
            </ThemeProvider>
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
