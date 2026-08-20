"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Download,
  Plus,
  Upload,
} from "lucide-react";

import VendorCard from "./VendorCard";
import VendorStats from "./VendorStats";
import VendorFilters from "./VendorFilters";

import Container from "@/components/common/Container";
import Pagination from "@/components/data-table/Pagination";

import {
  Button,
} from "@/components/ui";

import { vendorApi } from "@/modules/vendor/api/vendor.api";
import { useVendorImportExport } from "@/modules/vendor/hooks/usevendor";
import { notify } from "@/lib/toast";
import { Vendor } from "../types";

interface VendorListProps {
  vendors?: Vendor[];
}

const normalizeVendorStatus = (value?: string) => {
  const normalized = String(value ?? "").trim().toUpperCase();

  if (normalized === "ACTIVE") return "Active";
  if (normalized === "INACTIVE") return "Inactive";
  if (normalized === "BLOCKED") return "Blocked";

  return value ?? "Active";
};

const normalizeVendorType = (value?: string) => {
  const normalized = String(value ?? "").trim().toUpperCase();

  if (normalized === "SUPPLIER") return "Supplier";
  if (normalized === "MANUFACTURER") return "Manufacturer";
  if (normalized === "WHOLESALER") return "Wholesaler";
  if (normalized === "SERVICE_PROVIDER") return "Service Provider";
  if (normalized === "CONTRACTOR") return "Contractor";

  return value ?? "Supplier";
};

const normalizeVendorData = (vendor: any): Vendor => ({
  ...vendor,
  status: normalizeVendorStatus(vendor?.status),
  vendorType: normalizeVendorType(vendor?.vendorType),
  contacts: vendor?.contact
    ? [
      {
        id: vendor.contact.id ?? "",
        vendorId: vendor.contact.vendorId ?? vendor.id ?? "",
        name: vendor.contact.contactPerson ?? "",
        designation: vendor.contact.designation ?? "",
        mobile: vendor.contact.mobile ?? "",
        email: vendor.contact.email ?? "",
        isPrimary: true,
      },
    ]
    : vendor?.contacts ?? [],
  addresses: vendor?.address
    ? [
      {
        id: vendor.address.id ?? "",
        vendorId: vendor.address.vendorId ?? vendor.id ?? "",
        addressLine1: vendor.address.billingAddressLine1 ?? "",
        addressLine2: vendor.address.billingAddressLine2 ?? "",
        countryId: vendor.address.billingCountry ?? "",
        stateId: vendor.address.billingState ?? "",
        cityId: vendor.address.billingCity ?? "",
        pincode: vendor.address.billingPincode ?? "",
        isBilling: true,
        isShipping: vendor.address.isShippingSameAsBilling ?? true,
        status: "Active",
      },
    ]
    : vendor?.addresses ?? [],
  email: vendor?.contact?.email ?? vendor?.vendorEmail ?? vendor?.email ?? "",
  phone: vendor?.contact?.mobile ?? vendor?.vendorPhone ?? vendor?.phone ?? "",
  websiteLink: vendor?.contact?.website ?? vendor?.websiteLink ?? "",
  gstin: vendor?.tax?.gstin ?? vendor?.gstin ?? "",
  pan: vendor?.tax?.pan ?? vendor?.pan ?? "",
  paymentTerm: vendor?.purchase?.paymentTerms ?? vendor?.paymentTerm ?? "",
  paymentMode: vendor?.purchase?.paymentMode ?? vendor?.paymentMode ?? "",
  currency: vendor?.purchase?.currency ?? vendor?.currency ?? "",
  creditLimit: Number(
    vendor?.purchase?.creditLimit ?? vendor?.creditLimit ?? 0
  ),
  openingBalance: Number(
    vendor?.purchase?.openingBalance ?? vendor?.openingBalance ?? 0
  ),
  totalPurchase: Number(vendor?.totalPurchase ?? 0),
  outstanding: Number(vendor?.outstanding ?? 0),
  lastPurchaseDate:
    vendor?.purchase?.lastPurchaseDate ?? vendor?.lastPurchaseDate ?? "",
  banks: vendor?.bank
    ? [
      {
        id: vendor.bank.id ?? "",
        vendorId: vendor.bank.vendorId ?? vendor.id ?? "",
        accountHolder: vendor.bank.accountHolder ?? "",
        bankName: vendor.bank.bankName ?? "",
        accountNumber: vendor.bank.accountNumber ?? "",
        ifscCode: vendor.bank.ifsc ?? vendor.bank.ifscCode ?? "",
        branch: vendor.bank.branch ?? "",
        upiId: vendor.bank.upiId ?? "",
        isPrimary: true,
      },
    ]
    : vendor?.banks ?? [],
  documents: vendor?.documents ?? [],
});

