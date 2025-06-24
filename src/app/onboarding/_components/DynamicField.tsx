/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Field } from "@/types/onboarding.type";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { nigerianBanks } from "@/data/banks.data";
import { useState } from "react";
import { FileUploadField } from "../../../components/FileUploadField";

export default function DynamicField({
  field,
  value,
  onChange,
  disabled = false,
  error = null,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
  disabled?: boolean;
  error?: string | null;
}) {
  const [open, setOpen] = useState(false);
  /* ─────────────── BANK SELECT ─────────────── */
  if (field.fieldKey === "bankName" && field.fieldType === "select") {
    return (
      <Select value={value ?? ""} onValueChange={onChange}>
        <div className="flex justify-end">
          {disabled && <p className="text-blue-500 text-lg">Verifying...</p>}
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Bank…" />
        </SelectTrigger>
        <SelectContent>
          {nigerianBanks.map((bank) => (
            <SelectItem key={bank.code} value={bank.code}>
              {bank.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  /* ─────────────── DISABLED ACCOUNT-NAME ─────────────── */
  if (field.fieldKey === "bankAccountName" && field.fieldType === "text") {
    return (
      <Input
        type="text"
        value={value ?? ""}
        disabled
        placeholder="Autofilled after verification"
      />
    );
  }

  /* ─────────────── GENERIC FALLBACKS ─────────────── */
  if (field.fieldType === "text")
    return (
      <Input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );

  if (field.fieldType === "date") {
    const selectedDate =
      typeof value === "string" ? new Date(value) : value ?? null;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onChange(date.toISOString());
                setOpen(false); // close on select
              }
            }}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    );
  }

  if (field.fieldType === "select") {
    let opts: string[] = [];

    switch (field.fieldKey) {
      case "maritalStatus":
        opts = ["single", "married", "divorced", "widowed"];
        break;
      case "gender":
        opts = ["male", "female", "other"];
        break;
      default:
        opts = (field as any).options ?? ["Option A", "Option B", "Option C"];
        break;
    }

    return (
      <Select value={value ?? ""} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          {opts.map((opt) => (
            <SelectItem key={opt} value={opt} className="capitalize">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (field.fieldType === "file") {
    return <FileUploadField value={value} onChange={onChange} />;
  }

  return null;
}
