import { z } from "zod";

export const employeeSchema = z.object({
  employee_number: z.string().min(1, "Employee Id is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  job_title: z.string().min(1, "Job title is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email"),
  employment_status: z.string().min(1, "Status is required"),
  start_date: z.string().min(1, "Start date is required"),
  annual_gross: z.number().positive({
    message: "Employee number is required",
  }),
  department_name: z.string().optional(),
  group_name: z.string().optional(),
  bank_name: z.string().min(1, "Bank name is required"),
  bank_account_number: z.string().min(1, "Bank account number is required"),
  apply_nhf: z.string(),
  nhf_number: z.string().optional(),
  tin: z.string().min(1, "Tax Identification Number is required"),
  pension_pin: z.string().min(1, "Personal Identification Number is required"),
});

export type employeeSchemaType = z.infer<typeof employeeSchema>;

export const employeeUpdateSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  job_title: z.string().min(1, "Job title is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email"),
  employment_status: z.string().min(1, "Status is required"),
  annual_gross: z.coerce.number().default(50),
  department_id: z.string().optional(),
  hourly_rate: z.number().min(0).optional(),
  commission: z.number().min(0).optional(),
});

export const employeeTaxSchema = z.object({
  tin: z.string().min(1, {
    message: "Tax Identification Number is required",
  }),
  state_of_residence: z.string().min(1, {
    message: "State of residence is required",
  }),
  consolidated_relief_allowance: z.number().int().default(0),
  pension_pin: z.string().optional(),
  nhf_number: z.string().optional(),
});

export const employeeBankSchema = z.object({
  bank_account_number: z.string().min(10, {
    message: "Bank account number is required",
  }),
  bank_account_name: z.string(),
  bank_name: z.string().min(1, {
    message: "Bank name is required",
  }),
});
