"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { adminCreateUserSchema } from "@/lib/schemas";
import { adminCreateUser } from "@/services/adminService";

// Create a TypeScript type from our Zod schema
type CreateUserFormData = z.infer<typeof adminCreateUserSchema>;

export default function AdminPage() {
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(adminCreateUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData) => {
    setFormMessage(null);
    try {
      await adminCreateUser(data);
      setFormMessage({
        type: "success",
        text: `User "${data.name}" created successfully!`,
      });
      reset();
    } catch (error: unknown) {
      console.error("Failed to create user", error);
      setFormMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create user.",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <Card className="max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-300"
            >
              Professional Title (Optional)
            </label>
            <Input
              id="title"
              type="text"
              {...register("title")}
              placeholder="e.g., Frontend Developer"
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            {formMessage && (
              <p
                className={`text-sm ${
                  formMessage.type === "success"
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                {formMessage.text}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
