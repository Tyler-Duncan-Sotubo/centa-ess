export interface Loan {
  loanId: string;
  amount: string;
  status:
    | "pending"
    | "ongoing"
    | "paid"
    | "completed"
    | "approved"
    | "rejected";
  totalPaid: string;
  tenureMonths: number;
  outstandingBalance: string;
  preferredMonthlyPayment: string;
  employeeName: string;
  name: string;
  paymentStatus: string;
}
