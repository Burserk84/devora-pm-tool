import { Card } from "./Card";

export function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col animate-pulse">
      <div className="flex-grow space-y-3">
        {/* Title Placeholder */}
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        {/* Description Placeholders */}
        <div className="h-3 bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-700 rounded w-5/6"></div>
      </div>
      {/* Button Placeholders */}
      <div className="flex gap-2 mt-6">
        <div className="h-9 bg-slate-700 rounded w-full"></div>
        <div className="h-9 bg-slate-700 rounded w-24"></div>
      </div>
    </Card>
  );
}
