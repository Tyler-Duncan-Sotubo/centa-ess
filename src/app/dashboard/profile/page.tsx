"use client";

import React from "react";
import UserProfile from "./UserProfile";
import { User } from "@/types/user.type";
import { fetchUserProfile } from "@/server/user";
import Loading from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";

const UserProfilePage = () => {
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
