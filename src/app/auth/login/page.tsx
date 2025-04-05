"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import FormError from "@/components/ui/form-error";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { loginSchema } from "../schema/login";
import { axiosInstance, isAxiosError } from "@/lib/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const email = values.email;
    const password = values.password;

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setError(null);

    try {
      const res = await axiosInstance.post("/api/auth/login", values, {
        withCredentials: true,
      });
      if (res.status === 200) {
        router.push(`/dashboard`);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setError(error.response.data.message);
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
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <p className="text-textSecondary text-center text-sm">
          Log in to your account to continue
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-6 py-6 w-full mx-auto"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    leftIcon={
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} isPassword />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Display error message if there is one */}
          {error ? <FormError message={error} /> : ""}

          <section className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-md text-textPrimary font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            <Link href="/auth/forgot-password">
              <Button
                variant="link"
                className="text-buttonPrimary px-0 font-bold"
              >
                Forgot password?
              </Button>
            </Link>
          </section>

          <Button
            type="submit"
            isLoading={form.formState.isSubmitting}
            className="w-full"
          >
            Log In
          </Button>
        </form>
      </Form>
    </section>
  );
}

export default LoginForm;
