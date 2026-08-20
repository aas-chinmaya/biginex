"use client";

import { ReactNode } from "react";
import { Label } from "../ui/label";
import FormError from "./FormError";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export default function FormField({
  label,
  required,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </Label>
      )}

      {children}

      <FormError message={error} />
    </div>
  );
}