"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { employeeBankSchema } from "@/schema/employee";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { nigerianBanks } from "@/data/banks.data";
import { TabsContent } from "@/components/ui/tabs";
import FormError from "@/components/ui/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@/types/employees.type";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";
import { useCreateMutation } from "@/hooks/useCreateMutation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

const EmployeeBankDetails = ({
  employee,
  id,
  setIsDirty,
}: {
  employee: Employee | undefined;
  id: string | undefined;
  setIsDirty: (dirty: boolean) => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof employeeBankSchema>>({
    resolver: zodResolver(employeeBankSchema),
    defaultValues: {
      bank_account_name:
        employee?.employee_bank_details?.bank_account_name ?? "",
      bank_name: employee?.employee_bank_details?.bank_name ?? "",
      bank_account_number:
        employee?.employee_bank_details?.bank_account_number ?? "",
    },
  });

  // Extract values from form state
  const { bank_name, bank_account_number } = form.watch();

  // Store previous values to detect changes
  const [prevBank, setPrevBank] = useState(bank_name);
  const [prevAccountNumber, setPrevAccountNumber] =
    useState(bank_account_number);

  // Function to verify bank details
  const verifyBankDetails = async (accountNumber: string, bankName: string) => {
    if (!accountNumber || !bankName) return;

    setIsVerifying(true);

    // Get the bank code from the selected bank name
    const selectedBank = nigerianBanks.find((bank) => bank.name === bankName);
    const bankCode = selectedBank?.code;

    if (!bankCode) {
      setError("Invalid bank selected.");
      setIsVerifying(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-account/${accountNumber}/${bankCode}`
      );

      if (res.data?.status) {
        form.setValue("bank_account_name", res.data.data.account_name);
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

  // Use effect to automatically verify when bank name or account number changes
  useEffect(() => {
    if (bank_name !== prevBank || bank_account_number !== prevAccountNumber) {
      setPrevBank(bank_name);
      setPrevAccountNumber(bank_account_number);

      // Delay API call to prevent excessive requests
      const timeout = setTimeout(() => {
        verifyBankDetails(bank_account_number, bank_name);
      }, 1000);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank_name, bank_account_number]);

  const updateEmployeeBankDetails = useUpdateMutation({
    endpoint: `/api/employee/bank-details/${id}`,
    successMessage: "Employee updated successfully!",
    refetchKey: "employee",
  });

  const createEmployeeBankDetails = useCreateMutation({
    endpoint: `/api/employee/bank-details/${id}`,
    successMessage: "Employee bank details created successfully!",
    refetchKey: "employee",
  });

  const onSubmit = async (values: z.infer<typeof employeeBankSchema>) => {
    setError(null);
    if (employee?.employee_bank_details?.id) {
      await updateEmployeeBankDetails(values, setError);
      setIsDirty(false);
    } else {
      await createEmployeeBankDetails(values, setError);
      setIsDirty(false);
    }
  };

  React.useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true));
    return () => subscription.unsubscribe();
  }, [form, form.watch, setIsDirty]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-6 md:w-2/3">
        <TabsContent value="bank">
          <FormField
            name="bank_name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Bank Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianBanks.map((bank, index) => (
                      <SelectItem key={index} value={bank.name}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="bank_account_number"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="bank_account_name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    disabled
                    placeholder="MICHEAL MUSA"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isVerifying && <p className="text-blue-500 text-lg">Verifying...</p>}
          {error && <FormError message={error} />}

          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              isLoading={form.formState.isSubmitting}
              className="w-40"
            >
              Save Changes
            </Button>
          </div>
        </TabsContent>
      </form>
    </Form>
  );
};

export default EmployeeBankDetails;
