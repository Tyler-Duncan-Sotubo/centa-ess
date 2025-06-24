/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export type BankVerifyResult =
  | { ok: true; accountName: string }
  | { ok: false; error: string };

export function useBankVerification(
  accountNumber: string,
  bankCode: string,
  debounceMs = 800
) {
  const { data: session } = useSession();

  const [state, setState] = useState<BankVerifyResult | null>(null);

  /* ───────────── Track last verified pair ───────────── */
  const lastKeyRef = useRef<string>(""); // "070-0123456789"
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const verify = useCallback(async () => {
    // Guards
    if (accountNumber.length !== 10 || !bankCode) return;

    const key = `${bankCode}-${accountNumber}`;
    if (key === lastKeyRef.current) return; // 🔒 already verified

    setState(null); // loading
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employee-finance/verify-account/${accountNumber}/${bankCode}`,
        {
          headers: {
            Authorization: `Bearer ${
              session?.backendTokens?.accessToken ?? ""
            }`,
          },
        }
      );

      if (res.data?.status) {
        setState({ ok: true, accountName: res.data.data.account_name });
        lastKeyRef.current = key; // ✅ remember success
      } else {
        throw new Error("Invalid account details");
      }
    } catch (err: any) {
      setState({
        ok: false,
        error: err?.response?.data?.message ?? err.message,
      });
      lastKeyRef.current = ""; // clear on failure
    }
  }, [accountNumber, bankCode, session]);

  /* ───────────── Debounce on change ───────────── */
  useEffect(() => {
    // If either value changes, reset timer
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(verify, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [accountNumber, bankCode, verify, debounceMs]);

  return state; // null (loading) | { ok:true, accountName } | { ok:false, error }
}
