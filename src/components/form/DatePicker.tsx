"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface DatePickerProps {
  value?: Date;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  onChange?: (date?: Date) => void;
}

export default function DatePicker({
  value,
  placeholder = "Select date",
  disabled = false,
  minDate,
  maxDate,
  className,
  onChange,
}: DatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(value);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleSelect = (date?: Date) => {
    setSelected(date);
    onChange?.(date);
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${className ?? ""}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex
          h-10
          w-full
          items-center
          justify-between
          rounded-lg
          border
          border-gray-300
          bg-white
          px-3
          text-left
          text-sm
          transition
          hover:border-primary-500
          focus:outline-none
          focus:ring-1
          focus:ring-primary-500
          focus:border-primary-500
          disabled:bg-gray-100
        "
      >
        <span
          className={
            selected ? "text-primary-900" : "text-gray-400"
          }
        >
          {selected
            ? format(selected, "dd MMM yyyy")
            : placeholder}
        </span>

        <CalendarIcon
          className="text-gray-500"
          size={18}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 rounded-xl border bg-white p-4 shadow-xl">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={[
              ...(minDate
                ? [{ before: minDate }]
                : []),
              ...(maxDate
                ? [{ after: maxDate }]
                : []),
            ]}
          />
        </div>
      )}
    </div>
  );
}