"use client";

import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export default function FormError({
  message,
  className = "",
}: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      className={`mt-1 flex items-center gap-1 text-sm text-red-600 ${className}`}
    >
      <AlertCircle size={15} />
      <span>{message}</span>
    </p>
  );
}