export type PayrollRecord = {
  payslip_id: string;
  payroll_date: string;
  gross_salary: number;
  net_salary: number;
  totalDeduction: number;
  nhfContribution: 0;
  paye: number;
  pensionContribution: number;
  salaryAdvance: number;
  taxableIncome: number;
  payslip_pdf_url: string;
};
