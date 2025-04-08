"use client";

import React from "react";
import UserProfile from "./UserProfile";
import { User } from "@/types/user.type";
import Loading from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";

const UserProfilePage = () => {
  const fetchUserProfile = async () => {
    const res = await fetch(`/api/profile`);
    if (!res.ok) {
      throw new Error("Failed to fetch company data");
    }
    const data = await res.json();
    return data.data;
  };

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading data</p>;

  return <UserProfile user={user} />;
};

export default UserProfilePage;
