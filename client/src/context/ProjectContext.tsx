"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { getProjectById } from "@/services/projectService";

// Define a comprehensive Project type
interface Member {
  role: "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string | null;
    email: string;
    title: string | null;
  };
}

interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee: {
    id: string;
    name: string | null;
    title: string | null;
  } | null;
}

interface Project {
  id: string;
  name: string;
  tasks: Task[];
  members: Member[];
}

interface ProjectContextType {
  project: Project | null;
  isLoading: boolean;
  fetchProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProject = useCallback(() => {
    setIsLoading(true);
    // Use an empty object for filters since the pages will handle it
    getProjectById(projectId, {})
      .then((data) => setProject(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return (
    <ProjectContext.Provider value={{ project, isLoading, fetchProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
