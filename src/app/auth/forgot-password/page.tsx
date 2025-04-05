"use client";

import { useState } from "react";
import { axiosInstance, isAxiosError } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Input } from "@/components/ui/input";
import FormError from "@/components/ui/form-error";
import { requestPasswordResetSchema } from "../schema/password";
import Link from "next/link";

const PasswordReset = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof requestPasswordResetSchema>>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof requestPasswordResetSchema>) {
    setError("");
    try {
      const res = await axiosInstance.post(`/api/auth/password-reset`, values, {
        withCredentials: true,
      });

      if (res.status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setError(error.response.data.message);
        console.log(error);
        return {
          error: getErrorMessage(error.response.data.message),
        };
      } else {
        return {
          error: getErrorMessage(error),
        };
      }
    }
  }

  if (success) {
    return (
      <section className="flex flex-col justify-between w-[70%] mx-auto">
        <h1 className="text-3xl font-bold text-center my-2">
          Password Reset Link Sent
        </h1>
        <p className="text-center text-gray-600 text-md">
          We have sent you an email with a link to reset your password. If you
          do not receive the email within a few minutes, please check your spam
          folder.
        </p>

        <div className="flex justify-center mt-4">
          <Button
            onClick={() => {
              setSuccess(false);
              form.reset();
            }}
          >
            Send Another Link
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-between mx-auto">
      <Form {...form}>
        <h1 className="text-3xl font-bold text-center my-2">
          Forgot Your Password?
        </h1>
        <p className="text-center text-gray-600 text-md">
          Enter your email address and we will send you a link to reset your
          password.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-6 py-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <FormError message={error} />}

          <Button
            type="submit"
            isLoading={form.formState.isSubmitting}
            className="w-full"
          >
            Send Password Reset Link
          </Button>
        </form>
      </Form>

      <div className="text-center text-textSecondary text-md flex justify-end items-center space-x-1">
        <Link href="/auth/login">
          <Button variant="link" className="text-buttonPrimary px-6 font-bold">
            <span>Log In</span>
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default PasswordReset;
