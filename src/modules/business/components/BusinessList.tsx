"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, Search, Store, UserCheck, CheckCircle2 } from "lucide-react";
import BusinessCard from "./BusinessCard";
import { Button, Input } from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { Business, Branch } from "../types";

interface BusinessListProps {
    businesses: Business[];
    rawRecords?: Record<string, unknown>[];
    onAddBusiness?: () => void;
    onAddBranch?: (businessId: string) => void;
    onAddVendor?: (businessId: string) => void;
    onEditBusiness?: (businessId: string) => void;
    onDeleteBusiness?: (businessId: string) => void;
    onEditBranch?: (branch: Branch) => void;
    onDeleteBranch?: (branch: Branch) => void;
}

type StatusFilter = "all" | "active" | "inactive";

export default function BusinessList({
    businesses,
    rawRecords,
    onAddBusiness,
    onAddBranch,
    onAddVendor,
    onEditBusiness,
    onDeleteBusiness,
    onEditBranch,
    onDeleteBranch,
}: BusinessListProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const stats = useMemo(() => {
        const active = businesses.filter((b) => b.status === "Active").length;
        const totalBranches = businesses.reduce(
            (sum, b) => sum + b.branches.length,
            0
        );

        return {
            total: businesses.length,
            active,
            totalBranches,
        };
    }, [businesses]);

    const filteredBusinesses = useMemo(() => {
        let list = businesses;

        if (statusFilter !== "all") {
            list = list.filter((b) =>
                statusFilter === "active"
                    ? b.status === "Active"
                    : b.status !== "Active"
            );
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((business) =>
                [
                    business.name,
                    business.legalName,
                    business.businessType,
                    business.gstin,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(q)
            );
        }

        return list;
    }, [businesses, search, statusFilter]);

    const [vendorModalOpen, setVendorModalOpen] = useState(false);

    const router = useRouter();

    return (
        <>
            {/* Header */}

            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Building2
                                className="text-primary"
                                size={24}
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-text">
                                Business Management
                            </h1>

                            <p className="mt-1 text-muted">
                                Manage businesses, branches and vendors
                                from one place.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-end gap-3">
                    <Button
                        onClick={() => onAddBusiness?.() ?? router.push("/business-setup/add-business")}
                        className="gap-2"
                    >
                        <Plus size={18} />
                        Add Business
                    </Button>
                </div>

            </div>

            {/* Stats strip */}

            {businesses.length > 0 && (
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Building2 size={20} />
                        </span>
                        <div>
                            <p className="text-2xl font-bold text-text">{stats.total}</p>
                            <p className="text-xs text-muted">Total Businesses</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <CheckCircle2 size={20} />
                        </span>
                        <div>
                            <p className="text-2xl font-bold text-text">{stats.active}</p>
                            <p className="text-xs text-muted">Active</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                            <Store size={20} />
                        </span>
                        <div>
                            <p className="text-2xl font-bold text-text">
                                {stats.totalBranches}
                            </p>
                            <p className="text-xs text-muted">Total Branches</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Search + filters */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="relative flex-1 sm:max-w-sm">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <Input
                        placeholder="Search business..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="pl-11"
                    />
                </div>

                <div className="flex gap-2">
                    {(["all", "active", "inactive"] as StatusFilter[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(key)}
                            className={cn(
                                "rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition",
                                statusFilter === key
                                    ? "border-primary bg-primary text-white shadow-sm"
                                    : "border-gray-200 bg-white text-muted hover:border-primary/40 hover:text-primary"
                            )}
                        >
                            {key}
                        </button>
                    ))}
                </div>

            </div>

            {/* Business Grid */}

            {filteredBusinesses.length === 0 ? (
                <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed bg-white">

                    <Building2
                        size={48}
                        className="text-primary"
                    />

                    <h3 className="mt-4 text-xl font-semibold">
                        {businesses.length === 0
                            ? "No Business Found"
                            : "No businesses match your filters"}
                    </h3>

                    <p className="mt-2 text-muted">
                        {businesses.length === 0
                            ? "Create your first business to get started."
                            : "Try adjusting your search or status filter."}
                    </p>

                    {businesses.length === 0 && (
                        <Button
                            className="mt-6 gap-2"
                            onClick={() => router.push("/business-setup/add-business")}
                        >
                            <Plus size={18} />
                            Add Business
                        </Button>
                    )}

                </div>
            ) : (
                <div
                    className="
                        grid
                        gap-6
                        lg:grid-cols-1
                        2xl:grid-cols-1
                    "
                >
                    {filteredBusinesses.map((business) => (
                        <BusinessCard
                            key={business.id}
                            business={business}
                            // pass raw record if available
                            rawRecord={rawRecords?.find((r) => String(r.id) === String(business.id))}
                            onAddBranch={() =>
                                onAddBranch?.(business.id)
                            }
                            onAddVendor={() =>
                                onAddVendor?.(business.id)
                            }
                            onEdit={() => onEditBusiness?.(business.id)}
                            onDelete={() => onDeleteBusiness?.(business.id)}
                            onEditBranch={onEditBranch}
                            onDeleteBranch={onDeleteBranch}
                        />
                    ))}
                </div>
            )}
        </>
    );
}