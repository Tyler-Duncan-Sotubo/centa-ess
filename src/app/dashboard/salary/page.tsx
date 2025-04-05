"use client";

import SalaryDetails from "./_components/SalaryDetails";
import PayslipPage from "./_components/PayslipDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSalaryBreakdown } from "@/server/salary";
import { useQuery } from "@tanstack/react-query";
import { fetchPayGroup } from "@/server/group";
import { PayrollRecord } from "@/types/payroll.type";
import { fetchPayslipSummary } from "@/server/payroll";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/loading";
import PageHeader from "@/components/common/PageHeader";

const Salary = () => {
  const { user } = useAuth();
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
    queryKey: ["payrollSummary", user?.id],
    queryFn: async () =>
      (await fetchPayslipSummary(user?.id)) as PayrollRecord[],
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
