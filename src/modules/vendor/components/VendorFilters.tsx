"use client";
import { Search, Filter, RotateCcw, X } from "lucide-react";
import {
  Input,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";

interface VendorFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  type: string;
  onTypeChange: (value: string) => void;

  state: string;
  onStateChange: (value: string) => void;

  clearFilters: () => void;
}

export default function VendorFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  state,
  onStateChange,
  clearFilters,
}: VendorFiltersProps) {
  const hasActiveFilters =
    !!search ||
    (status && status !== "all") ||
    (type && type !== "all") ||
    (state && state !== "all");

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/50">
            <Filter size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Filters</h3>
            <p className="text-xs text-slate-400">Search and filter vendors</p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            className="h-8 gap-1.5 rounded-lg px-2.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <RotateCcw size={13} />
            Clear
          </Button>
        )}
      </div>

      {/* Filters grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative sm:col-span-2 xl:col-span-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search vendor…"
            className="h-10 rounded-xl border-slate-200 bg-slate-50/60 pl-9 pr-9 text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-sky-200"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Vendor Type */}
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white text-sm">
            <SelectValue placeholder="Vendor Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Supplier">Supplier</SelectItem>
            <SelectItem value="Wholesaler">Wholesaler</SelectItem>
            <SelectItem value="Distributor">Distributor</SelectItem>
            <SelectItem value="Manufacturer">Manufacturer</SelectItem>
            <SelectItem value="Importer">Importer</SelectItem>
            <SelectItem value="Service Provider">Service Provider</SelectItem>
          </SelectContent>
        </Select>

        {/* State */}
        <Select value={state} onValueChange={onStateChange}>
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white text-sm">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="Odisha">Odisha</SelectItem>
            <SelectItem value="West Bengal">West Bengal</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Gujarat">Gujarat</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="Telangana">Telangana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs font-medium text-slate-400">Active:</span>

          {search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              “{search}”
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-sky-100"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {status && status !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {status}
              <button
                type="button"
                onClick={() => onStatusChange("all")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-emerald-100"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {type && type !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
              {type}
              <button
                type="button"
                onClick={() => onTypeChange("all")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20-100"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {state && state !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              {state}
              <button
                type="button"
                onClick={() => onStateChange("all")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-amber-100"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}