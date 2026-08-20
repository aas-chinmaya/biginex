"use client";

import { ReactNode } from "react";
import { cn } from "@/components/ui/utils";

interface ContainerProps {
  children: ReactNode;

  className?: string;

  fluid?: boolean;

  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "full";
}

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[1600px]",
  full: "max-w-full",
};

export default function Container({
  children,
  className,
  fluid = false,
  size = "2xl",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full",

        !fluid && "mx-auto",

        !fluid && sizes[size],

        "px-4",

        "sm:px-6",

        "lg:px-8",

        "xl:px-10",

        className
      )}
    >
      {children}
    </div>
  );
}