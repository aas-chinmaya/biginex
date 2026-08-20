"use client";

import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  Pencil,
  CreditCard,
  MapPin,
  Building2,
  Landmark,
  FileText,
  PartyPopper,
  Phone,
  Mail,
  ImageOff,
} from "lucide-react";

import { Badge, Button, Separator } from "@/components/ui";
import { cn } from "@/components/ui/utils";

import { useMasterData } from "../../hooks/useMasterData";
import { BusinessSetupData } from "../../validation";

interface Props {
  onEdit: (stepIndex: number) => void;
}

type Tint = "blue" | "violet" | "teal" | "amber" | "rose";

const tintClasses: Record<Tint, string> = {
  blue: "bg-primary/10 text-primary",
  violet: "bg-violet-100 text-violet-600",
  teal: "bg-teal-100 text-teal-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-gray-800">{value}</span>
    </div>
  );
}

function SummaryCard({
  title,
  icon: Icon,
  tint = "blue",
  stepIndex,
  onEdit,
  children,
}: {
  title: string;
  icon: React.ElementType;
  tint?: Tint;
  stepIndex: number;
  onEdit: (i: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/80 p-5 shadow-[0_20px_40px_-25px_rgba(15,23,42,0.25)] sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              tintClasses[tint]
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(stepIndex)}
        >
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
      </div>
      <Separator className="mb-2" />
      {children}
    </div>
  );
}

export default function ReviewStep({ onEdit }: Props) {
  const { watch } = useFormContext<BusinessSetupData>();
  const data = watch();

  const {
    businessTypes,
    businessCategories,
    industries,
    currencies,
    countries,
  } = useMasterData();

  const nameOf = (list: { id: string; name: string }[], id?: string) =>
    list.find((i) => i.id === id)?.name ?? id;

  const logoPreview = useMemo(() => {
    const logo = data.info.logo;
    if (logo instanceof File) {
      return URL.createObjectURL(logo);
    }
    return null;
  }, [data.info.logo]);

  useEffect(() => {
    if (!logoPreview) return;
    return () => URL.revokeObjectURL(logoPreview);
  }, [logoPreview]);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 to-transparent p-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PartyPopper className="h-4 w-4" />
        </span>
        <p className="text-sm leading-relaxed text-gray-600">
          Almost done — review everything below before you submit. You
          can jump back to any step to make changes.
        </p>
      </div>

      {/* Identity header with logo preview */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/80 p-5 shadow-[0_20px_40px_-25px_rgba(15,23,42,0.25)] sm:p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
          {logoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoPreview}
              alt="Business logo preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageOff className="h-6 w-6 text-primary/40" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-text">
            {data.info.displayName || "Your Business Name"}
          </p>
          <p className="truncate text-sm text-muted">
            {data.info.legalName}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
            {data.info.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {data.info.phone}
              </span>
            )}
            {data.info.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {data.info.email}
              </span>
            )}
          </div>
        </div>
      </div>

      <SummaryCard
        title="Business Information"
        icon={CreditCard}
        tint="blue"
        stepIndex={0}
        onEdit={onEdit}
      >
        <Row label="Legal Name" value={data.info.legalName} />
        <Row label="Display Name" value={data.info.displayName} />
        <Row
          label="Business Type"
          value={nameOf(businessTypes, data.info.businessType)}
        />
        <Row
          label="Category"
          value={nameOf(businessCategories, data.info.businessCategoryId)}
        />
        <Row label="Industry" value={nameOf(industries, data.info.industryId)} />
        <Row label="Email" value={data.info.email} />
        <Row label="Phone" value={data.info.phone} />
        <Row label="GSTIN" value={data.info.gstin} />
        <Row label="PAN" value={data.info.pan} />
        <Row
          label="Currency"
          value={nameOf(currencies, data.info.currencyId)}
        />
      </SummaryCard>

      <SummaryCard
        title="Business Address"
        icon={MapPin}
        tint="teal"
        stepIndex={1}
        onEdit={onEdit}
      >
        <Row
          label="Address"
          value={[data.address.addressLine1, data.address.addressLine2]
            .filter(Boolean)
            .join(", ")}
        />
        <Row label="Country" value={nameOf(countries, data.address.countryId)} />
        <Row label="Pincode" value={data.address.pincode} />
      </SummaryCard>

      <SummaryCard
        title="Branches"
        icon={Building2}
        tint="amber"
        stepIndex={2}
        onEdit={onEdit}
      >
        {data.branches.length === 0 ? (
          <p className="py-1.5 text-sm text-muted">No branches added</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.branches.map((b, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {b.branchName || `Branch ${i + 1}`}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {[b.phone, b.email].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Badge variant={b.status === "active" ? "success" : "warning"}>
                  {b.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </SummaryCard>

      <SummaryCard
        title="Bank Details"
        icon={Landmark}
        tint="rose"
        stepIndex={3}
        onEdit={onEdit}
      >
        <Row label="Account Holder" value={data.bank.accountHolderName} />
        <Row label="Bank" value={data.bank.bankName} />
        <Row
          label="Account Number"
          value={
            data.bank.accountNumber
              ? `•••• •••• ${data.bank.accountNumber.slice(-4)}`
              : undefined
          }
        />
        <Row label="IFSC" value={data.bank.ifscCode} />
      </SummaryCard>

      <SummaryCard
        title="Documents"
        icon={FileText}
        tint="violet"
        stepIndex={4}
        onEdit={onEdit}
      >
        {data.documents.length === 0 ? (
          <p className="py-1.5 text-sm text-muted">No documents added</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.documents.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-800">
                  {d.documentType || `Document ${i + 1}`}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                  {d.file?.name ? (
                    <>
                      <FileText className="h-3.5 w-3.5" />
                      {d.file.name}
                    </>
                  ) : (
                    <span className="text-muted">Attached</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </SummaryCard>
    </div>
  );
}
