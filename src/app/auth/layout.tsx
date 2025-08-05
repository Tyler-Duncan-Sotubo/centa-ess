"use client";

import ApplicationLogo from "@/components/ui/applicationLogo";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col h-screen">
      <div className="flex flex-grow items-center justify-center w-full bg-white">
        <div className="sm:w-[35%] w-full max-h-full p-5">
          <ApplicationLogo
            className="w-32 h-16 mx-auto mb-6"
            src="/logo.png"
            alt="website logo"
            link="/"
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
