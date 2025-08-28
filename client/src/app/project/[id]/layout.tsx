"use client";

import { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { ProjectProvider, useProject } from "@/context/ProjectContext";
import { MembersModal } from "@/components/MembersModal";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const baseProjectUrl = `/project/${projectId}`;

  const navLinks = [
    { href: baseProjectUrl, label: "Board" },
    { href: `${baseProjectUrl}/members`, label: "Members" },
    { href: `${baseProjectUrl}/chat`, label: "Chat" },
  ];

  return (
    <nav className="flex gap-4 border-b border-slate-700 mb-8">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`py-3 px-1 border-b-2 transition-colors ${
            pathname.endsWith(link.href)
              ? "border-indigo-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function ProjectLayoutContent({ children }: { children: React.ReactNode }) {
  const { project, isLoading, fetchProject } = useProject();
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const { user: currentUser } = useAuth();

  if (isLoading || !project) {
    // A simple loading state for the shell
    return (
      <div>
        <div className="h-9 w-1/2 bg-slate-700 rounded-md mb-4 animate-pulse"></div>
        <div className="h-12 w-full bg-slate-800 rounded-md mb-8 animate-pulse"></div>
      </div>
    );
  }

  const currentUserRole = project.members.find(
    (member) => member.user.id === currentUser?.id
  )?.role;
  const isAdmin = currentUserRole === "ADMIN";

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-50 rounded-full p-2"
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
        </div>
        {isAdmin && (
          <Button onClick={() => setIsMembersModalOpen(true)}>Share</Button>
        )}
      </div>
      <ProjectNav projectId={project.id} />
      <div>{children}</div>
      <MembersModal
        project={project}
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        onMemberAdded={fetchProject}
      />
    </div>
  );
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.id as string; 

  return (
    <ProjectProvider projectId={projectId}>
      <ProjectLayoutContent>{children}</ProjectLayoutContent>
    </ProjectProvider>
  );
}
