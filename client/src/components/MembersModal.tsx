"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import {
  inviteUserToProject,
  updateMemberRole,
} from "@/services/projectService";
import { useAuth } from "@/context/AuthContext";
import type { Project, Member } from "@/types";
import { AxiosError } from "axios";

interface MembersModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

export function MembersModal({
  project,
  isOpen,
  onClose,
  onMemberAdded,
}: MembersModalProps) {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setIsInviting(true);
    setError(null);
    try {
      await inviteUserToProject(project.id, email);
      setEmail("");
      onMemberAdded();
    } catch (err) {
      let errorMessage = "Failed to send invitation.";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (
    memberId: string,
    newRole: "ADMIN" | "MEMBER"
  ) => {
    if (!project) return;
    try {
      await updateMemberRole(project.id, memberId, newRole);
      onMemberAdded();
    } catch (err) {
      let errorMessage = "Failed to update role.";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      alert(errorMessage);
    }
  };

  const currentUserMembership = project?.members.find(
    (m) => m.user.id === currentUser?.id
  );
  const isAdmin = currentUserMembership?.role === "ADMIN";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Members">
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Project Members</h3>
        <ul className="space-y-2">
          {project?.members.map(({ user, role }: Member) => (
            <li
              key={user.id}
              className="flex justify-between items-center bg-slate-700 p-2 rounded-md"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                {user.title && (
                  <p className="text-sm text-slate-400">{user.title}</p>
                )}
              </div>
              <select
                value={role}
                onChange={(e) =>
                  handleRoleChange(
                    user.id,
                    e.target.value as "ADMIN" | "MEMBER"
                  )
                }
                disabled={!isAdmin || user.id === currentUser?.id}
                className="bg-slate-600 text-slate-300 px-2 py-1 rounded-md text-xs disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
      {isAdmin && (
        <div>
          <h3 className="font-semibold mb-2">Invite New Member</h3>
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow"
            />
            <Button type="submit" disabled={isInviting}>
              {isInviting ? "Inviting..." : "Invite"}
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
