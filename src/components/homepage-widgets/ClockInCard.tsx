/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/hooks/useAxiosAuth";

/* LocalStorage Helpers */
const LS_KEY = "clock-in-timer";
type StoredState = { clockIn?: number; clockOut?: number; running: boolean };

const saveState = (ci: Date | null, co: Date | null, running: boolean) =>
  localStorage.setItem(
    LS_KEY,
    JSON.stringify({
      clockIn: ci?.getTime(),
      clockOut: co?.getTime(),
      running,
    } as StoredState)
  );

const loadState = (): StoredState => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as StoredState) : { running: false };
  } catch {
    return { running: false };
  }
};

/* ───────────── Geolocation helper ───────────── */
const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by this browser."));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 8000,
    });
  });

export default function ClockInCard() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const axiosInstance = useAxiosAuth();

  const [hydrated, setHydrated] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    const syncStatus = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/clock-in-out/status/${session?.user.id}`
        );
        if (res.data?.status === "success") {
          const { checkInTime, checkOutTime } = res.data.data;
          setClockInTime(checkInTime ? new Date(checkInTime) : null);
          setClockOutTime(checkOutTime ? new Date(checkOutTime) : null);
          setIsRunning(Boolean(checkInTime && !checkOutTime));
        }
      } catch {
        // fallback to localStorage
        const { clockIn, clockOut, running } = loadState();
        setClockInTime(clockIn ? new Date(clockIn) : null);
        setClockOutTime(clockOut ? new Date(clockOut) : null);
        setIsRunning(running);
      } finally {
        setHydrated(true);
      }
    };

    syncStatus();
  }, []);

  /* ── Live timer ── */
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (hydrated && isRunning && clockInTime && !clockOutTime) {
      interval = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(interval);
  }, [hydrated, isRunning, clockInTime, clockOutTime]);

  /* ── Persist to localStorage ── */
  useEffect(() => {
    if (hydrated) saveState(clockInTime, clockOutTime, isRunning);
  }, [clockInTime, clockOutTime, isRunning, hydrated]);

  /* ── Clock-in handler ── */
  const handleClockIn = async () => {
    setIsLoading(true);
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords;
      const res = await axiosInstance.post("/api/clock-in-out/clock-in", {
        latitude: String(latitude),
        longitude: String(longitude),
      });

      if (res.data?.status === "success") {
        const now = new Date();
        setClockInTime(now);
        setClockOutTime(null);
        setIsRunning(true);
        toast({
          title: "Clocked in",
          description: `at ${format(now, "HH:mm:ss")}`,
          variant: "success",
        });
      }
    } catch (err: any) {
      const msg =
        err?.message === "Geolocation is not supported by this browser."
          ? err.message
          : err?.code === 1 /* permission denied */ ||
            err?.message?.includes?.("denied")
          ? "Location permission denied. Enable it to clock-in."
          : err?.response?.data?.error?.message || "Try again later.";
      toast({
        title: "Clock in failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Clock-out handler ── */
  const handleClockOut = async () => {
    setIsLoading(true);
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords;

      const res = await axiosInstance.post("/api/clock-in-out/clock-out", {
        latitude: String(latitude),
        longitude: String(longitude),
      });

      if (res.data?.status === "success") {
        const now = new Date();
        setClockOutTime(now);
        setIsRunning(false);
        toast({
          title: "Clocked out",
          description: `at ${format(now, "HH:mm:ss")}`,
          variant: "default",
        });
      }
    } catch (err: any) {
      const msg =
        err?.code === 1
          ? "Location permission denied. Enable it to clock-out."
          : err?.response?.data?.error?.message || "Try again later.";
      toast({
        title: "Clock out failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fmt = (d: Date) => format(d, "EEE, HH:mm:ss");
  const fmtDate = (d: Date) => format(d, "dd MMMM yyyy");

  if (!hydrated) return null; // avoid hydration mismatch

  return (
    <section className="w-full max-h-28 p-5 rounded-lg bg-card border flex flex-col gap-4">
      <div className="flex items-center justify-between px-0 gap-4">
        <div>
          <div className="text-sm font-semibold text-foreground">
            {clockOutTime
              ? "You clocked out"
              : isRunning
              ? "You are clocked in"
              : "Clock In"}
          </div>
          <div className="text-xl font-bold">
            {clockOutTime
              ? fmt(clockOutTime)
              : clockInTime
              ? fmt(currentTime)
              : fmt(currentTime)}
          </div>
          <div className="text-base text-muted-foreground">
            {fmtDate(clockInTime ?? currentTime)}
          </div>
        </div>
        <div className="w-[50%]">
          <Button
            className="w-full"
            onClick={isRunning ? handleClockOut : handleClockIn}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isRunning ? "Clock Out" : "Clock In"}
          </Button>
        </div>
      </div>
    </section>
  );
}
