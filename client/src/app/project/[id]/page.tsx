"use client";

import { useEffect, useState } from "react";
import {
  getProjectById,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "@/services/projectService";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { TaskDetailsModal } from "@/components/TaskDetailsModal";
import { MembersModal } from "@/components/MembersModal";

interface Task {
  id: string;
  title: string;
  content: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee: {
    id: string;
    name: string;
    title: string | null;
  } | null;
}
interface Project {
  id: string;
  name: string;
  description: string | null;
  tasks: Task[];
}
const columns: Task["status"][] = ["TODO", "IN_PROGRESS", "DONE"];
const columnMap = { TODO: "To-Do", IN_PROGRESS: "In Progress", DONE: "Done" };

function TaskCard({
  task,
  onDelete,
  onClick,
}: {
  task: Task;
  onDelete: (taskId: string) => void;
  onClick: (taskId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    // The main div is now just a container for positioning
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        onClick={() => {
          console.log("1. Card component was clicked. Task ID:", task.id);
          onClick(task.id);
        }}
        className="p-3 bg-slate-700 group relative flex items-center justify-between cursor-pointer"
      >
        {/* === LEFT SIDE: Drag Handle and Title === */}
        <div className="flex items-center gap-2">
          {/* THE DRAG HANDLE */}
          <button
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400"
            aria-label="Drag task"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 3C5.55228 3 6 3.44772 6 4C6 4.55228 5.55228 5 5 5C4.44772 5 4 4.55228 4 4C4 3.44772 4.44772 3 5 3ZM5 7C5.55228 7 6 7.44772 6 8C6 8.55228 5.55228 9 5 9C4.44772 9 4 8.55228 4 8C4 7.44772 4.44772 7 5 7ZM6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12ZM11 3C11.5523 3 12 3.44772 12 4C12 4.55228 11.5523 5 11 5C10.4477 5 10 4.55228 10 4C10 3.44772 10.4477 3 11 3ZM12 8C12 7.44772 11.5523 7 11 7C10.4477 7 10 7.44772 10 8C10 8.55228 10.4477 9 11 9C11.5523 9 12 8.55228 12 8ZM11 11C11.5523 11 12 11.4477 12 12C12 12.5523 11.5523 13 11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11Z" />
            </svg>
          </button>
          <h3 className="font-semibold">{task.title}</h3>
          {task.assignee && (
            <div
              title={task.assignee.name || ""}
              className="h-6 w-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold"
            >
              {task.assignee.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* === RIGHT SIDE: Delete Button === */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="z-10 ..."
        >
          &#x2715;
        </button>
      </Card>
    </div>
  );
}
// --- DROPPABLE KANBAN COLUMN ---
function KanbanColumn({
  status,
  tasks,
  onDeleteTask,
  onTaskClick,
}: {
  status: Task["status"];
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className="flex-1 bg-slate-800 p-4 rounded-lg">
      <h2 className="font-bold text-lg mb-4">{columnMap[status]}</h2>
      <SortableContext items={tasks.map((t) => t.id)}>
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onClick={onTaskClick}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { user: currentUser, token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // This useEffect waits for the user to stop typing for 500ms before updating
  // the 'debouncedSearchTerm', which prevents an API call on every keystroke.
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const fetchProject = () => {
    if (token) {
      // Pass the filters to the API call
      getProjectById(params.id, {
        search: debouncedSearchTerm,
        assigneeId: assigneeFilter,
      })
        .then((data) => {
          setProject(data);
          setTasks(data.tasks);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [params.id, token, debouncedSearchTerm, assigneeFilter]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !project) return;
    try {
      await createTask({ title: newTaskTitle, projectId: project.id });
      setNewTaskTitle("");
      fetchProject();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log(
      "2. handleDeleteTask function called in ProjectPage. ID:",
      taskId
    );

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks((currentTasks) => currentTasks.filter((t) => t.id !== taskId));
      } catch (error) {
        console.error("Failed to delete task", error);
        alert("Could not delete task.");
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeTask = tasks.find((t) => t.id === activeId);
    const overColumnStatus = columns.find((status) => status === overId);
    if (
      !activeTask ||
      !overColumnStatus ||
      activeTask.status === overColumnStatus
    ) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((t) =>
        t.id === activeId ? { ...t, status: overColumnStatus } : t
      )
    );

    updateTaskStatus(activeId, overColumnStatus).catch((err) => {
      console.error("Failed to update task status:", err);
      setTasks(tasks);
      alert("Failed to move task. Please try again.");
    });
  };

  if (!project) return <div>Loading board...</div>;

  const currentUserRole = project.members.find(
    (member) => member.user.id === currentUser?.id
  )?.role;

  const isAdmin = currentUserRole === "ADMIN";

  return (
    <div>
      {/* Container for the back arrow and title */}
      <div className="flex items-center gap-4 mb-2">
        {/* The "Go Back" Link */}
        <Link
          href="/"
          className="text-slate-400 hover:text-slate-50 rounded-full p-2 transition-colors"
          aria-label="Go back to projects"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5"></path>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Button onClick={() => setIsMembersModalOpen(true)}>Share</Button>
      </div>

      <div className="flex gap-4 mb-8">
        {/* Search Input */}
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Assignee Filter Dropdown */}
        <div>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full h-full rounded-md border-slate-700 bg-slate-900 px-3 py-2"
          >
            <option value="">All Assignees</option>
            {project.members.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isAdmin && (
        <form onSubmit={handleCreateTask} className="flex gap-2 mb-8 max-w-sm">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
          />
          <Button type="submit">Add Task</Button>
        </form>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6">
          {columns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              onDeleteTask={handleDeleteTask}
              onTaskClick={(taskId) => setSelectedTaskId(taskId)}
            />
          ))}
        </div>
      </DndContext>

      <MembersModal
        project={project}
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        onMemberAdded={fetchProject}
      />

      <TaskDetailsModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdate={fetchProject}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
