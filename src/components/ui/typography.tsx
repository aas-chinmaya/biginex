import { cn } from "./utils";

export const H1 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      "text-4xl font-bold",
      className
    )}
    {...props}
  />
);

export const H2 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "text-3xl font-semibold",
      className
    )}
    {...props}
  />
);

export const Text = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      "text-gray-600",
      className
    )}
    {...props}
  />
);