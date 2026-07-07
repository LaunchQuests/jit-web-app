import { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-2xl border border-line bg-white/80 px-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary dark:bg-slate-950/40",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary dark:bg-slate-950/40",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[28px] border border-line bg-card shadow-soft", className)} {...props} />;
}