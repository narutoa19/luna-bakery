"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-wood font-semibold tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn("input-field", error && "border-red-300", className)}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-wood font-semibold tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <textarea ref={ref} className={cn("input-field resize-none", className)} {...props} />
    </div>
  )
);
Textarea.displayName = "Textarea";
