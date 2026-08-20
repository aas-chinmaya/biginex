"use client";

import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/components/ui/utils";
import { MasterOption } from "../types";

interface OptionCardGroupProps {
  name: string;
  options: MasterOption[];
  value?: string;
  onChange: (value: string) => void;
  getIcon: (id?: string) => LucideIcon;
  loading?: boolean;
  hasError?: boolean;
}

export default function OptionCardGroup({
  name,
  options,
  value,
  onChange,
  getIcon,
  loading = false,
  hasError = false,
}: OptionCardGroupProps) {
  /*
   * Loading state
   */
  if (loading) {
    return (
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-4
          xl:grid-cols-6
          2xl:grid-cols-8
          gap-3
          w-full
        "
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="
              min-h-[110px]
              animate-pulse
              rounded-lg
              border
              border-slate-100
              bg-slate-50
            "
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="
        grid
        grid-cols-2
        sm:grid-cols-4
        xl:grid-cols-6
        2xl:grid-cols-8
        gap-3
        w-full
      "
    >
      {options.map((option) => {
        const Icon = getIcon(option.id);
        const selected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              `
                group
                relative
                flex
                min-h-[110px]
                w-full
                flex-col
                items-center
                justify-center
                rounded-lg
                border
                px-3
                py-3
                text-center
                transition-all
                duration-150
              `,

              "focus:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary/30",
              "focus-visible:ring-offset-2",

              selected
                ? "border-primary bg-primary/5"
                : hasError
                  ? "border-rose-300 bg-rose-50/70"
                  : "border-slate-100 bg-white hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm"
            )}
          >
            {/* Selected check */}
            {selected && (
              <span
                className="
                  absolute
                  right-2
                  top-2
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-primary
                  text-white
                "
              >
                <Check
                  className="h-3 w-3"
                  strokeWidth={3}
                />
              </span>
            )}

            {/* Icon */}
            <span
              className={cn(
                `
                  mb-2
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  transition-colors
                  duration-150
                `,
                selected
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <Icon
                className="h-8 w-8"
                strokeWidth={1.8}
              />
            </span>

            {/* Title */}
            <span
              className={cn(
                `
                  block
                  w-full
                  truncate
                  text-sm
                  font-medium
                  leading-tight
                `,
                selected
                  ? "text-primary"
                  : "text-slate-700"
              )}
            >
              {option.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}