import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const fieldBase =
  "w-full rounded-lg border-0 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-900 ring-1 ring-inset ring-ink-100 placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-signal-500 transition-colors";

export function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-ink-700">
      {children}
      {required && <span className="ml-0.5 text-signal-500">*</span>}
    </label>
  );
}

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(fieldBase, "resize-none", className)} {...props} />;
});

export const Select = forwardRef(function Select({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(fieldBase, "appearance-none pr-9 cursor-pointer", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
    </div>
  );
});

export function FormRow({ children, cols = 2 }) {
  return (
    <div className={cn("grid gap-4", cols === 2 ? "grid-cols-2" : "grid-cols-1")}>{children}</div>
  );
}
