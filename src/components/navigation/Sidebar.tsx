"use client";

import React, { useState } from "react";
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
import { FaChevronDown } from "react-icons/fa";

export default function Sidebar({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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
              const isParentActive =
                pathname.startsWith(item.link) &&
                item.subItems &&
                pathname !== item.link;

              const icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;

              // Read open/close state from object
              const isOpen = openMenus[item.title] || false;

              return (
                <div key={item.title} className="w-full">
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      {hasSubItems ? (
                        <button
                          onClick={() => handleToggle(item.title)}
                          className={`flex w-full items-center justify-between px-3 py-2 rounded transition-colors ${
                            isActive || isParentActive
                              ? "text-monzo-monzoGreen font-semibold"
                              : "hover:bg-monzo-brand"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {icon}
                            {!isCollapsed && (
                              <span className="text-md">{item.title}</span>
                            )}
                          </div>
                          {!isCollapsed && (
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FaChevronDown size={16} />
                            </motion.div>
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.link ?? "#"}
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded transition-colors ${
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
                      )}
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    )}
                  </Tooltip>

                  {/* Subitems */}
                  {hasSubItems && !isCollapsed && (
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden ml-4"
                    >
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.link; // <-- move here!

                        return (
                          <Link
                            key={subItem.title}
                            href={subItem.link}
                            className={`py-2.5 px-3 text-sm rounded transition-colors flex gap-2 ${
                              isSubActive
                                ? "text-monzo-monzoGreen font-semibold"
                                : "hover:bg-monzo-brand"
                            }`}
                          >
                            {subItem.icon}
                            {subItem.title}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
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
