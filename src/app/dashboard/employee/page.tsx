"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import EmployeeDetails from "./_components/EmployeeDetails";
import { Employee } from "@/types/employees.type";
import Loading from "@/components/ui/loading";
import { useSession } from "next-auth/react";

const EmployeePage = () => {
  const { data: session } = useSession();

  const fetchEmployee = async (id: string | undefined) => {
    const res = await fetch(`/api/employees/employee/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch company data");
    }
    const data = await res.json();
    return data.data.data;
  };

  const {
    data: employee,
    isLoading: loadingEmployee,
    isError: errorEmployee,
  } = useQuery<Employee>({
    queryKey: ["employee", session?.user?.id], // Unique key per employee
    queryFn: () => fetchEmployee(session?.user?.id),
    enabled: !!session?.user?.id, // Ensure id exists before fetching
    refetchOnMount: true,
  });

  if (loadingEmployee) return <Loading />;
  if (errorEmployee) return <div>Error...</div>;

  return <EmployeeDetails employee={employee} id={session?.user?.id} />;
};

export default EmployeePage;
