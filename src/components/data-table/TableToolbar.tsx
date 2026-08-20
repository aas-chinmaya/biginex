"use client";

import { ReactNode } from "react";
import { cn } from "@/components/ui/utils";


interface TableToolbarProps {
  children?: ReactNode;
  className?: string;
}


export default function TableToolbar({
  children,
  className,
}: TableToolbarProps) {

  return (

    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-white p-4",

        "sm:flex-row sm:items-center sm:justify-between",

        className
      )}
    >

      {children}

    </div>

  );
}