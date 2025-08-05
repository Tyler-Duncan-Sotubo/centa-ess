"use client";

import { ReactNode, useEffect, useState } from "react";
import ApplicationLogo from "@/components/ui/applicationLogo";
import { useSession } from "next-auth/react";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import Sidebar from "@/components/navigation/Sidebar";
import Navbar from "@/components/navigation/navbar";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MobileNav from "@/components/navigation/MobileNav";

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.replace("/auth/login");
    } else if (session && session.user.employmentStatus === "onboarding") {
      router.replace("/auth/login");
    }
  }, [session, status, router]);

  if (status === "loading") return <Loading />;
  if (!session) return null;

  // Default layout
  return (
    <div className="flex">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <main
        className={`bg-white min-h-screen transition-all ease-in-out duration-500 w-full ${
          sidebarCollapsed
            ? "md:ml-[4rem] md:w-[calc(100%-4rem)]"
            : "md:ml-[16%] md:w-[calc(100%-16%)]"
        }`}
      >
        {/* Desktop Header */}
        <Navbar sidebarCollapsed={sidebarCollapsed} />

        {/* Mobile Header */}
        <header className="flex justify-between items-center px-1 md:hidden">
          <ApplicationLogo
            className="h-16 w-28"
            src="/logo.png"
            alt="website logo"
            link="/dashboard"
          />

          <MobileNav />
        </header>

        <ScrollToTop />
        <div className="sm:mt-[10vh] mt-[3vh] px-5 z-[9999]">{children}</div>
      </main>
    </div>
  );
}
