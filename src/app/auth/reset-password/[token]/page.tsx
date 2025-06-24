"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { newPasswordSchema } from "../../schema/password";

type Params = {
  params: {
    token: string;
  };
};

const PasswordReset = ({ params }: Params) => {
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newPasswordSchema>) {
    setError("");

    try {
      const res = await axiosInstance.post(
        `/api/auth/reset-password`,
        {
          token: params.token,
          password: values.password,
          passwordConfirmation: values.password_confirmation,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        router.push(`${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/login`);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setError(error.response.data.error.message);
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

  return (
    <section className="flex flex-col justify-between">
      <Form {...form}>
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
        <p className="text-center text-gray-600 text-sm">
          Enter new password to reset your password.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-6 py-6 w-full mx-auto"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="py-4"
                    isPassword
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="py-4"
                    isPassword
                  />
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
            Reset Password
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default PasswordReset;
