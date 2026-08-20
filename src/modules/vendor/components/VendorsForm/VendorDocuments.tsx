"use client";

import { useState } from "react";
import { Upload, FileText, Trash2, Plus, Paperclip } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";

import { FileUpload, FormField } from "@/components/form";
import { vendorApi } from "@/modules/vendor/api/vendor.api";
import { notify } from "@/lib/toast";

interface Props {
  form: UseFormReturn<any>;
}

export default function VendorDocuments({ form }: Props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const documentErrors = errors.documents as any;
  const documents = watch("documents") as Array<any>;

  const handleFileUpload =
    (index: number) => (file: File | null) => {
      if (!file) {
        setValue(`documents.${index}.file`, undefined);
        setValue(`documents.${index}.fileUrl`, "");
        return;
      }

      setValue(`documents.${index}.file`, file);
      setValue(`documents.${index}.fileUrl`, URL.createObjectURL(file));
    };

  const addDocument = () => {
    append({
      documentType: "",
      fileUrl: "",
      file: undefined,
    });
  };

  const handleDocumentTypeChange = (index: number, value: string) => {
    const docs = watch("documents") as Array<any>;

    // find existing index with same type
    const existingIndex = docs.findIndex((d: any, i: number) => d?.documentType === value && i !== index);
    if (existingIndex !== -1) {
      // remove previous entry so types remain unique
      remove(existingIndex);
      // if the removed index is before current index, adjusting index required by caller, but setValue will still work
    }

    setValue(`documents.${index}.documentType`, value);

    // update a helper array `documentTypes` in form state for upload
    const updated = (watch("documents") || []).map((d: any) => d?.documentType).filter(Boolean);
    setValue("documentTypes", updated);
  };

  const handleDeleteDocument = async (documentId: string, index: number) => {
    if (!documentId) {
      remove(index);
      return;
    }

    try {
      setDeletingDocumentId(documentId);
      await vendorApi.deleteDocument(documentId);
      notify.success("Document deleted successfully.");
      remove(index);
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message ||
        "Failed to delete document"
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  return (
    <section className="rounded-3xl bg-rose-50/60 p-1">
      <div className="rounded-[22px] bg-white p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-white">
              <Paperclip size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Documents
              </h2>
              <p className="text-sm text-slate-500">
                Certificates and supporting files
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addDocument}
            className="gap-1.5 rounded-xl"
          >
            <Plus size={14} />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const document = documents?.[index] ?? {};
            const fieldError = documentErrors?.[index] as any;

            return (
              <div
                key={field.id}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                  <FormField
                    label="Document Type"
                    error={fieldError?.documentType?.message}
                  >
                    <Select
                      value={document?.documentType ?? ""}
                      onValueChange={(value) =>
                        setValue(`documents.${index}.documentType`, value)
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GST_CERTIFICATE">
                          GST Certificate
                        </SelectItem>
                        <SelectItem value="PAN_CARD">PAN Card</SelectItem>
                        <SelectItem value="AADHAAR_CARD">
                          Aadhaar Card
                        </SelectItem>
                        <SelectItem value="MSME_CERTIFICATE">
                          MSME Certificate
                        </SelectItem>
                        <SelectItem value="UDYAM_CERTIFICATE">
                          Udyam Certificate
                        </SelectItem>
                        <SelectItem value="TAN_CERTIFICATE">
                          TAN Certificate
                        </SelectItem>
                        <SelectItem value="CIN_CERTIFICATE">
                          CIN Certificate
                        </SelectItem>
                        <SelectItem value="IEC_CERTIFICATE">
                          IEC Certificate
                        </SelectItem>
                        <SelectItem value="TRADE_LICENSE">
                          Trade License
                        </SelectItem>
                        <SelectItem value="SHOP_ESTABLISHMENT">
                          Shop Establishment
                        </SelectItem>
                        <SelectItem value="FSSAI_LICENSE">
                          FSSAI License
                        </SelectItem>
                        <SelectItem value="DRUG_LICENSE">
                          Drug License
                        </SelectItem>
                        <SelectItem value="PARTNERSHIP_DEED">
                          Partnership Deed
                        </SelectItem>
                        <SelectItem value="LLP_AGREEMENT">
                          LLP Agreement
                        </SelectItem>
                        <SelectItem value="INCORPORATION_CERTIFICATE">
                          Incorporation Certificate
                        </SelectItem>
                        <SelectItem value="MEMORANDUM_OF_ASSOCIATION">
                          MOA
                        </SelectItem>
                        <SelectItem value="ARTICLES_OF_ASSOCIATION">
                          AOA
                        </SelectItem>
                        <SelectItem value="CANCELLED_CHEQUE">
                          Cancelled Cheque
                        </SelectItem>
                        <SelectItem value="BANK_STATEMENT">
                          Bank Statement
                        </SelectItem>
                        <SelectItem value="ADDRESS_PROOF">
                          Address Proof
                        </SelectItem>
                        <SelectItem value="ID_PROOF">ID Proof</SelectItem>
                        <SelectItem value="AGREEMENT">Agreement</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="PURCHASE_AGREEMENT">
                          Purchase Agreement
                        </SelectItem>
                        <SelectItem value="NDA">NDA</SelectItem>
                        <SelectItem value="ISO_CERTIFICATE">
                          ISO Certificate
                        </SelectItem>
                        <SelectItem value="INSURANCE_CERTIFICATE">
                          Insurance Certificate
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="File" error={fieldError?.file?.message}>
                    <FileUpload
                      value={document?.file ?? null}
                      onChange={handleFileUpload(index)}
                    />
                  </FormField>

                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={deletingDocumentId === document?.id}
                      onClick={() => handleDeleteDocument(document?.id, index)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:text-rose-200"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {document?.fileUrl && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-600">
                    <FileText size={14} className="shrink-0 text-rose-500" />
                    <span className="truncate">
                      {document.documentType?.replace(/_/g, " ") ||
                        "Document ready"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {fields.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 py-12 text-center">
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-400">
                <Paperclip size={18} />
              </div>
              <p className="text-sm font-medium text-slate-700">
                No documents yet
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Click Add to attach files
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
