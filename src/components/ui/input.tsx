import * as React from "react";
import { cn } from "./utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-gray-300 px-4 py-2 outline-none",
        "focus:border-primary focus:ring-1 focus:ring-primary/30",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";