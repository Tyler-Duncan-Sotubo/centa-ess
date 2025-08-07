"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FaUsers,
  FaUserFriends,
  FaUser,
  FaUserTie,
  FaArchive,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/pageHeader";
import Loading from "@/components/ui/loading";
import { TbMessageCircle } from "react-icons/tb";
import FeedbackFormModal from "./_components/FeedbackFormModal";
import FeedbackTypeDropdown from "./_components/FeedbackTypeDropdown";
import FeedbackList from "./_components/FeedbackList";

type FeedbackType =
  | "self"
  | "peer"
  | "manager_to_employee"
  | "employee_to_manager"
  | "archived";

export default function FeedbackPage() {
  const [category, setCategory] = useState<FeedbackType | "all">("all");
  const { data: session } = useSession();
  const axios = useAxiosAuth();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedbackType>("self");

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["feedbacks", category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category !== "all") params.append("type", category);
      const res = await axios.get(
        `/api/feedback/employee/${session?.user.id}?${params.toString()}`
      );
      return res.data.data;
    },
    enabled: !!session?.backendTokens.accessToken,
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["feedback-settings"],
    queryFn: async () => {
      const res = await axios.get("/api/feedback/settings");
      return res.data.data;
    },
    enabled: !!session?.backendTokens?.accessToken,
  });

  if (isLoading || isLoadingSettings) return <Loading />;

  return (
    <section className="space-y-8">
      <PageHeader
        title="360° Feedback"
        description="Collect and manage feedback from all perspectives."
        icon={<TbMessageCircle />}
      >
        <div className="flex items-center space-x-2">
          <FeedbackTypeDropdown
            onSelect={(type) => {
              setSelectedType(type);
              setOpen(true);
            }}
            settings={settings}
            userRole={session?.user?.role || "employee"}
          />
        </div>
      </PageHeader>

      <Tabs
        value={category}
        onValueChange={(value) => setCategory(value as "all" | FeedbackType)}
        className="space-y-4 mt-6"
      >
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">
            <FaUsers className="mr-2 w-4 h-4 text-monzo-brandDark" />
            All
          </TabsTrigger>
          <TabsTrigger value="peer">
            <FaUserFriends className="mr-2 w-4 h-4 text-monzo-secondary" />
            Peer
          </TabsTrigger>
          <TabsTrigger value="self">
            <FaUser className="mr-2 w-4 h-4 text-monzo-error" />
            Self
          </TabsTrigger>
          <TabsTrigger value="employee_to_manager">
            <FaUser className="mr-2 w-4 h-4 text-monzo-success" />
            Employee
          </TabsTrigger>
          <TabsTrigger value="manager_to_employee">
            <FaUserTie className="mr-2 w-4 h-4 text-monzo-monzoGreen" />
            Manager
          </TabsTrigger>
          <TabsTrigger value="archived">
            <FaArchive className="mr-2 w-4 h-4 text-muted-foreground" />
            Archived
          </TabsTrigger>
        </TabsList>

        <div>
          {isLoading ? (
            <div className="space-y-2 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <FeedbackList feedbacks={feedbacks} />
          )}
        </div>
        <FeedbackFormModal
          open={open}
          setOpen={setOpen}
          type={
            selectedType as
              | "self"
              | "peer"
              | "manager_to_employee"
              | "employee_to_manager"
          }
        />
      </Tabs>
    </section>
  );
}
