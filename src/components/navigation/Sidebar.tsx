"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { main } from "@/data/sidebar.data";
import ApplicationLogo from "../ui/applicationLogo";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  TbLayoutSidebarRightCollapseFilled,
  TbLayoutSidebarLeftCollapseFilled,
} from "react-icons/tb";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function Sidebar({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      {/* Mobile Hamburger Menu */}

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? "4rem" : "16%" }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex fixed left-0 top-0 h-screen bg-monzo-background text-monzo-textPrimary border-r p-2 flex-col justify-between overflow-hidden"
      >
        <div>
          <div className="flex items-center justify-center h-14 mb-4">
            {!isCollapsed && (
              <ApplicationLogo
                className="h-14 w-28"
                src="/logo.png"
                alt="Company Logo"
                link="/dashboard"
              />
            )}
          </div>

          <nav className="space-y-2">
            {main.map((item) => {
              const isActive = pathname === item.link;
              const icon = item.icon;

              return (
                <Tooltip key={item.title} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.link ?? "#"}
                      className={`flex w-full items-center gap-2 px-3 py-2 rounded ${
                        isActive
                          ? "text-monzo-monzoGreen font-semibold"
                          : "hover:bg-monzo-brand"
                      }`}
                    >
                      {icon}
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-2 rounded text-monzo-textPrimary hover:bg-monzo-brand"
            >
              {!isCollapsed ? (
                <>
                  <MdLogout size={20} />
                  <span className="material-symbols-outlined text-base">
                    Logout
                  </span>
                </>
              ) : (
                <div>
                  <MdLogout size={20} />
                </div>
              )}
            </button>
          </nav>
        </div>

        <div className="flex justify-end px-2 pb-2">
          <button
            onClick={onToggle}
            className="p-2 rounded text-monzo-textPrimary hover:bg-monzo-brand"
          >
            {isCollapsed ? (
              <TbLayoutSidebarRightCollapseFilled size={20} />
            ) : (
              <TbLayoutSidebarLeftCollapseFilled size={25} />
            )}
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
