"use client";

import PageHeader from "@/components/pageHeader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "@/lib/axios";
import Loading from "@/components/ui/loading";
import LeaveBalanceCarousel from "./_components/LeaveBalanceCarousel";
import LeaveRequestTable from "./_components/LeaveRequestTable";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import EmptyState from "@/components/empty-state";

export default function LeaveOverviewPage() {
  const { data: session } = useSession();
  const axiosInstance = useAxiosAuth();

  const router = useRouter();

  const {
    data: leaveBalance = [],
    isLoading: loadingBalance,
    isError: errorBalance,
  } = useQuery({
    queryKey: ["leave-balance", session?.user.id],
    enabled: !!session?.user.id,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/leave-balance/employee/${session?.user.id}`
      );
      return res.data.data;
    },
  });

  const {
    data: leaveRequests = [],
    isLoading: loadingRequests,
    isError: errorRequests,
  } = useQuery({
    queryKey: ["leaveRequests", session?.user.id],
    enabled: !!session?.user.id,
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/leave-request/employee/${session?.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.backendTokens?.accessToken}`,
            },
          }
        );
        return res.data.data;
      } catch (err) {
        if (isAxiosError(err)) return [];
        throw err;
      }
    },
  });

  if (loadingBalance || loadingRequests) return <Loading />;
  if (errorBalance || errorRequests)
    return <p className="text-red-500">Error loading data. Try again.</p>;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leave Overview"
        description="View your leave balances and request history."
      >
        <Button onClick={() => router.push("/dashboard/leave/request")}>
          + New Request
        </Button>
      </PageHeader>

      {!leaveBalance || Object.keys(leaveBalance).length === 0 ? (
        <EmptyState
          title="No Leave Balance Found"
          description="It seems like you have no leave balances at the moment. You can request leave to start the process."
          image={"/undraw/onboarding.svg"}
        />
      ) : (
        <>
          <LeaveBalanceCarousel balance={leaveBalance} />
          <LeaveRequestTable data={leaveRequests} />
        </>
      )}
    </div>
  );
}
