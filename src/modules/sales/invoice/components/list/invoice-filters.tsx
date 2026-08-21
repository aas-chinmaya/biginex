"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InvoiceFiltersProps = {
  value: string;
  onChange: (value: string) => void;
  showDraftsOnly?: boolean;
  period?: string;
  onPeriodChange?: (value: string) => void;
};

export default function InvoiceFilters({
  value,
  onChange,
  showDraftsOnly = false,
  period = "all",
  onPeriodChange,
}: InvoiceFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={value || "all"}
        onValueChange={(next) =>
          onChange(next === "all" ? "" : next)
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All statuses
          </SelectItem>

          {showDraftsOnly ? (
            <SelectItem value="DRAFT">
              Draft
            </SelectItem>
          ) : (
            <>
              <SelectItem value="ISSUED">
                Issued
              </SelectItem>

              <SelectItem value="PAID">
                Paid
              </SelectItem>

              <SelectItem value="CANCELLED">
                Cancelled
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <Select
        value={period || "all"}
        onValueChange={(next) =>
          onPeriodChange?.(
            next === "all" ? "all" : next
          )
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All time" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All time
          </SelectItem>

          <SelectItem value="today">
            Today
          </SelectItem>

          <SelectItem value="7d">
            Last 7 days
          </SelectItem>

          <SelectItem value="30d">
            Last 30 days
          </SelectItem>

          <SelectItem value="month">
            This month
          </SelectItem>

          <SelectItem value="year">
            This year
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}