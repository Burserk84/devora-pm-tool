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
interface Project {
  id: string;
  name: string;
  tasks: unknown[]; // Use a more specific type if needed
  members: unknown[]; // Use a more specific type if needed
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
