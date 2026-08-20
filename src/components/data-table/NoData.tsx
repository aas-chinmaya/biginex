"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

interface NoDataProps {
  title?: string;
  description?: string;
  buttonText?: string;

  onReset?: () => void;

  icon?: React.ReactNode;

  className?: string;
}

export default function NoData({
  title = "No matching records",
  description = "Try changing your search or filters.",
  buttonText = "Clear Filters",
  onReset,
  icon,
  className,
}: NoDataProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "rounded-xl border border-dashed border-gray-300",
        "bg-white px-8 py-16 text-center",
        className
      )}
    >
      <div className="mb-5 rounded-full bg-gray-100 p-4">
        {icon ?? (
          <SearchX
            className="h-10 w-10 text-gray-400"
            strokeWidth={1.5}
          />
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        {description}
      </p>

      {onReset && (
        <Button
          className="mt-6"
          variant="outline"
          onClick={onReset}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}