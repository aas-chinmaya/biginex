import * as React from "react";
import { cn } from "./utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-gray-300 p-3 focus:border-primary focus:ring-1 focus:ring-primary/30",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";