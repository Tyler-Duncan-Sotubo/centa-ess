"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";

// 🔹 Define User Type
interface User {
  id: string;
  company_name: string;
  email: string;
  job_title: string;
  last_login: string;
  first_name: string;
  last_name: string;
  annual_gross: number;
  group_id: string;
  avatar: string;
  apply_nhf: boolean;
}

// 🔹 Define Context Type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Fetch Authenticated User and Save to Local Storage
  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employee-active`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user"); // ✅ Clear storage on failure
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch user on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {}); // Call API to log out
      localStorage.removeItem("user"); // ✅ Clear storage on failure
      setUser(null); // Clear user state
      router.replace("/auth/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook for using Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
