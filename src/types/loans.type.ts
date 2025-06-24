export type Loan = {
  loanId: string;
  loanNumber: string;
  name: string;
  amount: string;
  totalPaid: string;
  outstandingBalance: string;
  preferredMonthlyPayment: string;
  tenureMonths: number;
  status: "pending" | "approved" | "rejected" | "paid";
  paymentStatus: "open" | "closed" | "overdue";
  createAt: string;
};
