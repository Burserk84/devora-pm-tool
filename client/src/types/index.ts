export interface Assignee {
  id: string;
  name: string | null;
  title: string | null;
}

export interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee: Assignee | null;
  description?: string | null;
  dueDate?: string | null;
}

export interface Member {
  role: "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string | null;
    email: string;
    title: string | null;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  tasks: Task[];
  members: Member[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  _count: {
    tasks: number;
  };
}
