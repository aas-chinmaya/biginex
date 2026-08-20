import { cn } from "./utils";

export function Separator({
  className,
}: {
  className?: string;
}) {
  return (
    <hr
      className={cn(
        "border-gray-200",
        className
      )}
    />
  );
}