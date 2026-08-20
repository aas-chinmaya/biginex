"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalRecords?: number;
  pageSize?: number;

  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const pages = [];

  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, page + 2);

  if (page <= 3) {
    end = Math.min(5, totalPages);
  }

  if (page >= totalPages - 2) {
    start = Math.max(1, totalPages - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-gray-500">
        {totalRecords !== undefined && (
          <>
            Total Records:
            <span className="ml-1 font-semibold text-gray-700">
              {totalRecords}
            </span>
          </>
        )}

        {pageSize && (
          <span className="ml-4">
            Page Size:
            <span className="ml-1 font-semibold text-gray-700">
              {pageSize}
            </span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </Button>

        {start > 1 && (
          <>
            <Button
              size="sm"
              variant={page === 1 ? "primary" : "outline"}
              onClick={() => onPageChange(1)}
            >
              1
            </Button>

            {start > 2 && (
              <span className="px-1 text-gray-400">...</span>
            )}
          </>
        )}

        {pages.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={page === item ? "primary" : "outline"}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="px-1 text-gray-400">...</span>
            )}

            <Button
              size="sm"
              variant={
                page === totalPages
                  ? "primary"
                  : "outline"
              }
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}