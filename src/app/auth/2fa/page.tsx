"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { axiosInstance, isAxiosError } from "@/lib/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React from "react";

export default function TwoFAPage() {
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendVisible, setResendVisible] = useState(false);

  const searchParams = useSearchParams();
  const tempToken = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    resetField,
  } = useForm<{ code: string }>({ defaultValues: { code: "" } });

  // Handle OTP submission
  const handleCodeSubmit = async ({ code }: { code: string }) => {
    setVerifyError(null);
    try {
      const res = await axiosInstance.post("/api/auth/verify-code", {
        code,
        tempToken,
      });

      const data = res.data;

      if (data.status === "error") {
        setVerifyError("Invalid code");
        resetField("code");
        return;
      }

      const signInRes = await signIn("credentials", {
        redirect: false,
        user: JSON.stringify(data.data.user),
        backendTokens: JSON.stringify(data.data.backendTokens),
        permissions: JSON.stringify(data.data.permissions),
      });

      if (signInRes?.error) {
        setVerifyError(signInRes.error);
        return;
      }

      if (signInRes?.ok) {
        // Decide where to go based on employmentStatus
        const destination =
          data.data.user.employmentStatus === "onboarding"
            ? "/onboarding"
            : "/dashboard";

        router.push(destination);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setVerifyError(getErrorMessage(error.response.data.error.message));
        resetField("code");
      } else {
        setVerifyError(getErrorMessage(error));
        resetField("code");
      }
    }
  };

  // Handle resend
  const handleResendCode = async () => {
    setResendError(null);
    try {
      const res = await axiosInstance.post("/api/auth/resend-code", {
        tempToken,
      });
      const data = res.data;

      if (data.status === "error") {
        setResendError("Failed to resend code");
        return;
      }
      if (data.status === "success") {
        setResendVisible(true);
        setResendError(null);
        setTimeout(() => setResendVisible(false), 10000); // allow resending again after 10s if you want
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setResendError(getErrorMessage(error.response.data.error.message));
      } else {
        setResendError(getErrorMessage(error));
      }
      setResendError("Failed to resend code. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Hold up.</h1>
      <p className="text-center mb-6">
        Protecting your account is one of our top priorities!
        <br />
        Please confirm your account by entering the authentication code sent to:
        <span className="font-semibold"> {email}</span>
      </p>

      <form
        onSubmit={handleSubmit(handleCodeSubmit)}
        className="space-y-4 w-full"
      >
        <Controller
          name="code"
          control={control}
          rules={{
            required: "Code is required",
            minLength: { value: 6, message: "Code must be 6 digits" },
            maxLength: 6,
          }}
          render={({ field, fieldState }) => (
            <div>
              <InputOTP
                {...field}
                maxLength={6}
                containerClassName="justify-center"
                className="text-4xl"
              >
                <InputOTPGroup className="text-4xl">
                  {[...Array(6)].map((_, index) => (
                    <React.Fragment key={index}>
                      <InputOTPSlot
                        index={index}
                        className="h-14 w-14 text-3xl sm:h-12 sm:w-12"
                      />
                      {index === 2 && <InputOTPSeparator />}
                    </React.Fragment>
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {fieldState.error && (
                <p className="text-red-500 text-xs mt-2">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {verifyError && (
          <p className="text-red-500 text-sm text-center">{verifyError}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>
      </form>

      <div className="text-center text-sm mt-6">
        It may take a few minutes to receive your code.
        <br />
        {!resendVisible ? (
          <Button
            variant="link"
            onClick={handleResendCode}
            className="text-blue-500 font-semibold"
            type="button"
          >
            Send me a new code
          </Button>
        ) : (
          <p className="text-green-600 font-semibold">
            Code resent successfully.
          </p>
        )}
        {resendError && <p className="text-red-500 text-sm">{resendError}</p>}
      </div>
    </div>
  );
}
