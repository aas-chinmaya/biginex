"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, FileText, Info, CheckCircle2 } from "lucide-react";

import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { FormField, FileUpload } from "@/components/form";

import { useMasterData } from "../../hooks/useMasterData";
import { BusinessSetupData } from "../../validation";

export default function DocumentsStep() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BusinessSetupData>();

  const { documentTypes } = useMasterData();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 to-transparent p-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Info className="h-4 w-4" />
        </span>
        <p className="text-sm leading-relaxed text-gray-600">
          Documents are optional at this stage — you can upload GST
          certificates, PAN, registration proof and more now, or add
          them later.
        </p>
      </div>

      {fields.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 py-12 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            No documents added yet
          </p>
          <p className="mt-1 text-xs text-muted">
            Add a document below, or skip and add it later
          </p>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const docErrors = errors.documents?.[index];
          const file = watch(`documents.${index}.file`);
          const documentType = watch(`documents.${index}.documentType`);

          return (
            <div
              key={field.id}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/80 shadow-[0_20px_40px_-25px_rgba(15,23,42,0.25)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent px-5 py-3.5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <h4 className="truncate text-sm font-semibold text-gray-800">
                    {documentTypes.find((d) => d.id === documentType)?.name ||
                      `Document ${index + 1}`}
                  </h4>
                  {file && (
                    <span className="hidden items-center gap-1 text-[11px] font-medium text-green-600 sm:inline-flex">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Ready
                    </span>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="shrink-0 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Remove
                </Button>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-[1fr_1fr] sm:p-6">
                <FormField
                  label="Document Type"
                  required
                  error={docErrors?.documentType?.message}
                >
                  <Select
                    value={documentType}
                    onValueChange={(v) =>
                      setValue(`documents.${index}.documentType`, v, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="File" required>
                  <FileUpload
                    value={file}
                    onChange={(f) =>
                      setValue(`documents.${index}.file`, f, {
                        shouldValidate: true,
                      })
                    }
                  />
                </FormField>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          append({ documentType: "", file: null, fileName: "", fileUrl: "" })
        }
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed",
          "border-gray-200 py-5 text-sm font-medium text-gray-500",
          "transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
        )}
      >
        <Plus className="h-4 w-4" />
        Add Document
      </button>
    </div>
  );
}
