"use client";

import React from "react";
import LoansPage from "./LoansPage";
import { useQuery } from "@tanstack/react-query";
import { Loan } from "@/types/loans.type";
import Loading from "@/components/ui/loading";
import { useSession } from "next-auth/react";

const SalaryAdvance = () => {
  const { data: session } = useSession();

  const fetchLoans = async (id: string | undefined) => {
    const res = await fetch(`/api/loans/employee/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch company data");
    }
    const data = await res.json();
    return data.data.data;
  };

  const {
    data: loans,
    isLoading: loadingSalariesAdvance,
    isError: errorSalariesAdvance,
  } = useQuery<Loan[]>({
    queryKey: ["loans", session?.user?.id],
    queryFn: () => fetchLoans(session?.user?.id),
  });

  if (loadingSalariesAdvance) return <Loading />;
  if (errorSalariesAdvance) return <p>Error loading data</p>;

  return <LoansPage loans={loans} id={session?.user?.id} />;
};

export default SalaryAdvance;
