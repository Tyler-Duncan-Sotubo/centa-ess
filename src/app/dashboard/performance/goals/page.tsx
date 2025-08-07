"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FaTasks,
  FaCheck,
  FaClock,
  FaArchive,
  FaListUl,
  FaPlusCircle,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
// import GoalList from "./_components/GoalList";
import PageHeader from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import GoalModal from "./_components/GoalFormModal";
import Loading from "@/components/ui/loading";
// import { Input } from "@/components/ui/input";
import { TbTarget } from "react-icons/tb";
import GoalList from "./_components/GoalList";

export default function GoalsPage() {
  const [status, setStatus] = useState("published");
  const { data: session } = useSession();
  const axios = useAxiosAuth();
  const [open, setOpen] = useState(false);

  const {
    data: goals = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["goals", status],
    queryFn: async () => {
      const res = await axios.get(
        `/api/performance-goals/employee/${session?.user.id}?status=${status}`
      );
      return res.data.data;
    },
    enabled: !!session?.backendTokens.accessToken,
  });

  if (status === "loading" || isLoading) return <Loading />;
  if (isError) return <p>Error loading data</p>;

  return (
    <section className="space-y-8">
      <PageHeader
        title="Goals"
        description="Manage your performance goals effectively."
        icon={<TbTarget />}
      >
        <Button onClick={() => setOpen(true)}>
          <FaPlusCircle className="mr-2 w-4 h-4" /> Create Goal
        </Button>
      </PageHeader>

      <div className="flex  items-center gap-4 max-w-xl">
        {/* <Input
          placeholder="Search employee"
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="w-64"
          leftIcon={<FaListUl />}
        /> */}
      </div>

      <Tabs value={status} onValueChange={setStatus} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="published">
            <FaListUl className="mr-2 w-4 h-4 text-monzo-brandDark" />
            Active
            {goals.length > 0 && (
              <span className="ml-2 text-xs bg-monzo-brandDark text-white px-1 rounded">
                {goals.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="incomplete">
            <FaTasks className="mr-2 w-4 h-4 text-monzo-secondary" />
            Incomplete
          </TabsTrigger>
          <TabsTrigger value="completed">
            <FaCheck className="mr-2 w-4 h-4 text-monzo-error" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="overdue">
            <FaClock className="mr-2 w-4 h-4 text-monzo-success" />
            Overdue
          </TabsTrigger>
          <TabsTrigger value="archived">
            <FaArchive className="mr-2 w-4 h-4 text-monzo-monzoGreen" />
            Archived
          </TabsTrigger>
        </TabsList>

        {/* TabsContent is technically not required here since we’re filtering inline */}
        <div>
          {isLoading ? (
            <div className="space-y-2 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <GoalList goals={goals} />
          )}
        </div>
      </Tabs>
      <GoalModal open={open} setOpen={setOpen} />
    </section>
  );
}
