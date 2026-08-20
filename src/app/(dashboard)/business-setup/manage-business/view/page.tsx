"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  FileText,
  Landmark,
  BadgeCheck,
  Pencil,
  ArrowLeft,
  Calendar,
  Clock,
  Wallet,
  ExternalLink,
  CheckCircle2,
  Clock3,
  Store,
  User,
} from "lucide-react";

import Container from "@/components/common/Container";
import { Badge, Button, Separator } from "@/components/ui";
import { cn } from "@/components/ui/utils";

import { businessApi } from "@/modules/business/api/business.api";
import SectionHeader, {
  SectionTint,
} from "@/modules/business/setup/components/SectionHeader";
import { useMasterData } from "@/modules/business/setup/hooks/useMasterData";
import {
  countries as masterCountries,
  states as masterStates,
  cities as masterCities,
  businessTypes as masterBusinessTypes,
} from "@/modules/business/setup/data/masterData";

// ------------------------------------------------------------------
// Types (loose — this mirrors the raw backend response, not the
// wizard's validated shape)
// ------------------------------------------------------------------
interface AddressRecord {
  id?: string;
  addressLine1?: string;
  addressLine2?: string;
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
  isPrimary?: boolean;
}

interface BranchRecord {
  id?: string;
  branchCode?: string;
  branchName?: string;
  phone?: string;
  email?: string;
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
  status?: string;
  user?: { name?: string } | null;
}

interface BankRecord {
  id?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
  upiId?: string;
}

interface DocumentRecord {
  id?: string;
  documentType?: string;
  fileName?: string;
  fileUrl?: string;
  verified?: boolean;
}

interface BusinessDetail {
  id: string;
  tenantId?: string;
  businessType?: string;
  gstin?: string;
  pan?: string;
  legalName?: string;
  tradeName?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  websiteLink?: string;
  businessCategoryId?: string;
  industryId?: string;
  registrationTypeId?: string;
  registrationNumber?: string;
  tan?: string;
  msme?: string;
  currencyId?: string;
  timezone?: string;
  financialYear?: string;
  description?: string | null;
  logo?: string | null;
  status?: string;
  addresses?: AddressRecord[];
  branches?: BranchRecord[];
  banks?: BankRecord[];
  documents?: DocumentRecord[];
}

// ------------------------------------------------------------------
// Static lookups (documentType -> label/tint match the normalizer in
// business.api.ts, so this always lines up with what's in the DB)
// ------------------------------------------------------------------
const DOCUMENT_META: Record<string, { label: string; tint: SectionTint }> = {
  GST: { label: "GST Certificate", tint: "blue" },
  PAN: { label: "PAN Card", tint: "violet" },
  MSME: { label: "MSME Certificate", tint: "teal" },
  TAN: { label: "TAN Certificate", tint: "amber" },
  LICENSE: { label: "Business License", tint: "rose" },
  CERTIFICATE: { label: "Certificate", tint: "blue" },
  OTHER: { label: "Other Document", tint: "violet" },
};

const nameOf = (list: { id: string; name: string }[], id?: string) =>
  (id && list.find((i) => i.id === id)?.name) || id || "—";

const maskAccount = (num?: string) => {
  if (!num) return "—";
  if (num.length <= 4) return num;
  return `•••• •••• ${num.slice(-4)}`;
};

// ------------------------------------------------------------------
// Small presentational helpers
// ------------------------------------------------------------------
function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  href?: string;
}) {
  if (!value) return null;
  const content = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-text">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="rounded-md transition hover:bg-slate-50"
      >
        {content}
      </a>
    );
  }

  return content;
}

function EmptyState({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50/50 py-10 text-center">
      <Icon className="mb-2 h-6 w-6 text-slate-300" />
      <p className="text-sm text-muted">{text}</p>
    </div>
  );
}

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 sm:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}

// ------------------------------------------------------------------
// Loading skeleton
// ------------------------------------------------------------------
function ViewSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-5">
      <div className="h-32 rounded-xl bg-slate-100" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-40 rounded-xl bg-slate-100" />
        <div className="h-40 rounded-xl bg-slate-100" />
      </div>
      <div className="h-48 rounded-xl bg-slate-100" />
      <div className="h-48 rounded-xl bg-slate-100" />
    </div>
  );
}

