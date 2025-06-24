/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import DynamicField from "./DynamicField";
import { ChecklistItem } from "@/types/onboarding.type";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useEffect, useState } from "react";
import axios from "axios";

/* ────────────────────────────────────────────────────────── */
/*  2. The component                                         */
/* ────────────────────────────────────────────────────────── */
export default function StepForm({
  item,
  maxStep,
  onPrev,
  onNext,
}: {
  item: ChecklistItem;
  maxStep: number;
  onPrev: () => void;
  onNext: (answers: Record<string, any>) => void;
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const buildSchema = (fields: ChecklistItem["fields"]) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    fields.forEach((f) => {
      let base: z.ZodTypeAny;

      switch (f.fieldType) {
        case "text":
        case "select":
          base = z.string();
          break;

        case "date":
          base = z
            .string()
            .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date" });
          break;

        case "file":
          base = z.any(); // or z.instanceof(File)
          break;

        default:
          base = z.string(); // fallback
      }

      // Use .min(1) for string-like values
      if (f.required) {
        if (base instanceof z.ZodString) {
          shape[f.fieldKey] = base.min(1, { message: "Required" });
        } else {
          shape[f.fieldKey] = base;
        }
      } else {
        shape[f.fieldKey] = base.optional();
      }
    });

    return z.object(shape);
  };

  const schema = buildSchema(item.fields);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
    mode: "onBlur",
  });

  const { bankName, bankAccountNumber } = form.watch();
  const [prevBank, setPrevBank] = useState(bankName);
  const [prevAccountNumber, setPrevAccountNumber] = useState(bankAccountNumber);

  const submit = (values: FormValues) => onNext(values);

  // Function to verify bank details
  const verifyBankDetails = async (accountNumber: string, bankName: string) => {
    if (!accountNumber || !bankName) return;

    setIsVerifying(true);

    if (!bankName) {
      setError("Invalid bank selected.");
      setIsVerifying(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employee-finance/verify-account/${accountNumber}/${bankName}`
      );

      if (res.data?.status) {
        form.setValue("bankAccountName", res.data.data.account_name);
        toast({
          variant: "success",
          title: "Account Verified",
          description: `Account Name: ${res.data.data.account_name}`,
        });
        setError(null);
      } else {
        setError("Invalid account details. Please check again.");
      }
    } catch (error) {
      getErrorMessage(error);
      setError("Failed to verify account. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (bankName !== prevBank || bankAccountNumber !== prevAccountNumber) {
      setPrevBank(bankName);
      setPrevAccountNumber(bankAccountNumber);

      // Delay API call to prevent excessive requests
      const timeout = setTimeout(() => {
        verifyBankDetails(bankAccountNumber, bankName);
      }, 1000);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankAccountNumber, bankName]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="space-y-6 max-w-2xl"
      >
        {item.fields.map((f) => (
          <FormField
            key={f.id}
            control={form.control}
            name={f.fieldKey as keyof FormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel required={f.required}>{f.label}</FormLabel>
                <FormControl>
                  {/* DynamicField only needs value / onChange */}
                  <DynamicField
                    field={f}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isVerifying}
                    error={error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="secondary"
            disabled={item.order === 1}
            onClick={onPrev}
          >
            Previous
          </Button>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {item.order === maxStep ? "Finish" : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
