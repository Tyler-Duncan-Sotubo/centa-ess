"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/utils/formatCurrency";
import { IPayGroup } from "@/types/group.type";
import { ISalaryBreakdown } from "@/types/salary.type";
import Loading from "@/components/ui/loading";

const SalaryDetails = ({
  payGroup,
  salaryBreakdown,
}: {
  payGroup: IPayGroup[];
  salaryBreakdown: ISalaryBreakdown;
}) => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  const userGroup = payGroup.find(
    (group) => group.id === session?.user.group_id
  );
  const annualGross = session?.user.annual_gross;
  const monthlyGross = (annualGross ?? 0) / 12;

  const earnings: { [key: string]: number } = {
    basic: (monthlyGross * parseFloat(salaryBreakdown.basic)) / 100,
    housing: (monthlyGross * parseFloat(salaryBreakdown.housing)) / 100,
    transport: (monthlyGross * parseFloat(salaryBreakdown.transport)) / 100,
  };

  salaryBreakdown.allowances.forEach(({ type, percentage }) => {
    const key = type.toLowerCase().replace(/\s+/g, "_");
    earnings[key] = (monthlyGross * parseFloat(percentage)) / 100;
  });

  const payeRate = 0.05;
  const nhfRate = 0.025;
  const employeePensionRate = 0.08;

  const deductions = {
    paye: userGroup?.apply_paye ? monthlyGross * payeRate : 0,
    pension: userGroup?.apply_pension ? monthlyGross * employeePensionRate : 0,
    nhf:
      userGroup?.apply_nhf && session?.user.apply_nhf
        ? monthlyGross * nhfRate
        : 0,
    total: 0,
  };

  deductions.total = deductions.paye + deductions.pension + deductions.nhf;
  const netSalary = monthlyGross - deductions.total;

  const SideDetails = ({
    color,
    name,
    figure,
  }: {
    color: string;
    name: string;
    figure: number;
  }) => (
    <div className="flex items-center gap-3">
      <div
        style={{ backgroundColor: `hsl(var(--chart-${color}))` }}
        className="h-10 w-1 rounded-lg"
      />
      <div>
        <p className="text-sm">{name}</p>
        <p className="text-lg font-semibold">{formatCurrency(figure)}</p>
      </div>
    </div>
  );

  return (
    <section className="mt-6 mb-28">
      {/* Salary Overview */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">
            Monthly Gross: {formatCurrency(monthlyGross)}
          </h3>
          <p className="text-sm text-textSecondary">
            Annual Gross: {formatCurrency(annualGross ?? 0)}
          </p>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SideDetails color="2" name="Net Salary" figure={netSalary} />
          <SideDetails
            color="1"
            name="Total Deductions"
            figure={deductions.total}
          />
        </div>

        {/* Earnings & Deductions Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Earnings Section */}
          <div>
            <h4 className="text-xl my-4 font-semibold">Salary Breakdown</h4>
            <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
              {Object.entries(earnings).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between text-sm sm:text-base"
                >
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="font-semibold">{formatCurrency(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deductions Section */}
          <div>
            <div className="mb-5">
              <h4 className="text-xl font-semibold">Estimated Deductions</h4>
              <h5 className="text-sm">
                Note: This is an estimate and may vary based on your tax
                obligations.
              </h5>
            </div>
            <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
              {Object.entries(deductions)
                .filter(([key]) => key !== "total")
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between text-sm sm:text-base"
                  >
                    <span>
                      {key === "paye"
                        ? "PAYE"
                        : key === "nhf"
                        ? "NHF"
                        : "Pension"}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(value)}
                    </span>
                  </div>
                ))}
              <div className="w-full h-0.5 bg-divider my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total Deductions</span>
                <span>{formatCurrency(deductions.total)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default SalaryDetails;
