import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { WalletProvider } from "@/contexts/PrivyProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "UnRepo Dashboard - Developer API Portal",
  description: "Generate and manage your UnRepo API keys for chatbot and research services",
  icons: {
    icon: "/cropped_circle_image.png",
    apple: "/cropped_circle_image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <WalletProvider>
            <Navbar />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" />
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