export default function VendorList({
  vendors: initialVendors,
}: VendorListProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [state, setState] = useState("all");

  const [serverVendors, setServerVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 6;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { exportVendors, downloadVendorTemplate, importVendors } = useVendorImportExport();

  const loadVendors = async (keyword = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = keyword
        ? await vendorApi.search(keyword)
        : await vendorApi.getAll({ page: 1, limit: 50 });

      const items = response?.data?.data ?? [];
      const normalized = Array.isArray(items)
        ? items.map((item: any) => normalizeVendorData(item))
        : [];

      setServerVendors(normalized);
    } catch (err: any) {
      console.error("Failed to fetch vendors", err);
      setError(err?.response?.data?.message || "Failed to load vendors");
      setServerVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      setLoading(true);
      await vendorApi.delete(vendorId);
      notify.success("Vendor deleted successfully");
      await loadVendors(search.trim());
    } catch (err: any) {
      console.error("Vendor delete failed", err);
      notify.error(err?.response?.data?.message || "Failed to delete vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVendorStatus = async (vendor: Vendor) => {
    const currentStatus = String(vendor.status ?? "").trim().toUpperCase();
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const prevVendors = serverVendors;

    setServerVendors((prev) =>
      prev.map((item) =>
        item.id === vendor.id
          ? { ...item, status: normalizeVendorStatus(nextStatus) }
          : item
      )
    );

    try {
      setLoading(true);
      await vendorApi.changeStatus(vendor.id, nextStatus);
      notify.success(
        `Vendor status updated to ${nextStatus === "ACTIVE" ? "Active" : "Inactive"}`
      );
    } catch (err: any) {
      console.error("Vendor status update failed", err);
      setServerVendors(prevVendors);
      notify.error(
        err?.response?.data?.message || "Failed to update vendor status"
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob: Blob, fallbackName: string) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fallbackName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  };

  const handleExportVendors = async () => {
    try {
      const response = await exportVendors({ page: 1, limit: 1000, tenantId: "tenant001" });
      const contentType = response?.headers?.["content-type"];
      const resolvedContentType = Array.isArray(contentType)
        ? contentType[0]
        : typeof contentType === "string"
          ? contentType
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const blob = response?.data instanceof Blob
        ? response.data
        : new Blob([response?.data ?? ""], {
          type: resolvedContentType,
        });
      downloadBlob(blob, "vendors-export.xlsx");
      notify.success("Vendor export downloaded");
    } catch {
      notify.error("Failed to export vendors");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await downloadVendorTemplate();
      const contentType = response?.headers?.["content-type"];
      const resolvedContentType = Array.isArray(contentType)
        ? contentType[0]
        : typeof contentType === "string"
          ? contentType
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const blob = response?.data instanceof Blob
        ? response.data
        : new Blob([response?.data ?? ""], {
          type: resolvedContentType,
        });
      downloadBlob(blob, "vendors-template.xlsx");
      notify.success("Vendor import template downloaded");
    } catch {
      notify.error("Failed to download vendor template");
    }
  };

  const handleImportSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      await importVendors(file, { tenantId: "tenant002" });
      notify.success("Vendor import completed");
      await loadVendors(search.trim());
    } catch {
      notify.error("Failed to import vendors");
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    const keyword = search.trim();
    if (keyword) {
      loadVendors(keyword);
    } else {
      loadVendors();
    }
  }, [search]);

  /* -------------------------------- */
  /* Filtering                        */
  /* -------------------------------- */

  const vendorSource =
    Array.isArray(initialVendors) && initialVendors.length > 0
      ? initialVendors
      : serverVendors;

  const filteredVendors = useMemo(() => {
    return vendorSource.filter((vendor) => {
      const matchesSearch =
        search === "" ||
        [
          vendor.vendorName,
          vendor.vendorCode,
          vendor.contacts?.[0]?.name,
          vendor.contacts?.[0]?.mobile || vendor.phone,
          vendor.email,
          vendor.addresses?.[0]?.cityId,
          vendor.gstin,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus = status === "all" || vendor.status === status;
      const matchesType = type === "all" || vendor.vendorType === type;
      const matchesState =
        state === "all" || vendor.addresses?.[0]?.stateId === state;

      return matchesSearch && matchesStatus && matchesType && matchesState;
    });
  }, [vendorSource, search, status, type, state]);

  useEffect(() => {
    setPage(1);
  }, [search, status, type, state]);

  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedVendors = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredVendors.slice(start, start + pageSize);
  }, [filteredVendors, page]);

  /* -------------------------------- */
  /* Statistics                       */
  /* -------------------------------- */

  const totalOutstanding = filteredVendors.reduce(
    (sum, vendor) => sum + vendor.outstanding,
    0
  );

  const totalPurchase = filteredVendors.reduce(
    (sum, vendor) => sum + vendor.totalPurchase,
    0
  );

  const activeVendors = filteredVendors.filter(
    (v) => v.status === "Active"
  ).length;

  return (
    <>
      {/* Soft light page background */}
      <div className="overflow-hidden">
        {/* Header – clean white with subtle tint */}
        <div className="border-b border-slate-200/70 bg-white px-5 py-6 sm:px-7 lg:px-8 rounded-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/50">
                <Building2 size={26} className="text-primary" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
                  Vendor Management
                </h1>
                <p className="mt-1.5 max-w-xl text-sm text-slate-500">
                  Manage suppliers, distributors, manufacturers, and service
                  providers in one calm workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                onClick={handleExportVendors}
              >
                <Download size={16} className="mr-2" />
                Export
              </Button>

              <Button
                variant="outline"
                className="rounded-xl border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                onClick={handleDownloadTemplate}
              >
                <Download size={16} className="mr-2" />
                Download Template
              </Button>

              <Button
                variant="outline"
                className="rounded-xl border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} className="mr-2" />
                Import
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleImportSelected}
              />

              <Button
                className="gap-2 rounded-xl px-4 py-2 text-white shadow-sm"
                onClick={() => router.push("/vendors/create")}
              >
                <Plus size={17} />
                Add Vendor
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="py-6">
          {/* Stats */}
          <VendorStats
            totalVendors={filteredVendors.length}
            activeVendors={activeVendors}
            totalPurchase={totalPurchase}
            outstanding={totalOutstanding}
          />

          {/* Filters – soft white card */}
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <VendorFilters
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
              type={type}
              onTypeChange={setType}
              state={state}
              onStateChange={setState}
              clearFilters={() => {
                setSearch("");
                setStatus("all");
                setType("all");
                setState("all");
              }}
            />
          </div>

          {/* Section header */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Vendors</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {filteredVendors.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {vendorSource.length}
                </span>{" "}
                vendors
              </p>
            </div>

            <Button
              variant="outline"
              className="rounded-xl border-slate-200 bg-white px-4 py-2 text-slate-600 hover:bg-slate-50"
              onClick={() => router.refresh()}
            >
              Refresh
            </Button>
          </div>

          {/* Vendor cards grid */}
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {loading ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center xl:col-span-2">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-sky-200 border-t-sky-500" />
                <p className="text-sm text-slate-500">Loading vendors...</p>
              </div>
            ) : error ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/40 px-6 text-center xl:col-span-2">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center xl:col-span-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/50">
                  <Building2 size={30} className="text-sky-500" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-800">
                  No Vendors Found
                </h3>
                <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                  No vendors match your current filters. Try adjusting the
                  filters or create a new vendor.
                </p>

                <Button
                  className="mt-5 gap-2 rounded-xl px-4 py-2 text-white"
                  onClick={() => router.push("/vendors/create")}
                >
                  <Plus size={17} />
                  Add Vendor
                </Button>
              </div>
            ) : (
              pagedVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onView={() => router.push(`/vendors/${vendor.id}`)}
                  onEdit={() => router.push(`/vendors/${vendor.id}/edit`)}
                  onToggleStatus={() => handleToggleVendorStatus(vendor)}
                  onPurchase={() =>
                    router.push(`/purchase/new?vendor=${vendor.id}`)
                  }
                  onPayment={() =>
                    router.push(`/payments/new?vendor=${vendor.id}`)
                  }
                  onDelete={() => handleDeleteVendor(vendor.id)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredVendors.length > 0 && totalPages > 1 && (
            <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalRecords={filteredVendors.length}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}