// ==================================================================
// Page
// ==================================================================
export default function ViewBusinessPage() {
  const search = useSearchParams();
  const router = useRouter();
  const id = search.get("id");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BusinessDetail | null>(null);
  const [logoFailed, setLogoFailed] = useState(false);

  const { businessCategories, industries, currencies, registrationTypes } =
    useMasterData();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    businessApi
      .getBusinessById(id)
      .then((res) => {
        const response = res.data as BusinessDetail | { data?: BusinessDetail };
        const payload = "data" in response ? response.data ?? null : response;
        if (mounted) setData(payload);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  const primaryAddress = useMemo(() => {
    if (!data?.addresses?.length) return undefined;
    return data.addresses.find((a) => a.isPrimary) ?? data.addresses[0];
  }, [data]);

  const otherAddresses = useMemo(() => {
    if (!data?.addresses?.length) return [];
    return data.addresses.filter((a) => a !== primaryAddress);
  }, [data, primaryAddress]);

  const locationLabel = (a?: AddressRecord) => {
    if (!a) return "—";
    const country = nameOf(masterCountries, a.country);
    const state = nameOf(masterStates, a.state);
    const city = nameOf(masterCities, a.city);
    return [city, state, country].filter((v) => v && v !== "—").join(", ") || "—";
  };

  if (!id) {
    return (
      <Container className="py-8">
        <EmptyState icon={Building2} text="Business id is missing in the URL." />
      </Container>
    );
  }

  return (
    <Container className="min-h-full bg-slate-50 py-7">
      {loading || !data ? (
        <ViewSkeleton />
      ) : (
        <div className="mx-auto max-w-6xl space-y-5">
          {/* Back / actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <Button
              size="sm"
              className="gap-2"
              onClick={() => router.push(`/manage-business/edit?id=${data.id}`)}
            >
              <Pencil className="h-4 w-4" />
              Edit Business
            </Button>
          </div>

          {/* Hero header */}
          <div className="border border-slate-200 bg-white">
            <div className="h-1 bg-primary" />

            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:h-20 sm:w-20">
                {data.logo && !logoFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.logo}
                    alt={`${data.displayName ?? data.legalName} logo`}
                    className="h-full w-full object-cover"
                    onError={() => setLogoFailed(true)}
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    {data.displayName ?? data.legalName}
                  </h1>
                  <Badge variant={data.status === "ACTIVE" ? "success" : "secondary"}>
                    {data.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted">
                  {data.legalName}
                  {data.tradeName ? ` · ${data.tradeName}` : ""}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Store className="h-3 w-3" />
                    {nameOf(masterBusinessTypes, data.businessType)}
                  </Badge>
                  {data.tenantId && (
                    <Badge variant="secondary">{data.tenantId}</Badge>
                  )}
                </div>

                {data.description && (
                  <p className="mt-3 max-w-2xl text-sm text-gray-600">
                    {data.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact + Tax */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SectionCard>
              <SectionHeader icon={Phone} title="Contact" tint="blue" />
              <div className="space-y-4">
                <InfoRow icon={Phone} label="Phone" value={data.phone} />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={data.email}
                  href={data.email ? `mailto:${data.email}` : undefined}
                />
                <InfoRow
                  icon={Globe}
                  label="Website"
                  value={data.websiteLink}
                  href={data.websiteLink || undefined}
                />
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader icon={CreditCard} title="Tax & Registration" tint="violet" />
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={BadgeCheck} label="GSTIN" value={data.gstin} />
                <InfoRow icon={BadgeCheck} label="PAN" value={data.pan} />
                <InfoRow icon={BadgeCheck} label="TAN" value={data.tan} />
                <InfoRow icon={BadgeCheck} label="MSME" value={data.msme} />
                <InfoRow
                  icon={FileText}
                  label="Registration No."
                  value={data.registrationNumber}
                />
                <InfoRow
                  icon={FileText}
                  label="Registration Type"
                  value={nameOf(registrationTypes, data.registrationTypeId)}
                />
                <InfoRow
                  icon={Wallet}
                  label="Currency"
                  value={nameOf(currencies, data.currencyId)}
                />
                <InfoRow icon={Clock} label="Timezone" value={data.timezone} />
                <InfoRow
                  icon={Calendar}
                  label="Financial Year"
                  value={data.financialYear}
                />
                <InfoRow
                  icon={Building2}
                  label="Category"
                  value={nameOf(businessCategories, data.businessCategoryId)}
                />
                <InfoRow
                  icon={Building2}
                  label="Industry"
                  value={nameOf(industries, data.industryId)}
                />
              </div>
            </SectionCard>
          </div>

          {/* Addresses */}
          <SectionCard>
            <SectionHeader icon={MapPin} title="Addresses" tint="teal" />

            {!data.addresses || data.addresses.length === 0 ? (
              <EmptyState icon={MapPin} text="No address on record." />
            ) : (
              <div className="space-y-3">
                {[primaryAddress, ...otherAddresses]
                  .filter(Boolean)
                  .map((a, idx) => (
                    <div
                      key={a?.id ?? idx}
                      className={cn(
                        "flex items-start gap-3 border p-4",
                        a?.isPrimary
                          ? "border-primary/30 bg-primary/5"
                          : "border-slate-200 bg-slate-50/50"
                      )}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-primary">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-text">
                            {a?.addressLine1}
                            {a?.addressLine2 ? `, ${a.addressLine2}` : ""}
                          </p>
                          {a?.isPrimary && (
                            <Badge variant="success" className="text-[10px]">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-muted">
                          {locationLabel(a)}
                          {a?.pincode ? ` – ${a.pincode}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </SectionCard>

          {/* Branches */}
          <SectionCard>
            <SectionHeader icon={Building2} title="Branches" tint="amber" />

            {!data.branches || data.branches.length === 0 ? (
              <EmptyState icon={Building2} text="No branches added yet." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.branches.map((b, i) => (
                  <div
                    key={b.id ?? i}
                    className="border border-slate-200 bg-slate-50/50 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {b.branchName || `Branch ${i + 1}`}
                        </p>
                        {b.branchCode && (
                          <p className="text-xs text-muted">{b.branchCode}</p>
                        )}
                      </div>
                      <Badge
                        variant={b.status === "ACTIVE" ? "success" : "secondary"}
                      >
                        {b.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="truncate">
                          {locationLabel(b)}
                          {b.pincode ? ` – ${b.pincode}` : ""}
                        </span>
                      </div>
                      {b.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{b.phone}</span>
                        </div>
                      )}
                      {b.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="truncate">{b.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{b.user?.name || "No manager assigned"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Bank */}
          <SectionCard>
            <SectionHeader icon={Landmark} title="Bank Details" tint="rose" />

            {!data.banks || data.banks.length === 0 ? (
              <EmptyState icon={Landmark} text="No bank details on record." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.banks.map((bnk, i) => (
                  <div
                    key={bnk.id ?? i}
                    className="border border-slate-200 bg-slate-50/50 p-4"
                  >
                    <p className="text-sm font-semibold text-text">
                      {bnk.bankName}
                    </p>
                    <p className="text-xs text-muted">{bnk.branch}</p>

                    <Separator className="my-3" />

                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted">Account Holder</span>
                        <span className="font-medium text-text">
                          {bnk.accountHolderName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-muted">Account No.</span>
                        <span className="font-mono font-medium text-text">
                          {maskAccount(bnk.accountNumber)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-muted">IFSC</span>
                        <span className="font-mono font-medium text-text">
                          {bnk.ifscCode}
                        </span>
                      </div>
                      {bnk.upiId && (
                        <div className="flex justify-between gap-3">
                          <span className="text-muted">UPI</span>
                          <span className="font-medium text-text">
                            {bnk.upiId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Documents */}
          <SectionCard>
            <SectionHeader icon={FileText} title="Documents" tint="blue" />

            {!data.documents || data.documents.length === 0 ? (
              <EmptyState icon={FileText} text="No documents uploaded." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.documents.map((d, i) => {
                  const meta =
                    DOCUMENT_META[d.documentType ?? ""] ?? {
                      label: d.documentType ?? "Document",
                      tint: "blue" as SectionTint,
                    };

                  return (
                    <div
                      key={d.id ?? i}
                      className="flex items-center justify-between gap-3 border border-slate-200 bg-slate-50/50 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <FileText className="h-4.5 w-4.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-text">
                            {meta.label}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {d.fileName ?? "No file name"}
                          </p>
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium">
                            {d.verified ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                <span className="text-green-600">Verified</span>
                              </>
                            ) : (
                              <>
                                <Clock3 className="h-3 w-3 text-amber-500" />
                                <span className="text-amber-600">
                                  Pending review
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {d.fileUrl && (
                        <a
                          href={d.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0"
                        >
                          <Button size="sm" variant="outline" className="gap-1.5">
                            View
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      )}
    </Container>
  );
}
