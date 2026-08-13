import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gadget BD - Apple Accessories Retailer Online Shopping in BD",
  description: "Bangladesh's trusted online store for genuine Apple accessories, MacBooks, iPhones, iPads, and premium tech gadgets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="bottom-center" richColors toastOptions={{ style: { fontSize: "13px" } }} />
      </body>
    </html>
  );
}
