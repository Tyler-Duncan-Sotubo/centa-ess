"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/pageHeader";
import { DataTable } from "@/components/DataTable";
import { reimbursementsColumns } from "./_components/reimbursementsColumns";
import useAxiosAuth from "@/hooks/useAxiosAuth";

type Reimbursement = {
  id: string;
  purpose: string;
  category: string;
  amount: string;
  status: string;
  createdAt: string;
  receiptUrl?: string | null;
  paymentMethod: string;
  rejectionReason?: string | null;
};

export default function ReimbursementsPage() {
  const { data: session } = useSession();
  const axiosInstance = useAxiosAuth();
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const fetchReimbursements = async () => {
    const res = await axiosInstance.get(
      `/api/expenses/employee/${session?.user.id}`
    );
    return res.data.data as Reimbursement[];
  };

  const {
    data: reimbursements = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["reimbursements"],
    queryFn: fetchReimbursements,
    enabled: !!session?.backendTokens.accessToken,
  });

  const filtered = useMemo(() => {
    if (filter === "all") return reimbursements;
    return reimbursements.filter((r) => r.status.toLowerCase() === filter);
  }, [reimbursements, filter]);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="p-6">
        Error loading reimbursements.&nbsp;
        <Button variant="link" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Reimbursements"
        description="View and manage your reimbursement requests."
      >
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/reimbursements/request")}
        >
          + New Request
        </Button>
      </PageHeader>

      <Tabs value={filter} onValueChange={setFilter} className="my-6">
        <TabsList className="justify-start">
          {["all", "pending", "rejected", "paid"].map((f) => (
            <TabsTrigger key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DataTable columns={reimbursementsColumns} data={filtered} />
    </div>
  );
}
