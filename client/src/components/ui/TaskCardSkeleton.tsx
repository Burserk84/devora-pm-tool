import { Card } from "./Card";

export function TaskCardSkeleton() {
  return (
    <Card className="p-3 bg-slate-700 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-4 bg-slate-600 rounded w-3/4"></div>
        <div className="h-4 w-4 bg-slate-600 rounded-full"></div>
      </div>
      <div className="mt-4 h-6 w-6 bg-slate-600 rounded-full"></div>
    </Card>
  );
}
