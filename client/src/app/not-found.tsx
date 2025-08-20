import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-9xl font-bold text-indigo-500">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-slate-400 mt-2 max-w-sm">
        Sorry, we couldn&apos;t find the page you were looking for. It might
        have been moved or deleted.
      </p>
      <Link href="/" className="mt-8">
        <Button>Go Back to Dashboard</Button>
      </Link>
    </div>
  );
}
