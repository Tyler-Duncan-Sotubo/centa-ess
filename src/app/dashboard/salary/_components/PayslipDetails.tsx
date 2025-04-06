"use client";

import { PayrollSummaryPieChart } from "@/components/common/charts/PayrollSummaryPieChart";
import { Button } from "@/components/ui/button";
import { PayrollRecord } from "@/types/payroll.type";
import { ISalaryBreakdown } from "@/types/salary.type";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "date-fns";
import { Download } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";

const PayslipPage = ({
  payslips,
  salaryBreakdown,
}: {
  payslips: PayrollRecord[] | undefined;
  salaryBreakdown: ISalaryBreakdown;
}) => {
  const paidPayslips = payslips?.filter(
    (record) => record.paymentStatus === "paid"
  );

  const [selectedPayslip, setSelectedPayslip] = useState<string | null>(
    paidPayslips ? paidPayslips[0]?.payslip_id : null
  );

  const selectedPayslipDetails = paidPayslips?.find(
    (payslip) => payslip.payslip_id === selectedPayslip
  );

  const handlePayslipClick = (payslipId: string) => {
    setSelectedPayslip((prev) => (prev === payslipId ? null : payslipId));
  };

  return (
    <section className="mb-28">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section: List of Payslips */}
        <div className="md:w-1/3 w-full">
          <h2 className="font-semibold text-xl my-4">
            {paidPayslips && paidPayslips.length > 0
              ? "My Payslips"
              : "No Payslips Available"}
          </h2>
          <div className="space-y-4">
            {paidPayslips?.map((payslip) => (
              <div
                key={payslip.payslip_id}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handlePayslipClick(payslip.payslip_id)
                }
                onClick={() => handlePayslipClick(payslip.payslip_id)}
                className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
                  selectedPayslip === payslip.payslip_id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-md font-semibold text-brand">
                    {formatDate(new Date(payslip.payroll_date), "MMMM yyyy")}
                  </span>
                  <span className="text-md my-2">
                    Take Home: {formatCurrency(payslip.net_salary)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Payslip Details */}
        <div className="md:w-2/3 w-full">
          {selectedPayslipDetails ? (
            <PayslipDetails
              payslip={selectedPayslipDetails}
              salaryBreakdown={salaryBreakdown}
            />
          ) : payslips && payslips.length > 0 ? (
            "Select a payslip to view details"
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
};

// Extracted PayslipDetails Component
const PayslipDetails = ({
  payslip,
  salaryBreakdown,
}: {
  payslip: PayrollRecord;
  salaryBreakdown: ISalaryBreakdown;
}) => {
  const monthlyGross = payslip.gross_salary;

  const earnings = useMemo(() => {
    return {
      basic: monthlyGross * parseFloat(salaryBreakdown.basic) * 0.01,
      housing: monthlyGross * parseFloat(salaryBreakdown.housing) * 0.01,
      transport: monthlyGross * parseFloat(salaryBreakdown.transport) * 0.01,
      other_allowances: salaryBreakdown.allowances.reduce(
        (sum, { percentage }) =>
          sum + (monthlyGross * parseFloat(percentage)) / 100,
        0
      ),
    };
  }, [monthlyGross, salaryBreakdown]);

  const {
    gross_salary,
    totalDeduction,
    paye,
    pensionContribution,
    nhfContribution,
    salaryAdvance,
    payslip_pdf_url,
  } = payslip;

  const deductions = {
    paye,
    nhf: nhfContribution,
    salaryAdvance,
    total: totalDeduction,
  };

  return (
    <section className="p-4 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-10">
        <PayrollSummaryPieChart payrollData={payslip} />
        <div className="self-start">
          {payslip_pdf_url && (
            <Link
              href={payslip_pdf_url}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="font-semibold">
                <Download size={24} />
                Download Paystub
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Payslip Details */}
      <h2 className="font-semibold text-xl mb-4">Payslip Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Earnings</h4>
          <table className="w-full text-left border-collapse">
            <tbody>
              {Object.entries(earnings).map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="py-2 capitalize">{key.replace(/_/g, " ")}</td>
                  <td className="py-2 text-right">{formatCurrency(value)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-2">Monthly Gross</td>
                <td className="py-2 text-right">
                  {formatCurrency(gross_salary)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Deductions</h4>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2">Employee Pension</td>
                <td className="py-2 text-right">
                  {formatCurrency(pensionContribution)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">PAYE Tax</td>
                <td className="py-2 text-right">
                  {formatCurrency(deductions.paye)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">NHF Contribution</td>
                <td className="py-2 text-right">
                  {formatCurrency(deductions.nhf)}
                </td>
              </tr>
              <tr className="font-bold">
                <td className="py-2">Total Deductions</td>
                <td className="py-2 text-right">
                  {formatCurrency(deductions.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PayslipPage;
