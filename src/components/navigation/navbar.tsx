"use client";

import React from "react";
import PushNotification from "./PushNotification";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

const Navbar = ({ sidebarCollapsed }: { sidebarCollapsed: boolean }) => {
  return (
    <div
      className={`fixed top-0 h-[7vh] bg-white z-50 px-4 transition-all duration-300 ease-in-out hidden sm:block ${
        sidebarCollapsed
          ? "md:left-[4rem] md:w-[calc(100%-4rem)]"
          : "md:left-[16%] md:w-[84%]"
      }`}
    >
      <div className="flex justify-end items-center h-full md:px-6 space-x-4">
        {/* Right Icons */}
        <PushNotification />
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 py-2 rounded text-monzo-error"
        >
          <MdLogout size={25} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
