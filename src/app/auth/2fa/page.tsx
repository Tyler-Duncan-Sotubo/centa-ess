"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { axiosInstance, isAxiosError } from "@/lib/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function TwoFAPage() {
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendVisible, setResendVisible] = useState(false);

  const searchParams = useSearchParams();
  const tempToken = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ code: string }>();

  const handleCodeSubmit = async (values: { code: string }) => {
    setVerifyError(null);
    try {
      const res = await axiosInstance.post("/api/auth/verify-code", {
        code: values.code,
        tempToken,
      });

      const data = await res.data;

      console.log("Verification response:", data);

      if (data.status === "error") {
        setVerifyError("Invalid code");
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
        // 🔑 Decide where to go based on employmentStatus
        const destination =
          data.data.user.employmentStatus === "onboarding"
            ? "/onboarding"
            : "/dashboard";

        console.log("Redirecting to:", destination);

        router.push(destination);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.error("Verification error:", error.response.data.error.message);
        setVerifyError(error.response.data.error.message);
        return {
          error: getErrorMessage(error.response.data.error.message),
        };
      } else {
        return {
          error: getErrorMessage(error),
        };
      }
    }
  };

  const handleResendCode = async () => {
    setResendError(null);

    const res = await axiosInstance.post("/api/auth/resend-code", {
      tempToken,
    });

    const data = await res.data;

    if (data.status === "error") {
      setResendError("Failed to resend code");
      return;
    }

    if (data.status === "success") {
      setResendVisible(true);
      setResendError(null);
    }

    // ✅ After first successful resend, permanently show the link
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4 text-center">Hold up.</h1>
      <p className="text-center mb-6">
        Protecting your account is one of our top priorities!
        <br />
        Please confirm your account by entering the authentication code sent to:
        <span className="font-semibold"> {email}</span>
      </p>

      <form
        onSubmit={handleSubmit(handleCodeSubmit)}
        className="space-y-4 sm:w-[70%] w-full mx-auto"
      >
        <Input
          type="text"
          placeholder="Enter 6-digit code"
          className="h-14 text-3xl"
          {...register("code", { required: true, minLength: 6, maxLength: 6 })}
        />

        {verifyError && <p className="text-red-500 text-sm">{verifyError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full ">
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
