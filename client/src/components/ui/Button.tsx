import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

// We can define variants here in the future if we want
// e.g., 'primary', 'secondary', 'destructive'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white",
        "hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
