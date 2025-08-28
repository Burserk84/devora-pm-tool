import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "block w-full rounded-md border-slate-700 bg-slate-900 px-3 py-2",
          "placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
