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
import { Mail } from "lucide-react";
import FormError from "@/components/ui/form-error";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { loginSchema } from "../schema/login";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (email: string, password: string) => {
    const response = await fetch("/api/custom-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    if (data.tempToken) {
      router.push(
        `/auth/2fa?token=${data.tempToken}&email=${encodeURIComponent(email)}`
      );
      return;
    }
    try {
      // Call NextAuth signIn only if no verification is required
      const signInResult = await signIn("credentials", {
        redirect: false,
        user: JSON.stringify(data.user),
        backendTokens: JSON.stringify(data.backendTokens),
        permissions: JSON.stringify(data.permissions),
      });

      if (signInResult?.error) {
        setError(signInResult.error);
        return {
          error: getErrorMessage(signInResult.error),
        };
      }

      if (signInResult?.ok) {
        // 🔑 Decide where to go based on employmentStatus
        const destination =
          data.user.employmentStatus === "onboarding"
            ? "/onboarding"
            : "/dashboard";

        router.push(destination);
      }
    } catch (error) {
      return {
        error: error,
      };
    }
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const email = values.email;
    const password = values.password;

    setError(null);
    await handleLogin(email, password);
  }

  return (
    <section className="flex flex-col justify-between">
      <Form {...form}>
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        <div className="text-center text-textSecondary text-md flex justify-center items-center space-x-1">
          <p>Don&apos;t have an account?</p>
          <Link
            href="https://calendly.com/centapayroll/book-a-demo"
            target="_blank"
          >
            <Button
              variant="link"
              className="text-buttonPrimary px-0 font-bold"
            >
              Book a demo
            </Button>
          </Link>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-6 py-6  w-full mx-auto"
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

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={form.formState.isSubmitting}
              className="w-full"
            >
              Log In
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

export default LoginForm;
