"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
// FIX: Import 'deleteProject' here
import { getProjects, deleteProject } from "@/services/projectService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { CreateProjectForm } from "@/components/CreateProjectForm";

// Define a type for our project data for type safety
interface Project {
  id: string;
  name: string;
  description: string | null;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const projectsData = await getProjects();
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

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

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
