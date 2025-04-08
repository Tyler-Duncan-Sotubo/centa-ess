"use client";

import SalaryDetails from "./_components/SalaryDetails";
import PayslipPage from "./_components/PayslipDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { PayrollRecord } from "@/types/payroll.type";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/loading";
import PageHeader from "@/components/common/PageHeader";

const Salary = () => {
  const { data: session } = useSession();

  const fetchPayslipSummary = async (id: string | undefined) => {
    const res = await fetch(`/api/payroll/employee-payslip-summary/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch company data");
    }
    const data = await res.json();
    return data.data.data;
  };

  const fetchPayGroup = async () => {
    const res = await fetch("/api/company/pay-groups");
    if (!res.ok) {
      throw new Error("Failed to fetch company data");
    }
    const data = await res.json();
    return data.data.data;
  };

  const fetchSalaryBreakdown = async () => {
    const res = await fetch("/api/payroll/salary-breakdown");
    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }
    const data = await res.json();
    return data.data.data;
  };

  const {
    data: salaryBreakdown,
    isLoading: loadingSalary,
    isError: errorSalary,
  } = useQuery({
    queryKey: ["salaryBreakdown"],
    queryFn: fetchSalaryBreakdown,
  });

  const {
    data: payGroup,
    isLoading: loadingPayGroup,
    isError: errorPayGroup,
  } = useQuery({
    queryKey: ["payrollGroup"],
    queryFn: fetchPayGroup,
  });

  const {
    data: payrollSummary,
    isLoading: loadingPayroll,
    isError: errorPayroll,
  } = useQuery({
    queryKey: ["payrollSummary", session?.user?.id],
    queryFn: async () =>
      (await fetchPayslipSummary(session?.user?.id)) as PayrollRecord[],
    enabled: !!session?.user?.id,
  });

  if (loadingSalary || loadingPayGroup || loadingPayroll) return <Loading />;
  if (errorSalary || errorPayGroup || errorPayroll)
    return <div>Error loading payroll data</div>;

  return (
    <>
      <PageHeader
        title="Salary & Payslips"
        description="View your salary details and payslips here. You can also download your payslips."
      />
      <Tabs defaultValue="salary" className="my-6">
        <TabsList>
          <TabsTrigger value="salary">Salary Details</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
        </TabsList>
        <TabsContent value="salary">
          <SalaryDetails
            payGroup={payGroup}
            salaryBreakdown={salaryBreakdown}
          />
        </TabsContent>
        <TabsContent value="payslips">
          <PayslipPage
            salaryBreakdown={salaryBreakdown}
            payslips={payrollSummary}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Salary;
