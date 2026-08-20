"use client";

import {
    Building2,
    Mail,
    Phone,
    User,
    MapPin,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    Card,
    CardContent,
    Badge,
    Button,
} from "@/components/ui";

import { Branch } from "../types";

interface BranchCardProps {
    branch: Branch;
    onEdit?: (branch: Branch) => void;
    onDelete?: (branch: Branch) => void;
}

export default function BranchCard({
    branch,
    onEdit,
    onDelete,
}: BranchCardProps) {
    return (
        <Card
            className="
                border
                border-gray-200
                transition-all
                duration-300
                hover:border-primary/30
                hover:shadow-lg
            "
        >
            <CardContent className="p-5">

                {/* Header */}

                <div className="flex items-start justify-between">

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-primary/10
                            "
                        >
                            <Building2
                                size={22}
                                className="text-primary"
                            />
                        </div>

                        <div>

                            <h3 className="text-lg font-semibold">
                                {branch.name}
                            </h3>

                            <p className="text-sm text-muted">
                                {branch.code}
                            </p>

                        </div>

                    </div>

                    <Badge
                        variant={
                            branch.status === "Active"
                                ? "success"
                                : "secondary"
                        }
                    >
                        {branch.status}
                    </Badge>

                </div>

                {/* Information */}

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                    {/* Address */}

                    <div className="flex items-start gap-3">

                        <MapPin
                            size={18}
                            className="mt-0.5 shrink-0 text-primary"
                        />

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                Address
                            </p>

                            <p className="text-sm text-text">
                                {branch.address}
                            </p>

                            <p className="text-sm text-muted">
                                {branch.city}, {branch.state}, {branch.country}
                            </p>

                        </div>

                    </div>

                    {/* Branch Manager */}

                    <div className="flex items-start gap-3">

                        <User
                            size={18}
                            className="mt-0.5 shrink-0 text-primary"
                        />

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                Branch Manager
                            </p>

                            <p className="text-sm text-text">
                                {branch.manager}
                            </p>

                        </div>

                    </div>

                    {/* Phone */}

                    <div className="flex items-start gap-3">

                        <Phone
                            size={18}
                            className="mt-0.5 shrink-0 text-primary"
                        />

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                Phone
                            </p>

                            <p className="text-sm text-text">
                                {branch.phone}
                            </p>

                        </div>

                    </div>

                    {/* Email */}

                    <div className="flex items-start gap-3">

                        <Mail
                            size={18}
                            className="mt-0.5 shrink-0 text-primary"
                        />

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                Email
                            </p>

                            <p className="text-sm break-all text-text">
                                {branch.email}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="mt-6 flex items-center justify-between border-t pt-4">

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit?.(branch)}
                        className="gap-2"
                    >
                        <Pencil size={16} />
                        Edit
                    </Button>

                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete?.(branch)}
                        className="gap-2"
                    >
                        <Trash2 size={16} />
                        Delete
                    </Button>

                </div>

            </CardContent>
        </Card>
    );
}