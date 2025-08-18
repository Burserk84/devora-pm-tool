"use client";

import { useEffect, useState, useMemo } from "react";
import { getProjectById, createTask } from "@/services/projectService";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext"; // <-- 1. Import useAuth

// Define our types
interface Task {
  id: string;
  title: string;
  content: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  tasks: Task[];
}

const columnMap = {
  TODO: "To-Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const columns: ("TODO" | "IN_PROGRESS" | "DONE")[] = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { token } = useAuth(); // <-- 2. Get the token from our context

  const fetchProject = async () => {
    try {
      setIsLoading(true); // Set loading true at the start of fetch
      const projectData = await getProjectById(params.id);
      setProject(projectData);
    } catch (error) {
      console.error("Failed to fetch project", error);
      setProject(null); // Ensure project is null on error
    } finally {
      setIsLoading(false);
    }
  };

  // 3. This is the crucial change
  useEffect(() => {
    // Only try to fetch the project if the token has been loaded
    if (token) {
      fetchProject();
    }
  }, [params.id, token]); // <-- And depend on the token

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !project) return;
    try {
      await createTask({ title: newTaskTitle, projectId: project.id });
      setNewTaskTitle("");
      fetchProject(); // Refetch the project to get the new task
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const tasksByStatus = useMemo(() => {
    if (!project) return { TODO: [], IN_PROGRESS: [], DONE: [] }; // Guard against null project
    const grouped: Record<string, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    project.tasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [project]);

  // We should wait to show "not found" until loading is complete
  if (isLoading) return <div>Loading board...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
      <p className="text-slate-400 mb-8">{project.description}</p>

      <form onSubmit={handleCreateTask} className="flex gap-2 mb-8 max-w-sm">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <Button type="submit">Add Task</Button>
      </form>

      <div className="flex gap-6">
        {columns.map((status) => (
          <div key={status} className="flex-1 bg-slate-800 p-4 rounded-lg">
            <h2 className="font-bold text-lg mb-4">{columnMap[status]}</h2>
            <div className="space-y-4">
              {tasksByStatus[status].map((task) => (
                <Card key={task.id} className="p-4 bg-slate-700">
                  <h3 className="font-semibold">{task.title}</h3>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
