"use client";

import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/Card";

export default function MembersPage() {
  const { project, isLoading } = useProject();

  if (isLoading) {
    // This loading state will likely not be seen much, as the layout has its own
    return <div>Loading members...</div>;
  }

  if (!project) return null; // The layout handles the "not found" case

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">
        Project Members ({project.members.length})
      </h2>
      <div className="space-y-4">
        {project.members.map(({ user, role }) => (
          <Card key={user.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{user.name}</p>
              <p className="text-slate-400">{user.title || user.email}</p>
            </div>
            <span className="text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
              {role}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
