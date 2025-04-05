"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import EmployeeDetails from "./_components/EmployeeDetails";
import { fetchEmployee } from "@/server/employees";
import { Employee } from "@/types/employees.type";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/context/AuthContext";

const EmployeePage = () => {
  const { user } = useAuth();
  const {
    data: employee,
    isLoading: loadingEmployee,
    isError: errorEmployee,
  } = useQuery<Employee>({
    queryKey: ["employee", user?.id], // Unique key per employee
    queryFn: () => fetchEmployee(user?.id),
    enabled: !!user?.id, // Ensure id exists before fetching
    refetchOnMount: true,
  });

  if (loadingEmployee) return <Loading />;
  if (errorEmployee) return <div>Error...</div>;

  return <EmployeeDetails employee={employee} id={user?.id} />;
};

export default EmployeePage;
