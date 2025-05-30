"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { employeeTaxSchema } from "@/schema/employee";
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
import { TabsContent } from "@/components/ui/tabs";
import FormError from "@/components/ui/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIGERIAN_STATES } from "@/data/state.data";
import { Employee } from "@/types/employees.type";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";
import { useCreateMutation } from "@/hooks/useCreateMutation";

const EmployeeTaxDetails = ({
  employee,
  id,
  setIsDirty,
}: {
  employee: Employee | undefined;
  id: string | undefined;
  setIsDirty: (dirty: boolean) => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof employeeTaxSchema>>({
    resolver: zodResolver(employeeTaxSchema),
    defaultValues: {
      tin: employee?.employee_tax_details?.tin || "",
      pension_pin: employee?.employee_tax_details?.pension_pin || "",
      nhf_number: employee?.employee_tax_details?.nhf_number || "",
      state_of_residence:
        employee?.employee_tax_details?.state_of_residence || "",
    },
  });

  const updateEmployeeTaxDetails = useUpdateMutation({
    endpoint: `/api/employee/tax-details/${id}`,
    successMessage: "Employee Tax details Updated successfully!",
    refetchKey: "employee",
  });

  const createEmployeeTaxDetails = useCreateMutation({
    endpoint: `/api/employee/tax-details/${id}`,
    successMessage: "Employee Tax details created successfully!",
    refetchKey: "employee",
  });

  const onSubmit = async (values: z.infer<typeof employeeTaxSchema>) => {
    setError(null);
    if (!employee?.employee_tax_details?.id) {
      await createEmployeeTaxDetails(values, setError);
      setIsDirty(false);
    } else {
      // Update employee tax details
      await updateEmployeeTaxDetails(values, setError);
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
        <TabsContent value="tax">
          <FormField
            name="tin"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Tax Identification Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="state_of_residence"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>State Of Residence</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((state, index) => (
                      <SelectItem key={index} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="pension_pin"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Pension Pin</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="nhf_number"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>NHF Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              isLoading={form.formState.isSubmitting}
              className="w-40"
            >
              Save Changes
            </Button>
          </div>

          {/* Display error message if there is one */}
          {error ? <FormError message={error} /> : null}
        </TabsContent>
      </form>
    </Form>
  );
};

export default EmployeeTaxDetails;
