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
          <div className="flex items-center sm:px-3 h-14 my-6">
            <ApplicationLogo
              className={isCollapsed ? "h-14 w-8" : "h-14 w-24"}
              src={isCollapsed ? "/logo-icon.png" : "/logo-white.png"}
              alt="Company Logo"
              link="/dashboard"
            />
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
                      {!isCollapsed && (
                        <span className="text-md">{item.title}</span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
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
