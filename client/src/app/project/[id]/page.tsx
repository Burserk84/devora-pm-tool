"use client";

import { useState, useMemo, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import {
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
import { TaskDetailsModal } from "@/components/TaskDetailsModal";
import { TaskCardSkeleton } from "@/components/ui/TaskCardSkeleton";
import type { Task } from "@/types";
import { motion } from "framer-motion";

// --- CONSTANTS ---
const columns: Task["status"][] = ["TODO", "IN_PROGRESS", "DONE"];
const columnMap = { TODO: "To-Do", IN_PROGRESS: "In Progress", DONE: "Done" };

// --- SUB-COMPONENTS ---
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
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <Card
        onClick={() => onClick(task.id)}
        className="p-3 bg-slate-700 group relative flex flex-col items-start gap-2 cursor-pointer"
      >
        <div className="w-full flex justify-between items-start">
          <div className="flex items-center gap-2">
            <button
              {...listeners}
              onMouseDown={(e) => e.stopPropagation()}
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
                <path d="M5 3C5.55228 3 6 3.44772 6 4C6 4.55228 5.55228 5 5 5C4.44772 5 4 4.55228 4 4C4 3.44772 4.44772 3 5 3ZM5 7C5.55228 7 6 7.44772 6 8C6 8.55228 5.55228 9 5 9C4.44772 9 4 8.55228 4 8C4 7.44772 4.44772 7 5 7ZM6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12ZM11 3C11.5523 3 12 3.44772 12 4C12 4.55228 11.5523 5 11 5C10.4477 5 10 4.55228 10 4C10 3.44772 10.4477 3 11 3ZM12 8C12 7.44772 11.5523 7 11 7C10.4477 7 10 7.44772 10 8C10 8.55228 10.4477 9 11 9C11.5523 9 12 8.55288 12 8ZM11 11C11.5523 11 12 11.4477 12 12C12 12.5523 11.5523 13 11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11Z" />
              </svg>
            </button>
            <h3 className="font-semibold">{task.title}</h3>
          </div>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="absolute top-2 right-2 z-10 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete task"
          >
            &#x2715;
          </button>
        </div>
        {task.assignee && (
          <div
            title={task.assignee.name || ""}
            className="h-6 w-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold ml-8"
          >
            {task.assignee.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
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
    <div
      ref={setNodeRef}
      className="flex-1 bg-slate-800 p-4 rounded-lg min-h-[300px]"
    >
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

// --- MAIN PAGE COMPONENT ---
export default function ProjectBoardPage() {
  const { project, isLoading, fetchProject } = useProject();
  const { user: currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  useEffect(() => {
    if (project?.tasks) {
      setTasks(project.tasks);
    }
  }, [project]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchMatch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const assigneeMatch =
        !assigneeFilter || task.assignee?.id === assigneeFilter;
      return searchMatch && assigneeMatch;
    });
  }, [tasks, searchTerm, assigneeFilter]);

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
    if (window.confirm("Are you sure you want to delete this task?")) {
      const originalTasks = tasks;
      setTasks((currentTasks) => currentTasks.filter((t) => t.id !== taskId));
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error("Failed to delete task", error);
        setTasks(originalTasks);
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
    )
      return;
    const originalTasks = tasks;
    setTasks((currentTasks) =>
      currentTasks.map((t) =>
        t.id === activeId ? { ...t, status: overColumnStatus } : t
      )
    );
    updateTaskStatus(activeId, overColumnStatus).catch((err) => {
      console.error("Failed to update task status:", err);
      setTasks(originalTasks);
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex gap-4 mb-8">
          <div className="h-10 bg-slate-800 rounded-md flex-grow animate-pulse"></div>
          <div className="h-10 bg-slate-800 rounded-md w-[200px] animate-pulse"></div>
        </div>
        <div className="flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 bg-slate-800 p-4 rounded-lg">
              <div className="h-6 w-1/3 bg-slate-700 rounded-md mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <TaskCardSkeleton />
                <TaskCardSkeleton />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) return null;

  const currentUserRole = project.members.find(
    (member) => member.user.id === currentUser?.id
  )?.role;
  const isAdmin = currentUserRole === "ADMIN";

  return (
    <div>
      <div className="flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search tasks by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="w-full max-w-[200px] h-full rounded-md border-slate-700 bg-slate-900 px-3 py-2"
        >
          <option value="">All Assignees</option>
          {project.members.map((member) => (
            <option key={member.user.id} value={member.user.id}>
              {member.user.name}
            </option>
          ))}
        </select>
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
              tasks={filteredTasks.filter((task) => task.status === status)}
              onDeleteTask={handleDeleteTask}
              onTaskClick={(taskId) => setSelectedTaskId(taskId)}
            />
          ))}
        </div>
      </DndContext>
      <TaskDetailsModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdate={fetchProject}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
