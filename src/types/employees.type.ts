export interface Employee {
  id: string;
  employee_number: number;
  first_name: string;
  last_name: string;
  name: string;
  job_title: string;
  phone?: string;
  email: string;
  employment_status: string;
  start_date: string;
  annual_gross: number;
  hourly_rate?: number;
  bonus?: number;
  commission?: number;
  employee_bank_details?: EmployeeBankDetails;
  employee_tax_details?: EmployeeTaxDetails;
  department_id: string;
  group_id: string;
}

export interface EmployeeBankDetails {
  id: string;
  bank_account_name: string;
  bank_name: string;
  bank_account_number: string;
}

export interface EmployeeTaxDetails {
  id: string;
  tin: string;
  consolidated_relief_allowance: number;
  other_reliefs: number;
  state_of_residence: string;
  has_exemptions: boolean;
}

export type EmployeeGroup = {
  id: string;
  name: string;
  createdAt: string;
  pay_schedule_id: string;
  apply_nhf: boolean;
  apply_pension: boolean;
  apply_paye: boolean;
  apply_additional: boolean;
  payFrequency: string;
};

export type Department = {
  [x: string]: string;
  id: string;
  name: string;
  heads_first_name: string;
  heads_last_name: string;
  heads_email: string;
  created_at: string;
};

export type EmployeePayroll = {
  employee_number: number;
  name: string;
  email: string;
  grossSalary: number;
  PAYE: number;
  pension: number;
  NHF: number;
  additionalDeductions: number;
  netSalary: number;
  totalDeductions: number;
  bonus?: number;
  basic: number;
  housing: number;
  transport: number;
  allowances?: { type: string; amount: number }[];
  taxableIncome: number;
  effectiveTaxRate: string;
  averageTaxRate: string;
};
