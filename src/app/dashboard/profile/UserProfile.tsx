"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/ui/form-error";
import { UploadCloud } from "lucide-react";
import { User } from "@/types/user.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProfileSchema } from "@/schema/user.schema";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";
import PageHeader from "@/components/common/PageHeader";

function UserProfile({ user }: { user: User | undefined }) {
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      avatar: user?.avatar || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    },
    mode: "onChange",
  });

  // Handle File Upload
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        form.setValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const updateProfile = useUpdateMutation({
    endpoint: "api/auth/profile",
    successMessage: "Profile Updated",
    refetchKey: "user",
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setError(null);
    await updateProfile(values, setError, form.reset);
    router.push("/dashboard");
  }

  return (
    <section>
      <PageHeader
        title="Profile"
        description="Update your profile information. Your email cannot be changed."
      />

      <div className="w-full md:max-w-2xl md:space-y-6 mb-28">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-row items-center gap-6">
              <div
                {...getRootProps()}
                className="border-dashed border-2 border-gray-300 p-10 rounded-lg cursor-pointer hover:border-primary w-1/3 flex flex-col items-center"
              >
                <input {...getInputProps()} />
                {uploadedImage || form.getValues("avatar") ? (
                  <div className="relative w-full h-32">
                    <Image
                      src={uploadedImage || form.getValues("avatar") || ""}
                      alt="Profile Image"
                      className="rounded-full"
                      fill
                    />
                  </div>
                ) : isDragActive ? (
                  <p className="text-primary">Drop the file here...</p>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UploadCloud size={48} />
                    <p className="text-center">Drag & drop a profile image</p>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="w-1/2 flex flex-col justify-start space-y-4">
                <h2 className="text-xl font-semibold">Profile Image</h2>
                <p className="text-sm text-muted-foreground">
                  Upload your profile image to personalize your account.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This image will appear on your account and dashboard.
                </p>
              </div>
            </div>

            {/* First Name */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Your email is used for login and cannot be changed.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <FormError message={error} />}
            <Button
              type="submit"
              className="w-1/4"
              isLoading={form.formState.isSubmitting}
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}

export default UserProfile;
