"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import ApplicationLogo from "@/components/ui/applicationLogo";
import { LogOut } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
          />

          <LogOut
            size={25}
            onClick={() => handleLogout()}
            className="text-brand cursor-pointer"
          />
        </header>
        {children}
      </main>
    </div>
  );
}
