"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Download,
  Copy,
  Check,
  File,
  Eye,
  Hash,
  Phone,
  Mail,
  Globe,
  Calendar,
  BadgeCheck,
  User,
  Building2,
  CreditCard,
  MapPin,
  ReceiptText,
  Landmark,
  WalletCards,
  CircleDollarSign,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { vendorApi } from "@/modules/vendor/api/vendor.api";
import { notify } from "@/lib/toast";
import { Button } from "@/components/ui";

export default function VendorDetails() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params?.vendorId as string | undefined;

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);

  const loadVendor = async () => {
    if (!vendorId) return;

    try {
      setLoading(true);

      const response = await vendorApi.getById(vendorId);

      setVendor(response?.data?.data ?? null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Failed to load vendor details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendor();
  }, [vendorId]);

  const handleDeleteDocument = async (documentId: string) => {
    if (!documentId) return;

    try {
      setDeletingDocumentId(documentId);
      await vendorApi.deleteDocument(documentId);
      notify.success("Document deleted successfully.");
      await loadVendor();
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message ||
        "Failed to delete document"
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  const handleCopy = async (value: string, field: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopiedField(field);
      notify.success("Copied");

      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      notify.error("Failed to copy");
    }
  };

  const maskAccount = (num?: string) => {
    if (!num) return "—";
    if (num.length <= 4) return num;

    return `•••• ${num.slice(-4)}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const resolveWebsite = (value?: string) => {
    if (!value) return "—";

    try {
      const normalized = value.trim();
      const url = new URL(normalized);

      return url.href;
    } catch {
      return "—";
    }
  };

  const formatYesNo = (value?: boolean) =>
    value === true ? "Yes" : value === false ? "No" : "—";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
          <p className="text-sm text-slate-500">
            Loading vendor details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Building2 size={25} />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Vendor not found
          </h2>

          <p className="mt-1 text-sm text-red-500">
            {error || "Unable to load vendor details"}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push("/vendors")}
        >
          <ArrowLeft size={16} />
          Back to Vendors
        </Button>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // NORMALIZED FIELDS
  // --------------------------------------------------------------------------

  const logoUrl =
    vendor.logoUrl?.view ||
    vendor.logoUrl?.download ||
    (typeof vendor.logo === "string"
      ? vendor.logo
      : vendor.logo?.fileUrl?.view ||
      vendor.logo?.fileUrl ||
      vendor.logo?.url ||
      "");

  const contactName =
    vendor.contact?.contactPerson ||
    vendor.contacts?.[0]?.name ||
    "—";

  const contactMobile =
    vendor.contact?.mobile ||
    vendor.contacts?.[0]?.mobile ||
    vendor.phone ||
    "—";

  const contactEmail =
    vendor.contact?.contactemail ||
    vendor.contact?.email ||
    vendor.contacts?.[0]?.contactemail ||
    vendor.contacts?.[0]?.email ||
    vendor.email ||
    "—";

  const contactDesignation =
    vendor.contact?.designation ||
    vendor.contacts?.[0]?.designation ||
    "—";

  const website = resolveWebsite(
    vendor.contact?.website || vendor.websiteLink
  );

  const alternatePhone =
    vendor.alternatevendorPhone ||
    vendor.contact?.alternatevendorPhone ||
    vendor.contact?.alternateMobile ||
    vendor.contacts?.[0]?.alternateMobile ||
    "";

  const gstin = vendor.tax?.gstin || vendor.gstin || "—";
  const pan = vendor.tax?.pan || vendor.pan || "—";
  const tan = vendor.tax?.tan || vendor.tan || "—";
  const msme = vendor.tax?.msme || vendor.msme || "—";
  const cin = vendor.tax?.cin || vendor.cin || "—";
  const aadhaar = vendor.tax?.aadhaar || vendor.aadhaar || "—";
  const gstType = vendor.tax?.gstType || vendor.gstType || "—";

  const tdsApplicable =
    vendor.tax?.tdsApplicable ?? vendor.tdsApplicable;

  const tcsApplicable =
    vendor.tax?.tcsApplicable ?? vendor.tcsApplicable;

  const tdsSection =
    vendor.tax?.tdsSection || vendor.tdsSection || "—";

  const creditLimit =
    vendor.purchase?.creditLimit ??
    vendor.creditLimit ??
    "-";

  const openingBalance =
    vendor.purchase?.openingBalance ??
    vendor.openingBalance ??
    "-";

  const paymentTerms =
    vendor.purchase?.paymentTerms ||
    vendor.paymentTerm ||
    "-";

  const paymentMode =
    vendor.purchase?.paymentMode ||
    vendor.paymentMode ||
    "-";

  const currency =
    vendor.purchase?.currency ||
    vendor.currencyId ||
    vendor.currency ||
    "-";

  const creditDays =
    vendor.purchase?.creditDays ??
    vendor.creditDays ??
    "-";

  const balanceType =
    vendor.purchase?.balanceType ||
    vendor.balanceType ||
    "-";

  const bankHolder =
    vendor.bank?.accountHolder ||
    vendor.banks?.[0]?.accountHolder ||
    "-";

  const bankName =
    vendor.bank?.bankName ||
    vendor.banks?.[0]?.bankName ||
    "-";

  const accountNumber =
    vendor.bank?.accountNumber ||
    vendor.banks?.[0]?.accountNumber ||
    "";

  const ifsc =
    vendor.bank?.ifsc ||
    vendor.bank?.ifscCode ||
    vendor.banks?.[0]?.ifscCode ||
    "-";

  const branch =
    vendor.bank?.branch ||
    vendor.banks?.[0]?.branch ||
    "-";

  const upiId =
    vendor.bank?.upiId ||
    vendor.banks?.[0]?.upiId ||
    "-";

  const accountType =
    vendor.bank?.accountType || "-";

  const billingLine1 =
    vendor.address?.billingAddressLine1 ||
    vendor.addresses?.[0]?.addressLine1 ||
    "-";

  const billingLine2 =
    vendor.address?.billingAddressLine2 ||
    vendor.addresses?.[0]?.addressLine2 ||
    "";

  const billingCity =
    vendor.address?.billingCity ||
    vendor.addresses?.[0]?.cityId ||
    "";

  const billingState =
    vendor.address?.billingState ||
    vendor.addresses?.[0]?.stateId ||
    "";

  const billingCountry =
    vendor.address?.billingCountry ||
    vendor.addresses?.[0]?.countryId ||
    "";

  const billingPincode =
    vendor.address?.billingPincode ||
    vendor.addresses?.[0]?.pincode ||
    "";

  const billingLandmark =
    vendor.address?.billingLandmark || "";

  const billingDistrict =
    vendor.address?.billingDistrict || "";

  const shippingLine1 =
    vendor.address?.shippingAddressLine1 ||
    vendor.shippingAddress?.addressLine1 ||
    "-";

  const shippingLine2 =
    vendor.address?.shippingAddressLine2 ||
    vendor.shippingAddress?.addressLine2 ||
    "";

  const shippingCity =
    vendor.address?.shippingCity ||
    vendor.shippingAddress?.cityId ||
    "";

  const shippingState =
    vendor.address?.shippingState ||
    vendor.shippingAddress?.stateId ||
    "";

  const shippingCountry =
    vendor.address?.shippingCountry ||
    vendor.shippingAddress?.countryId ||
    "";

  const shippingPincode =
    vendor.address?.shippingPincode ||
    vendor.shippingAddress?.pincode ||
    "";

  const shippingLandmark =
    vendor.address?.shippingLandmark || "";

  const shippingDistrict =
    vendor.address?.shippingDistrict || "";

  const sameAsBilling =
    vendor.address?.isShippingSameAsBilling ??
    vendor.sameAsBilling ??
    vendor.addresses?.[0]?.isShipping ??
    true;

  const isActive =
    vendor.status === "Active" ||
    vendor.status === "ACTIVE";

  // --------------------------------------------------------------------------
  // COMPONENTS
  // --------------------------------------------------------------------------

  const Section = ({
    title,
    icon: Icon,
    description,
    children,
  }: {
    title: string;
    icon: any;
    description?: string;
    children: React.ReactNode;
  }) => (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary">
          <Icon size={17} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );

  const Field = ({
    label,
    value,
    mono,
    copyValue,
    copyKey,
  }: {
    label: string;
    value?: any;
    mono?: boolean;
    copyValue?: string;
    copyKey?: string;
  }) => (
    <div className="group rounded-xl border border-transparent px-3 py-2.5 transition hover:border-slate-100 hover:bg-slate-50">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <div className="mt-1 flex min-w-0 items-center gap-2">
        <p
          className={`min-w-0 flex-1 break-all text-sm font-medium text-slate-800 ${mono ? "font-mono tracking-tight" : ""
            }`}
        >
          {value || "—"}
        </p>

        {copyValue && copyKey && (
          <button
            type="button"
            onClick={() =>
              handleCopy(copyValue, copyKey)
            }
            className="shrink-0 rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-white hover:text-slate-600 group-hover:opacity-100"
          >
            {copiedField === copyKey ? (
              <Check
                size={14}
                className="text-emerald-500"
              />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}
      </div>
    </div>
  );

  const FieldGrid = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      {children}
    </div>
  );

  const InfoStat = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: any;
  }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-primary">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-bold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full py-4">

        {/* TOP BAR */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/vendors")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Vendors
          </button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 rounded-xl bg-white"
            onClick={() =>
              router.push(`/vendors/${vendorId}/edit`)
            }
          >
            <Pencil size={14} />
            Edit Vendor
          </Button>
        </div>

        {/* PROFILE HEADER */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Accent banner */}
          <div className="relative h-24 overflow-hidden">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />
            <div className="absolute right-32 -bottom-24 h-48 w-48 rounded-full bg-white/5" />
          </div>

          <div className="relative px-5 pb-6 sm:px-7">

            {/* Profile */}
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-bold text-primary shadow-lg">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${vendor.vendorName || "Vendor"} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    vendor.vendorName?.[0]?.toUpperCase() ?? "V"
                  )}
                </div>

                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      {vendor.vendorName || "—"}
                    </h1>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                        }`}
                    >
                      {isActive && (
                        <BadgeCheck size={12} />
                      )}
                      {vendor.status || "—"}
                    </span>

                    <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 bg-primary/20">
                      {vendor.vendorType || "—"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {vendor.legalName ||
                      vendor.displayName ||
                      "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact row */}
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Hash
                  size={14}
                  className="text-primary"
                />
                {vendor.vendorCode || "—"}
              </span>

              {(vendor.email || contactEmail) !==
                "—" && (
                  <span className="inline-flex items-center gap-2">
                    <Mail
                      size={14}
                      className="text-primary"
                    />
                    {vendor.email || contactEmail}
                  </span>
                )}

              {(vendor.phone || contactMobile) !==
                "—" && (
                  <span className="inline-flex items-center gap-2">
                    <Phone
                      size={14}
                      className="text-primary"
                    />
                    {vendor.phone || contactMobile}
                  </span>
                )}

              {website !== "—" && (
                <span className="inline-flex items-center gap-2 break-all">
                  <Globe
                    size={14}
                    className="text-primary"
                  />
                  {website}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoStat
            icon={CircleDollarSign}
            label="Credit Limit"
            value={creditLimit}
          />

          <InfoStat
            icon={WalletCards}
            label="Opening Balance"
            value={openingBalance}
          />

          <InfoStat
            icon={ReceiptText}
            label="Payment Terms"
            value={paymentTerms}
          />

          <InfoStat
            icon={CreditCard}
            label="Currency"
            value={currency}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">

          {/* LEFT */}
          <main className="space-y-5">

            {/* OVERVIEW */}
            <Section
              title="Overview"
              icon={Building2}
              description="Basic vendor and business information"
            >
              <FieldGrid>
                {/* <Field
                  label="Vendor ID"
                  value={vendor.id}
                  mono
                /> */}

                <Field
                  label="Vendor Code"
                  value={vendor.vendorCode}
                />

                <Field
                  label="Vendor Type"
                  value={vendor.vendorType}
                />

                <Field
                  label="Status"
                  value={vendor.status}
                />

                <Field
                  label="Vendor Name"
                  value={vendor.vendorName}
                />

                <Field
                  label="Legal Name"
                  value={vendor.legalName}
                />

                <Field
                  label="Display Name"
                  value={vendor.displayName}
                />

                <Field
                  label="Business Category"
                  value={vendor.businessCategory}
                />

                <Field
                  label="Created By"
                  value={vendor.createdBy}
                />

                <Field
                  label="Created At"
                  value={formatDate(vendor.createdAt)}
                />

                <Field
                  label="Updated At"
                  value={formatDate(vendor.updatedAt)}
                />

                <Field
                  label="Tenant"
                  value={vendor.tenantId}
                />

                <Field
                  label="Branch"
                  value={vendor.branchId}
                />
              </FieldGrid>

              {vendor.remarks && (
                <div className="mt-4 rounded-xl border p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Remarks
                  </p>

                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                    {vendor.remarks}
                  </p>
                </div>
              )}
            </Section>

            {/* CONTACT */}
            <Section
              title="Contact Information"
              icon={User}
              description="Primary vendor contact details"
            >
              <FieldGrid>
                <Field
                  label="Contact Person Name"
                  value={contactName}
                />

                <Field
                  label="Designation"
                  value={contactDesignation}
                />

                <Field
                  label="Person Mobile"
                  value={contactMobile}
                />

                <Field
                  label="Contact Person Email"
                  value={contactEmail}
                />

                {alternatePhone && (
                  <Field
                    label="Person Alternate Mobile"
                    value={alternatePhone}
                  />
                )}

                <Field
                  label="Website"
                  value={website}
                />

                <Field
                  label="Primary Contact"
                  value={formatYesNo(
                    vendor.contacts?.[0]
                      ?.isPrimary ?? true
                  )}
                />
              </FieldGrid>
            </Section>

            {/* PAYMENT */}
            <Section
              title="Payment Information"
              icon={WalletCards}
              description="Credit and payment configuration"
            >
              <FieldGrid>
                <Field
                  label="Currency"
                  value={currency}
                />

                <Field
                  label="Payment Terms"
                  value={paymentTerms}
                />

                <Field
                  label="Payment Mode"
                  value={paymentMode}
                />

                <Field
                  label="Credit Limit"
                  value={creditLimit}
                />

                <Field
                  label="Opening Balance"
                  value={openingBalance}
                />

                <Field
                  label="Credit Days"
                  value={creditDays}
                />

                <Field
                  label="Balance Type"
                  value={balanceType}
                />
              </FieldGrid>
            </Section>

            {/* TAX */}
            <Section
              title="Tax & Compliance"
              icon={ShieldCheck}
              description="GST, PAN and statutory information"
            >
              <FieldGrid>
                <Field
                  label="GST Type"
                  value={gstType}
                />

                <Field
                  label="GSTIN"
                  value={gstin}
                  mono
                  copyValue={
                    gstin !== "—"
                      ? gstin
                      : undefined
                  }
                  copyKey="gstin"
                />

                <Field
                  label="PAN"
                  value={pan}
                  mono
                  copyValue={
                    pan !== "—" ? pan : undefined
                  }
                  copyKey="pan"
                />

                <Field
                  label="TAN"
                  value={tan}
                  mono
                />

                <Field
                  label="MSME"
                  value={msme}
                />

                <Field
                  label="CIN"
                  value={cin}
                  mono
                />

                <Field
                  label="Aadhaar"
                  value={aadhaar}
                />

                <Field
                  label="TDS Applicable"
                  value={formatYesNo(
                    tdsApplicable
                  )}
                />

                <Field
                  label="TCS Applicable"
                  value={formatYesNo(
                    tcsApplicable
                  )}
                />

                <Field
                  label="TDS Section"
                  value={tdsSection}
                />
              </FieldGrid>
            </Section>

            {/* BANK */}
            <Section
              title="Bank Information"
              icon={Landmark}
              description="Vendor banking and settlement details"
            >
              <FieldGrid>
                <Field
                  label="Account Holder"
                  value={bankHolder}
                />

                <Field
                  label="Bank Name"
                  value={bankName}
                />

                <Field
                  label="Account Number"
                  value={maskAccount(
                    accountNumber
                  )}
                  mono
                  copyValue={accountNumber}
                  copyKey="account"
                />

                <Field
                  label="IFSC"
                  value={ifsc}
                  mono
                  copyValue={
                    ifsc !== "—"
                      ? ifsc
                      : undefined
                  }
                  copyKey="ifsc"
                />

                <Field
                  label="Branch"
                  value={branch}
                />

                <Field
                  label="UPI ID"
                  value={upiId}
                />

                <Field
                  label="Account Type"
                  value={accountType}
                />

                <Field
                  label="Primary Account"
                  value={formatYesNo(
                    vendor.banks?.[0]
                      ?.isPrimary ?? true
                  )}
                />
              </FieldGrid>
            </Section>

            {/* ADDRESS */}
            <Section
              title="Address"
              icon={MapPin}
              description="Billing and shipping addresses"
            >
              <div className="grid gap-6 md:grid-cols-2">

                {/* Billing */}
                <div className="rounded-2xl border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                      <MapPin size={15} />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Billing Address
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Registered billing location
                      </p>
                    </div>
                  </div>

                  <FieldGrid>
                    <Field
                      label="Line 1"
                      value={billingLine1}
                    />

                    <Field
                      label="Line 2"
                      value={
                        billingLine2 || "—"
                      }
                    />

                    <Field
                      label="Landmark"
                      value={
                        billingLandmark || "—"
                      }
                    />

                    <Field
                      label="City"
                      value={
                        billingCity || "—"
                      }
                    />

                    <Field
                      label="District"
                      value={
                        billingDistrict || "—"
                      }
                    />

                    <Field
                      label="State"
                      value={
                        billingState || "—"
                      }
                    />

                    <Field
                      label="Country"
                      value={
                        billingCountry || "—"
                      }
                    />

                    <Field
                      label="Pincode"
                      value={
                        billingPincode || "—"
                      }
                    />
                  </FieldGrid>
                </div>

                {/* Shipping */}
                <div className="rounded-2xl border p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <MapPin size={15} />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Shipping Address
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Delivery location
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                      {sameAsBilling
                        ? "Same as billing"
                        : "Different"}
                    </span>
                  </div>

                  {!sameAsBilling ? (
                    <FieldGrid>
                      <Field
                        label="Line 1"
                        value={shippingLine1}
                      />

                      <Field
                        label="Line 2"
                        value={
                          shippingLine2 || "—"
                        }
                      />

                      <Field
                        label="Landmark"
                        value={
                          shippingLandmark || "—"
                        }
                      />

                      <Field
                        label="City"
                        value={
                          shippingCity || "—"
                        }
                      />

                      <Field
                        label="District"
                        value={
                          shippingDistrict || "—"
                        }
                      />

                      <Field
                        label="State"
                        value={
                          shippingState || "—"
                        }
                      />

                      <Field
                        label="Country"
                        value={
                          shippingCountry || "—"
                        }
                      />

                      <Field
                        label="Pincode"
                        value={
                          shippingPincode || "—"
                        }
                      />
                    </FieldGrid>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-5 text-center">
                      <p className="text-sm font-medium text-slate-600">
                        Shipping address is the same as billing.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* DOCUMENTS */}
            <Section
              title="Documents"
              icon={File}
              description="Uploaded vendor documents"
            >
              {vendor.documents?.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {vendor.documents.map(
                    (doc: any) => (
                      <div
                        key={
                          doc.id ||
                          doc.fileName ||
                          doc.originalName
                        }
                        className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-indigo-200 hover:shadow-sm"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                          <File size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {doc.originalName ||
                              doc.documentType?.replace(
                                /_/g,
                                " "
                              ) ||
                              "Document"}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {doc.documentType?.replace(
                              /_/g,
                              " "
                            ) || "Document"}

                            {doc.mimeType
                              ? ` · ${doc.mimeType}`
                              : ""}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-1">
                          {doc.fileUrl?.view && (
                            <a
                              href={doc.fileUrl.view}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg p-2 text-sky-600 transition hover:bg-sky-50"
                              title="View"
                            >
                              <Eye size={15} />
                            </a>
                          )}

                          {doc.fileUrl?.download && (
                            <a
                              href={
                                doc.fileUrl.download
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                              title="Download"
                            >
                              <Download size={15} />
                            </a>
                          )}

                          <button
                            type="button"
                            disabled={deletingDocumentId === doc.id}
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                    <File size={18} />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No documents uploaded
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Vendor documents will appear here.
                  </p>
                </div>
              )}
            </Section>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5">

            {/* QUICK INFO */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                  <Building2 size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Quick Info
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Vendor overview
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {vendor.status || "—"}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {vendor.vendorType || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Code
                  </p>

                  <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
                    {vendor.vendorCode || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {vendor.businessCategory || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTACT */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <User size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Contact
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Primary contact
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <User
                    size={14}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <span className="text-sm text-slate-700">
                    {contactName}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone
                    size={14}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <span className="text-sm text-slate-700">
                    {contactMobile}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail
                    size={14}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <span className="break-all text-sm text-slate-700">
                    {contactEmail}
                  </span>
                </div>

                {website !== "—" && (
                  <div className="flex items-start gap-2.5">
                    <Globe
                      size={14}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <span className="break-all text-sm text-slate-700">
                      {website}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* TAX SNAPSHOT */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ReceiptText size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Tax Snapshot
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Compliance details
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    GSTIN
                  </p>

                  <p className="mt-1 break-all font-mono text-sm font-medium text-slate-800">
                    {gstin}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    PAN
                  </p>

                  <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                    {pan}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    GST Type
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {gstType}
                  </p>
                </div>
              </div>
            </div>

            {/* BANK SNAPSHOT */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Landmark size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Bank Snapshot
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Settlement account
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Bank
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {bankName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Account
                  </p>

                  <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                    {maskAccount(accountNumber)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    IFSC
                  </p>

                  <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                    {ifsc}
                  </p>
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Calendar size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Timeline
                  </h3>

                  <p className="text-[10px] text-slate-400">
                    Vendor activity
                  </p>
                </div>
              </div>

              <div className="relative space-y-5 pl-5">

                <div className="absolute bottom-2 left-[5px] top-2 w-px bg-slate-200" />

                <div className="relative">
                  <div className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />

                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(vendor.createdAt)}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full bg-slate-400 ring-4 ring-slate-100" />

                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Updated
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(vendor.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
