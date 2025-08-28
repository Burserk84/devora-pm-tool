"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProjectsSummary, deleteProject } from "@/services/projectService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { ProjectCardSkeleton } from "@/components/ui/ProjectCardSkeleton";
import type { ProjectSummary } from "@/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const projectsData = await getProjectsSummary();
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = () => {
    setIsModalOpen(false);
    fetchProjects();
  };

  const handleDeleteProject = async (projectId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project and all its tasks? This action cannot be undone."
      )
    ) {
      try {
        await deleteProject(projectId);
        setProjects((currentProjects) =>
          currentProjects.filter((p) => p.id !== projectId)
        );
      } catch (error) {
        console.error("Failed to delete project", error);
        alert("Could not delete the project. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <Button disabled>Create New Project</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create New Project</Button>
      </div>
      {projects.length === 0 ? (
        <p>You don&apos;t have any projects yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                <p className="text-slate-400 mb-4 h-12 overflow-hidden">
                  {project.description || "No description."}
                </p>
                <p className="text-sm text-slate-400">
                  {project._count.tasks} tasks
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Link href={`/project/${project.id}`} className="w-full">
                  <Button className="w-full">View Board</Button>
                </Link>
                <Button
                  onClick={() => handleDeleteProject(project.id)}
                  className="bg-red-800 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Project"
      >
        <CreateProjectForm onSuccess={handleProjectCreated} />
      </Modal>
    </div>
  );
}
