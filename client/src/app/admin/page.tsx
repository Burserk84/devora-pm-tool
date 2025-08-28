"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  adminGetAllUsers,
  adminGetAllProjects,
  adminCreateUser,
} from "@/services/adminService";
import { adminCreateUserSchema, adminDeleteUser } from "@/lib/schemas";
import Link from "next/link";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";

// --- TYPE DEFINITIONS ---
interface User {
  id: string;
  name: string;
  email: string;
  title: string | null;
  role: string;
}
interface Project {
  id: string;
  name: string;
  _count: {
    members: number;
    tasks: number;
  };
}
type CreateUserFormData = z.infer<typeof adminCreateUserSchema>;

// --- MAIN PAGE COMPONENT ---
export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { user: currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(adminCreateUserSchema),
  });

  const fetchData = () => {
    Promise.all([adminGetAllUsers(), adminGetAllProjects()])
      .then(([usersData, projectsData]) => {
        setUsers(usersData);
        setProjects(projectsData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: CreateUserFormData) => {
    setFormMessage(null);
    try {
      await adminCreateUser(data);
      setFormMessage({
        type: "success",
        text: `User "${data.name}" created successfully!`,
      });
      reset();
      fetchData();
    } catch (error) {
      console.error("Failed to create user", error);

      let errorMessage = "An unexpected error occurred.";

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Failed to create user.";
      }

      setFormMessage({ type: "error", text: errorMessage });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm("Are you sure you want to permanently delete this user?")
    ) {
      try {
        await adminDeleteUser(userId);
        // Refresh the list by filtering out the deleted user
        setUsers((currentUsers) => currentUsers.filter((u) => u.id !== userId));
      } catch (error) {
        console.error("Failed to delete user", error);
        alert("Could not delete user.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* --- CREATE USER FORM SECTION --- */}
      <section className="mb-12">
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
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
      </section>

      {/* --- DATA DISPLAY SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            User Management ({users.length})
          </h2>
          <Card className="p-4">
            <ul className="space-y-3">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-2 border-b border-slate-700 last:border-b-0"
                >
                  <div>
                    <p className="font-bold">
                      {user.name}{" "}
                      <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
                        {user.role}
                      </span>
                    </p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                    {user.title && (
                      <p className="text-sm text-slate-500 italic mt-1">
                        {user.title}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.id === currentUser?.id} // Disable button for your own account
                    className="bg-red-800 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Project Overview ({projects.length})
          </h2>
          <Card className="p-4">
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/project/${project.id}`}
                    className="block p-2 border-b border-slate-700 last:border-b-0 hover:bg-slate-700 rounded-md"
                  >
                    <p className="font-bold">{project.name}</p>
                    <p className="text-sm text-slate-400">
                      {project._count.members} Members • {project._count.tasks}{" "}
                      Tasks
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}
