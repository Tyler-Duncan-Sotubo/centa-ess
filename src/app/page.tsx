"use client";

import ApplicationLogo from "@/components/ui/applicationLogo";
import LoginForm from "./auth/login/page";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex flex-grow items-center justify-center w-full overflow-auto">
        <div className="sm:w-[35%] w-full max-h-full p-5">
          <ApplicationLogo
            className="w-34 h-20 mx-auto mb-6"
            src="/logo.png"
            alt="website logo"
            link="/"
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
