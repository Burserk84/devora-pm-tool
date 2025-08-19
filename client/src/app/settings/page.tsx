"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getCurrentUser, updateUser } from "@/services/userService";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setName(user.name || "");
        setTitle(user.title || "");
        setEmail(user.email || "");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    try {
      await updateUser({ name, title });
      setSuccessMessage("Profile updated successfully!");
      // Optionally, you could update the AuthContext here to see the name change instantly
    } catch (error) {
      console.error("Failed to update profile", error);
      setSuccessMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={email}
              disabled
              className="mt-1 bg-slate-700 cursor-not-allowed"
            />
          </div>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-300"
            >
              Professional Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Full-Stack Developer"
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            {successMessage && (
              <p className="text-sm text-green-400">{successMessage}</p>
            )}
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
