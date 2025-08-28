"use client";

import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/Card";
import type { Member } from "@/types"; 

export default function MembersPage() {
  const { project, isLoading } = useProject();

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <div className="h-8 w-1/2 bg-slate-700 rounded-md mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="p-4 flex justify-between items-center animate-pulse"
            >
              <div>
                <div className="h-5 w-32 bg-slate-700 rounded-md"></div>
                <div className="h-4 w-48 bg-slate-700 rounded-md mt-2"></div>
              </div>
              <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">
        Project Members ({project.members.length})
      </h2>
      <div className="space-y-4">
        {project.members.map(({ user, role }: Member) => (
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
