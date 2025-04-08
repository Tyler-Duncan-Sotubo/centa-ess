"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import ApplicationLogo from "@/components/ui/applicationLogo";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="md:ml-[18%] md:mb-0 w-full p-6 bg-white min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center mb-2 md:hidden">
          <ApplicationLogo
            className="h-16 w-32"
            src="/logo.png"
            alt="website logo"
            link="/dashboard"
          />

          <LogOut
            size={25}
            onClick={() =>
              signOut({
                callbackUrl: "/auth/login",
                redirect: true,
              })
            }
            className="text-brand cursor-pointer"
          />
        </header>
        {children}
      </main>
    </div>
  );
}
