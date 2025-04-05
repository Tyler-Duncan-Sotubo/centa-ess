"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPayslipSummary } from "@/server/payroll";
import { PayrollRecord } from "@/types/payroll.type";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayrollSummaryPieChart } from "@/components/common/charts/PayrollSummaryPieChart";
import { formatDate } from "date-fns";
import { ArrowRight, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Loading from "@/components/ui/loading";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    data: payrollSummary,
    isLoading: loadingPayroll,
    isError: errorPayroll,
  } = useQuery({
    queryKey: ["payrollSummary", user?.id],
    queryFn: async () =>
      (await fetchPayslipSummary(user?.id)) as PayrollRecord[],
  });

  if (loadingPayroll) return <Loading />;
  if (errorPayroll) return <div>Error loading payroll data</div>;

  return (
    <section className="mt-4 mb-28">
      {/* Greeting Section */}
      <div className="shadow-md rounded-xl">
        <div className="bg-brand text-white p-5 rounded-t-md">
          <h2 className="text-2xl font-semibold mb-1">
            Welcome to {user?.company_name}&apos;s ESS
          </h2>
          <p className="w-full md:w-1/2 text-sm md:text-base">
            View payroll summary, update profile, request salary advance, and
            more.
          </p>
        </div>

        <div className="bg-white p-5 rounded-b-md flex flex-col md:flex-row md:justify-between">
          <div className="flex  space-x-3">
            <Image
              src={user?.avatar || "/user-thumbnail.png"}
              alt="User Avatar"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div className="md:text-left">
              <h2 className="text-xl md:text-2xl font-semibold mb-1">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="font-medium text-textSecondary capitalize">
                {user?.job_title} at {user?.company_name}
              </p>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="mt-4 md:mt-0">
              Update Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex flex-col md:flex-row w-full space-y-8 md:space-x-8 my-10">
        {/* Payroll Summary Section */}
        <div className="w-full md:w-2/3">
          {(payrollSummary ?? []).length > 0 ? (
            <div className="shadow-sm rounded-md p-4 bg-white">
              <div className="flex items-center mb-6">
                <Banknote size={24} className="mr-2" />
                <p className="text-lg md:text-xl font-bold">Your Payslips</p>
              </div>

              <Tabs defaultValue={payrollSummary?.[0]?.payroll_date}>
                <TabsList className="flex gap-2 mb-3 md:text-sm ">
                  {payrollSummary?.map((record) => (
                    <TabsTrigger
                      key={record.payslip_id}
                      value={record.payroll_date}
                      className="text-[.9rem] md:text-base"
                    >
                      {formatDate(
                        new Date(`${record.payroll_date}-01`),
                        "MMMM yyyy"
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {payrollSummary?.map((record) => (
                  <TabsContent
                    key={record.payslip_id}
                    value={record.payroll_date}
                  >
                    <PayrollSummaryPieChart payrollData={record} />
                  </TabsContent>
                ))}
              </Tabs>

              <div className="text-center mt-4">
                <div className="w-full h-0.5 bg-divider my-2" />
                <Link href="/dashboard/salary">
                  <Button variant="link">
                    View Payslips
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-lg p-6 bg-white shadow-md text-center">
              <h2 className="text-xl md:text-2xl font-semibold">
                No Payroll Data
              </h2>
              <p className="text-md md:text-lg text-gray-600">
                No payroll data available.
              </p>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-500">
                  Please update your bank details and tax information.
                </p>
                <Link href="/dashboard/profile">
                  <Button className="mt-4">Update Profile</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white shadow-md rounded-md p-4">
            <p className="text-sm md:text-md text-gray-500">
              Please ensure your bank details and tax information are up to
              date.
            </p>
            <Link href="/dashboard/employee">
              <Button className="mt-4 w-full md:w-auto">
                Verify Bank Details
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-md p-4">
            <p className="text-md font-semibold text-gray-700">
              Need a Loan or Salary Advance?
            </p>
            <Link href="/dashboard/salary-advance">
              <Button className="mt-4 w-full md:w-auto">
                Request Salary Advance
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Dashboard;
