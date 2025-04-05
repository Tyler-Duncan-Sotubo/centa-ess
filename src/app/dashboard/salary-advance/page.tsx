"use client";

import React from "react";
import { fetchLoans } from "@/server/loans";
import LoansPage from "./LoansPage";
import { useQuery } from "@tanstack/react-query";
import { Loan } from "@/types/loans.type";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/context/AuthContext";

const SalaryAdvance = () => {
  const { user } = useAuth();

  const {
    data: loans,
    isLoading: loadingSalariesAdvance,
    isError: errorSalariesAdvance,
  } = useQuery<Loan[]>({
    queryKey: ["loans", user?.id],
    queryFn: () => fetchLoans(user?.id),
  });

  if (loadingSalariesAdvance) return <Loading />;
  if (errorSalariesAdvance) return <p>Error loading data</p>;

  return <LoansPage loans={loans} id={user?.id} />;
};

export default SalaryAdvance;
