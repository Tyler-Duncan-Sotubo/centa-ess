"use client";

import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { Employee } from "@/types/employees.type";

type Option = { label: string; value: string };

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface EmployeeSelectProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
}

export const EmployeeSingleSelect: React.FC<EmployeeSelectProps> = ({
  name,
  label,
  description,
  placeholder = "Search employees...",
  className,
}) => {
  const { control } = useFormContext();
  const { data: session } = useSession();
  const axios = useAxiosAuth();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees", debouncedSearch],
    queryFn: async () => {
      const res = await axios.get("/api/employees/all/summary", {
        params: { query: debouncedSearch },
      });
      return (res.data.data ?? []).map((emp: Employee) => ({
        label: `${emp.firstName} ${emp.lastName} ${
          emp.employeeNumber ? `(${emp.employeeNumber})` : ""
        }`,
        value: emp.id,
      }));
    },
    enabled: !!session?.backendTokens?.accessToken,
    staleTime: 0,
  });

  const getSelectedOption = (value: string): Option => {
    return (
      employees.find(
        (opt: { label: string; value: string }) => opt.value === value
      ) || {
        value,
        label: value,
      }
    );
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const selected = field.value ? getSelectedOption(field.value) : null;

        return (
          <FormItem className={className}>
            {(label || selected?.label) && (
              <div className="flex items-center justify-between mb-1">
                {label && <FormLabel>{label}</FormLabel>}
                {selected?.label && (
                  <div className="text-sm text-muted-foreground">
                    <strong>{selected.label}</strong>
                  </div>
                )}
              </div>
            )}
            <FormControl>
              <div>
                <Command className="border rounded-md px-3 py-2">
                  <CommandInput
                    placeholder={placeholder}
                    value={search}
                    onValueChange={setSearch}
                    onClick={() => setOpen(true)}
                  />
                  {open && (
                    <CommandList>
                      {isLoading ? (
                        <div className="p-4">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : employees.length > 0 ? (
                        <CommandGroup>
                          {employees.map(
                            (opt: { label: string; value: string }) => (
                              <CommandItem
                                key={opt.value}
                                onSelect={() => {
                                  field.onChange(opt.value);
                                  setOpen(false);
                                  setSearch("");
                                }}
                                className="cursor-pointer"
                              >
                                {opt.label}
                              </CommandItem>
                            )
                          )}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>No results found.</CommandEmpty>
                      )}
                    </CommandList>
                  )}
                </Command>
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
