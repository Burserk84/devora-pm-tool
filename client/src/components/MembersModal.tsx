"use client";

import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { inviteUserToProject } from "@/services/projectService";
import { useAuth } from "@/context/AuthContext";

// Define the types for the props
interface Member {
  role: "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string;
    email: string;
  };
}
interface Project {
  id: string;
  members: Member[];
}
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
      onMemberAdded(); // Tell the parent to refresh the project data
    } catch (err: unknown) {
      // Display the error message from the API
      setError(err.response?.data?.message || "Failed to send invitation.");
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
      onMemberAdded(); // Refresh the project data
    } catch (err: unknown) {
      alert(err.response?.data?.message || "Failed to update role.");
    }
  };

  // Determine if the current user is an admin of this project
  const currentUserMembership = project?.members.find(
    (m) => m.user.id === currentUser?.id
  );
  const isAdmin = currentUserMembership?.role === "ADMIN";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Members">
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Project Members</h3>
        <ul className="space-y-2">
          {project?.members.map(({ user, role }) => (
            <li
              key={user.id}
              className="flex justify-between items-center bg-slate-700 p-2 rounded-md"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>

              {/* The new role selector */}
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

      {/* Conditionally render the invite form only for admins */}
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
