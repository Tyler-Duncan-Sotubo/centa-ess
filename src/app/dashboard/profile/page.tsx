"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HistoryCard } from "./_components/personal/HistoryCard";
import { CertificationsCard } from "./_components/personal/CertificationsCard";
import { FamilyCard } from "./_components/personal/FamilyCard";
import { CompensationCard } from "./_components/jobs/CompensationCard";
import { FinancialsCard } from "./_components/jobs/FinancialsCard";
import { EmploymentDetailsCard } from "./_components/jobs/EmploymentDetailsCard";
import Loading from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "@/lib/axios";
import { useSession } from "next-auth/react";
import PayslipDetailsTable from "./_components/PayslipDetails";
import { ProfileCard } from "./_components/personal/ProfileCard";
import PageHeader from "@/components/pageHeader";
import useAxiosAuth from "@/hooks/useAxiosAuth";

const EmployeeDetailPageDemo = () => {
  const { data: session, status } = useSession();
  const axiosInstance = useAxiosAuth();

  const fetchEmployee = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/employees/${session?.user.id}/full`
      );
      return res.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return [];
      }
    }
  };
  // Fetch employee data if we're editing an existing employee
  const { data, isLoading, isError } = useQuery({
    queryKey: ["employee", session?.user.id],
    queryFn: fetchEmployee,
    enabled: !!session?.backendTokens.accessToken && !!session?.user.id,
  });

  // While either the session or employee data is loading, show loading state
  if (status === "loading" || isLoading) return <Loading />;
  if (isError) return <p>Error loading data</p>;

  return (
    <div className="space-y-6 mb-20">
      <PageHeader
        title="My Profile"
        description="View and manage employee details, job information, payroll, and more."
      />
      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="bg-sidebar rounded-md p-1">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="job">Job</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        {/* Personal Info */}
        <TabsContent value="personal" className="space-y-6">
          <ProfileCard
            profile={data.profile}
            core={data.core}
            avatarUrl={data.avatarUrl}
          />
          <HistoryCard
            history={data.history}
            employeeId={session?.user.id as string}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FamilyCard
              family={data.dependents}
              employeeId={session?.user.id as string}
            />
            <CertificationsCard
              certifications={data.certifications}
              employeeId={session?.user.id as string}
            />
          </div>
        </TabsContent>
        <TabsContent value="job" className="space-y-6">
          <EmploymentDetailsCard
            details={data.core}
            employeeId={session?.user.id as string}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <CompensationCard
              compensations={data.compensation}
              employeeId={session?.user.id as string}
            />
            <FinancialsCard
              financials={data.finance}
              employeeId={session?.user.id as string}
            />
          </div>
        </TabsContent>
        {/* Payroll */}
        <TabsContent value="payroll">
          <PayslipDetailsTable payslipSummary={data.payslipSummary} />
        </TabsContent>
        {/* Documents */}
        <TabsContent value="documents"></TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetailPageDemo;
