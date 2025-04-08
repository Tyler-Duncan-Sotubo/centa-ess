"use client";

import { Home, LogOut, User, Coins, Banknote, HandCoins } from "lucide-react";
import Link from "next/link";
import ApplicationLogo from "../ui/applicationLogo";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  return (
    <div className="flex">
      {/* Static Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col bg-white shadow-md h-screen w-[18%] pl-6 pt-3 pb-10 fixed left-0 top-0">
        {/* Profile Section */}

        <ApplicationLogo
          className="h-20 w-32"
          src="/logo.png"
          alt="website logo"
          link="/dashboard"
        />

        <p className="mb-2 text-muted-foreground uppercase text-sm">Menu</p>

        {/* Navigation Links */}
        <NavItem href="/dashboard" icon={<Home size={24} />} label="Home" />
        <NavItem
          href="/dashboard/profile"
          icon={<User size={24} />}
          label="Profile"
        />
        <NavItem
          href="/dashboard/employee"
          icon={<Banknote size={24} />}
          label="Financials"
        />
        <NavItem
          href="/dashboard/salary"
          icon={<Coins size={24} />}
          label="Salary Details"
        />
        <NavItem
          href="/dashboard/salary-advance"
          icon={<HandCoins size={24} />}
          label="Loans"
        />

        {/* Settings & Logout (at the bottom) */}
        <div className="mt-auto mb-6 pl-3">
          <Link
            href=""
            className=" text-red-500 flex gap-2 text-lg"
            onClick={() => {
              signOut({
                callbackUrl: "/auth/login",
                redirect: true,
              });
            }}
          >
            <LogOut size={24} />
            <span className="text-md">Logout</span>
          </Link>
        </div>
      </aside>

      <>
        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-md border-t flex justify-around items-center py-1 md:hidden">
          <NavItem href="/dashboard" icon={<Home size={24} />} label="Home" />
          <NavItem
            href="/dashboard/salary"
            icon={<Coins size={24} />}
            label="Salary"
          />
          <NavItem
            href="/dash board/salary-advance"
            icon={<HandCoins size={24} />}
            label="Loan"
          />
          <NavItem
            href="/dashboard/employee"
            icon={<Banknote size={24} />}
            label="Financials"
          />
          <NavItem
            href="/dashboard/profile"
            icon={<User size={24} />}
            label="Profile"
          />
        </nav>
      </>
    </div>
  );
}
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}
// Reusable Navigation Item Component
function NavItem({ href, icon, label }: NavItemProps) {
  const currentPath = usePathname();
  const isActive = currentPath === href;
  return (
    <Link
      href={href}
      className={`flex flex-col items-center px-3 py-2 gap-2 md:flex-row md:my-1 md:rounded-l-full font-medium text-gray-700 ${
        isActive ? "md:bg-brand md:text-white text-brand " : ""
      }`}
    >
      <span
        className={`text-md md:text-lg ${
          isActive ? "text-brand md:text-white" : "text-gray-700"
        }`}
      >
        {icon}
      </span>
      <span className="text-xs md:text-md mt-1">{label}</span>
    </Link>
  );
}
