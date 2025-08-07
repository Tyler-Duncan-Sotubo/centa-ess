/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/ui/loading";
import BackButton from "@/components/ui/back-button";
import EmployeeCard from "../_components/EmployeeCard";
import { GoalDetailsCard } from "../_components/GoalDetailsCard";
import GoalActionButtons from "../_components/GoalActionButtons";
import ActivityFeed from "../_components/ActivityFeed";
import { CommentSection } from "../_components/CommentSection";
import PageHeader from "@/components/pageHeader";
import { TbTarget } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";

interface Props {
  params: { id: string };
}

export default function GoalDetailPage({ params }: Props) {
  const { id } = params;
  const { data: session } = useSession();
  const axios = useAxiosAuth();

  const startGoal = useUpdateMutation({
    endpoint: `/api/performance-goals/${id}/publish`,
    successMessage: "Goal started successfully",
    refetchKey: "goal",
  });

  const { data: goal = [], isLoading } = useQuery({
    queryKey: ["goal", id],
    queryFn: async () => {
      const res = await axios.get(`/api/performance-goals/${id}`);
      return res.data.data;
    },
    enabled: !!session?.backendTokens.accessToken,
  });

  if (isLoading) return <Loading />;

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <BackButton
          href="/dashboard/performance/goals"
          className="mb-4"
          label="Back to Goals"
        />
        {goal.status !== "draft" && <GoalActionButtons goalId={id} />}
        {goal.status === "draft" && (
          <Button onClick={() => startGoal({})} className="flex items-center">
            <FaCheck className="mr-2 w-4 h-4" />
            Start Goal
          </Button>
        )}
      </div>

      <PageHeader
        title="Goal Details"
        icon={<TbTarget />}
        description="View and manage goal details"
      >
        <h2 className="text-lg font-semibold text-gray-700">Activities</h2>
      </PageHeader>

      {/* Goal Summary and Actions */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Left: Summary + Actions */}
        <div className="md:col-span-2 space-y-4">
          <EmployeeCard goal={goal} />
          <GoalDetailsCard goal={goal} />
          <CommentSection goalId={id} status={goal.status} />
        </div>

        {/* Right: Activity Feed */}
        <ActivityFeed goal={goal} />
      </div>
    </section>
  );
}
