export interface Employee {
  id: string;
  employee_number: number;
  employeeNumber: number;
  first_name: string;
  last_name: string;
  firstName: string;
  lastName: string;
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

export interface IUser {
  avatar: null;
  companyId: string;
  company_name: string;
  department_name: string;
  email: string;
  employee_number: string;
  first_name: string;
  group_id: string;
  id: string;
  job_role: string;
  last_name: string;
  start_date: string;
  userId: string;
  location: string;
  employeeManager: {
    id: string;
    name: string;
    email: string;
  };
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
  pension_pin: string;
  nhf_number: string;
  consolidated_relief_allowance: number;
  state_of_residence: string;
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
