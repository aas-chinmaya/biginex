import { cva } from "class-variance-authority";
import { cn } from "./utils";

const badge = cva(
  "rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        success:
          "bg-green-100 text-green-700",
        warning:
          "bg-yellow-100 text-yellow-700",
        danger:
          "bg-red-100 text-red-700",
        primary:
          "bg-violet-100 text-violet-700",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export function Badge({
  variant,
  className,
  children,
}: any) {
  return (
    <span className={cn(badge({ variant }), className)}>
      {children}
    </span>
  );
}