import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/server/provider/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/server/provider/nextAuthProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Centa Payroll - ESS",
  description: "Employee Self Service Portal for Centa Payroll",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <AuthProvider>
            <ReactQueryProvider>
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    Loading...
                  </div>
                }
              >
                {children}
              </Suspense>
              <Toaster />
            </ReactQueryProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
