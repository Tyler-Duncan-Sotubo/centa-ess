import { z } from "zod";

export const loanSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  amount: z.coerce
    .number()
    .min(1, { message: "Tenure must be at least 1 month" }),
  tenureMonths: z.coerce
    .number()
    .min(1, { message: "Tenure must be at least 1 month" }),
  preferredMonthlyPayment: z.coerce.number().optional(),
});

export type loanSchemaType = z.infer<typeof loanSchema>;
