"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import LoanModal from "./LoanModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Loan } from "@/types/loans.type";
import { formatCurrency } from "@/utils/formatCurrency";
import PageHeader from "@/components/common/PageHeader";

const LoansPage = ({
  loans,
  id,
}: {
  loans: Loan[] | undefined;
  id: string | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Memoized filtering to optimize performance
  const activeLoans = useMemo(
    () => loans?.filter((loan) => loan.status !== "paid"),
    [loans]
  );
  const inactiveLoans = useMemo(
    () => loans?.filter((loan) => loan.status === "paid"),
    [loans]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Salary Advance"
        description=" Request for a salary advance here. You can view your ongoing and settled salary advances below."
      />
      {/* Request Loan Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)} aria-label="Request Loan">
          <PlusCircle className="mr-2" /> Request
        </Button>
      </div>

      {/* Loan Modal */}
      <LoanModal isOpen={isOpen} onClose={() => setIsOpen(false)} id={id} />

      {/* Loan Tabs */}
      <Tabs defaultValue="active">
        <TabsList className="flex  gap-4 my-6">
          <TabsTrigger value="active">Ongoing</TabsTrigger>
          <TabsTrigger value="paid">Settled</TabsTrigger>
        </TabsList>

        {/* Active Loans */}
        <TabsContent value="active">
          <LoanTable loans={activeLoans} />
        </TabsContent>

        {/* Inactive (Paid) Loans */}
        <TabsContent value="paid">
          <LoanTable loans={inactiveLoans} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Loan Table Component (Responsive)
const LoanTable = ({ loans }: { loans: Loan[] | undefined }) => {
  return (
    <section>
      <h3 className="my-4 text-xl font-semibold">Records</h3>

      {/* Responsive Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full text-md">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="py-4">Name</TableHead>
              <TableHead className="py-4">Amount</TableHead>
              <TableHead className="py-4">Total Paid</TableHead>
              <TableHead className="py-4">Outstanding</TableHead>
              <TableHead className="py-4">Approval Status</TableHead>
              <TableHead className="py-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans?.length ? (
              loans.map((loan) => (
                <TableRow key={loan.loanId} className="hover:bg-gray-50">
                  <TableCell className="py-4">{loan.name}</TableCell>
                  <TableCell className="py-4">
                    {formatCurrency(Number(loan.amount))}
                  </TableCell>
                  <TableCell className="py-4">
                    {formatCurrency(Number(loan.totalPaid))}
                  </TableCell>
                  <TableCell className="py-4">
                    {formatCurrency(Number(loan.outstandingBalance))}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={getBadgeVariant(loan.status)}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 font-bold uppercase">
                    <StatusText status={loan.paymentStatus} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No Salary Advance found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="md:hidden space-y-4">
        {loans?.length ? (
          loans.map((loan) => (
            <div
              key={loan.loanId}
              className="p-4 bg-white shadow-md rounded-lg space-y-4"
            >
              <h4 className="font-semibold text-xl">{loan.name}</h4>
              <p className="text-sm text-gray-500">
                Amount: {formatCurrency(Number(loan.amount))}
              </p>
              <p className="text-sm text-gray-500">
                Total Paid: {formatCurrency(Number(loan.totalPaid))}
              </p>
              <p className="text-sm text-gray-500">
                Outstanding: {formatCurrency(Number(loan.outstandingBalance))}
              </p>
              <p className="text-sm mt-2">
                Approval:{" "}
                <Badge variant={getBadgeVariant(loan.status)}>
                  {loan.status}
                </Badge>
              </p>
              <p className="text-sm font-bold mt-1">
                Status: <StatusText status={loan.paymentStatus} />
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No Salary Advance found.</p>
        )}
      </div>
    </section>
  );
};

// Helper function to get badge variants
const getBadgeVariant = (status: string) => {
  switch (status) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
};

// Status Text with colors
const StatusText = ({ status }: { status: string }) => {
  return (
    <span
      className={`text-lg uppercase font-bold ${
        status === "open"
          ? "text-yellow-500"
          : status === "closed"
          ? "text-green-500"
          : "text-red-500"
      }`}
    >
      {status}
    </span>
  );
};

export default LoansPage;
