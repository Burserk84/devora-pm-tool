"use client";

import { useState } from "react";
import { createProject } from "@/services/projectService";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface CreateProjectFormProps {
  onSuccess: () => void; // A callback to run after successful creation
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProject({ name, description });
      onSuccess(); // Call the success callback
    } catch (error) {
      console.error("Failed to create project", error);
      alert("Could not create project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="projectName"
          className="block text-sm font-medium text-slate-300"
        >
          Project Name
        </label>
        <Input
          id="projectName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="projectDescription"
          className="block text-sm font-medium text-slate-300"
        >
          Description
        </label>
        <Input
          id="projectDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
