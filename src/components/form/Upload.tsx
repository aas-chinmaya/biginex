"use client";

import { UploadCloud, X, FileText } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface UploadProps {
  value?: File | null;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
  preview?: boolean;
  onChange?: (file: File | null) => void;
}

export default function Upload({
  value,
  accept,
  maxSize = 5 * 1024 * 1024,
  disabled,
  preview = false,
  onChange,
}: UploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange?.(acceptedFiles[0] ?? null);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      disabled,
      multiple: false,
    });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          rounded-xl
          border-2
          border-dashed
          p-8
          cursor-pointer
          text-center
          transition

          ${
            isDragActive
              ? "border-primary/60 bg-violet-50"
              : "border-gray-300 hover:border-primary/50"
          }
        `}
      >
        <input {...getInputProps()} />

        <UploadCloud
          className="mx-auto mb-4 text-primary"
          size={40}
        />

        <h3 className="font-semibold">
          Drag & Drop
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          or click to browse
        </p>
      </div>

      {value && (
        <div className="mt-4 flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            {preview &&
            value.type?.startsWith("image") ? (
              <Image
                src={URL.createObjectURL(value)}
                alt={value.name}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
            ) : (
              <FileText />
            )}

            <div>
              <p className="font-medium">
                {value.name}
              </p>

              <p className="text-xs text-gray-500">
                {(value.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange?.(null)}
          >
            <X />
          </button>
        </div>
      )}
    </div>
  );
}