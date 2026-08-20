"use client";

import { useRef } from "react";
import { ShieldCheck } from "lucide-react";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  title?: string;
  description?: string;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  title = "Verify OTP",
  description = "Enter the 6-digit verification code sent to your registered mobile number or email.",
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    index: number,
    inputValue: string
  ) => {
    if (!/^\d*$/.test(inputValue)) return;

    const newValue = [...value];
    newValue[index] = inputValue.slice(-1);

    onChange(newValue);

    if (inputValue && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !value[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    const values = pasted.split("");

    while (values.length < length) {
      values.push("");
    }

    onChange(values);

    inputs.current[
      Math.min(pasted.length, length - 1)
    ]?.focus();
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck
            size={30}
            className="text-primary"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-2 text-gray-500">
          {description}
        </p>
      </div>

      {/* OTP Boxes */}
      <div className="flex justify-center gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) =>
              handleChange(index, e.target.value)
            }
            onKeyDown={(e) =>
              handleKeyDown(index, e)
            }
            onPaste={handlePaste}
            className="
              h-14
              w-14
              rounded-xl
              border
              text-center
              text-xl
              font-bold
              outline-none
              transition-all
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          />
        ))}
      </div>
    </div>
  );
}