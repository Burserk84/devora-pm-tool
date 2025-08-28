"use client";

import { useEffect, useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { getTaskById, getUsers, updateTask } from "@/services/projectService";
import type { Task } from "@/types"; // <-- IMPORT a single source of truth

interface User {
  id: string;
  name: string | null;
}
interface TaskDetailsModalProps {
  taskId: string | null;
  onClose: () => void;
  onTaskUpdate: () => void;
  currentUserRole: "ADMIN" | "MEMBER" | undefined;
}

const formatDateForInput = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

export function TaskDetailsModal({
  taskId,
  onClose,
  onTaskUpdate,
  currentUserRole,
}: TaskDetailsModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  useEffect(() => {
    if (taskId) {
      setIsLoading(true);
      Promise.all([getTaskById(taskId), getUsers()])
        .then(([taskData, usersData]) => {
          setUsers(usersData);
          setTitle(taskData.title || "");
          setDescription(taskData.description || "");
          setDueDate(formatDateForInput(taskData.dueDate));
          setAssigneeId(taskData.assigneeId || "");
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) return;
    try {
      await updateTask(taskId, {
        title,
        description,
        dueDate,
        assigneeId: assigneeId || null,
      });
      onTaskUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update task", error);
      alert("Failed to save changes.");
    }
  };

  const isAdmin = currentUserRole === "ADMIN";
  const isOpen = !!taskId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-300"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="block w-full rounded-md border-slate-700 bg-slate-900 px-3 py-2 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-slate-300"
            >
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={!isAdmin}
            />
          </div>
          <div>
            <label
              htmlFor="assignee"
              className="block text-sm font-medium text-slate-300"
            >
              Assign to
            </label>
            <select
              id="assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="block w-full rounded-md border-slate-700 bg-slate-900 px-3 py-2 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={!isAdmin}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
