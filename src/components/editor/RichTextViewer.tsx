"use client";

import { cn } from "@/lib/utils";

interface RichTextViewerProps {
  html?: string | null;
  className?: string;
  emptyText?: string;
}

export default function RichTextViewer({
  html,
  className,
  emptyText = "No content available.",
}: RichTextViewerProps) {
  const content = html?.trim();

  if (!content) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {emptyText}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none break-words",
        className
      )}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
}