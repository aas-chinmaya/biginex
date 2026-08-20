"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Building2,
    ChevronDown,
    ChevronUp,
    MapPin,
    Store,
    FileText,
    Phone,
    Mail,
    Globe,
    Eye,
} from "lucide-react";

import BranchList from "./BranchList";
import BusinessStats from "./BusinessStats";

import {
    Card,
    CardContent,
    CardHeader,
    Button,
    Badge,
} from "@/components/ui";
import { cn } from "@/components/ui/utils";

import { Business, Branch } from "../types";
import Link from "next/link";

interface BusinessCardProps {
    business: Business;
    rawRecord?: Record<string, unknown> | undefined;
    onAddBranch?: () => void;
    onAddVendor?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onEditBranch?: (branch: Branch) => void;
    onDeleteBranch?: (branch: Branch) => void;
}

export default function BusinessCard({
    business,
    rawRecord,
    onAddBranch,
    onAddVendor,
    onEdit,
    onDelete,
    onEditBranch,
    onDeleteBranch,
}: BusinessCardProps) {
    const [expanded, setExpanded] = useState(true);
    const router = useRouter();

    const showDetails = false;
    const [logoFailed, setLogoFailed] = useState(false);

    return (
        <>
            <Card className="overflow-hidden border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                {/* Accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-primary/20" />

                {/* Header */}

                <CardHeader className="pb-4">

                    <div className="flex items-start justify-between gap-3">

                        <Link
                            href={`/manage-business/view?id=${business.id}`}
                            className="flex flex-1 gap-4 rounded-xl transition hover:bg-primary/5"
                        >
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
                                {business.logo && !logoFailed ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={business.logo}
                                        alt={`${business.name} logo`}
                                        className="h-full w-full object-cover"
                                        onError={() => setLogoFailed(true)}
                                    />
                                ) : (
                                    <Building2
                                        size={28}
                                        className="text-primary"
                                    />
                                )}
                            </div>

                            <div className="min-w-0">

                                <h2 className="truncate text-xl font-semibold text-text">
                                    {business.name}
                                </h2>

                                <p className="mt-1 truncate text-sm text-muted">
                                    {business.legalName}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">

                                    <Badge>
                                        {business.businessType}
                                    </Badge>

                                    <Badge
                                        variant={
                                            business.status === "Active"
                                                ? "success"
                                                : "secondary"
                                        }
                                    >
                                        {business.status}
                                    </Badge>

                                    {business.industry && (
                                        <Badge variant="secondary">
                                            {business.industry}
                                        </Badge>
                                    )}

                                </div>

                            </div>
                        </Link>

                        <button
                            onClick={() =>
                                setExpanded(!expanded)
                            }
                            className="shrink-0 rounded-lg p-2 transition hover:bg-primary/10"
                        >
                            {expanded ? (
                                <ChevronUp
                                    size={20}
                                    className="text-primary"
                                />
                            ) : (
                                <ChevronDown
                                    size={20}
                                    className="text-primary"
                                />
                            )}
                        </button>

                    </div>

                    {/* Quick contact strip */}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-gray-100 pt-4 text-xs text-muted">
                        {business.phone && (
                            <span className="flex items-center gap-1.5">
                                <Phone size={13} className="text-primary" />
                                {business.phone}
                            </span>
                        )}
                        {business.email && (
                            <span className="flex items-center gap-1.5">
                                <Mail size={13} className="text-primary" />
                                {business.email}
                            </span>
                        )}
                        {business.website && (
                            <span className="flex items-center gap-1.5">
                                <Globe size={13} className="text-primary" />
                                {business.website.replace(/^https?:\/\//, "")}
                            </span>
                        )}
                    </div>

                </CardHeader>

                <CardContent className="space-y-6">

                    {/* Business Details */}

                    <div className="grid grid-cols-2 gap-4">

                        <div className="rounded-xl bg-background p-4">

                            <div className="flex items-center gap-2">

                                <FileText
                                    size={16}
                                    className="text-primary"
                                />

                                <span className="text-xs uppercase tracking-wide text-muted">
                                    GSTIN
                                </span>

                            </div>

                            <p className="mt-2 truncate text-sm font-medium">
                                {business.gstin || "—"}
                            </p>

                        </div>

                        <div className="rounded-xl bg-background p-4">

                            <div className="flex items-center gap-2">

                                <MapPin
                                    size={16}
                                    className="text-primary"
                                />

                                <span className="text-xs uppercase tracking-wide text-muted">
                                    Location
                                </span>

                            </div>

                            <p className="mt-2 truncate text-sm font-medium">
                                {business.city || "—"}
                            </p>

                        </div>

                    </div>

                    {/* Statistics */}

                    <BusinessStats
                        branches={business.branches.length}
                        vendors={business.vendors}
                        employees={business.employees}
                    />

                    {/* Expandable Branch Section */}

                    <div
                        className={cn(
                            "overflow-hidden transition-all duration-300",
                            expanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                        )}
                    >
                        <BranchList
                            branches={business.branches}
                            onEdit={onEditBranch}
                            onDelete={onDeleteBranch}
                        />
                    </div>

                    {showDetails && (
                        <div className="rounded-md border bg-background p-4">
                            <pre className="max-h-60 overflow-auto text-xs">
                                {JSON.stringify((rawRecord ?? business), null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Actions */}

                    <div className="flex flex-wrap items-center gap-3 border-t pt-5">

                        <Button
                            size="sm"
                            onClick={() => {
                            onAddBranch?.();
                            }}
                            className="gap-2"
                        >
                            <Store size={16} />
                            Add Branch
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onEdit}
                            className="gap-2"
                        >
                            Edit
                        </Button>

                        <Button
                            variant="danger"
                            size="sm"
                            onClick={onDelete}
                            className="gap-2"
                        >
                            Delete
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onAddVendor?.()}
                            className="gap-2"
                        >
                            Add Vendor
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="ml-auto gap-2"
                            onClick={() => router.push(`/manage-business/view?id=${business.id}`)}
                        >
                            <Eye size={16} />
                            View Details
                        </Button>

                    </div>

                </CardContent>

            </Card>

        </>
    );
}
