import { Atom } from "react-loading-indicators";

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
      <Atom color="#4f46e5" size="large" text="Loading..." textColor="#fff" />
    </div>
  );
}
