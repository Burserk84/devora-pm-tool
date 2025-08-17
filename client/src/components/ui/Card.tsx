import { HTMLAttributes } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
