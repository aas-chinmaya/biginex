"use client";
import {
  Building2,
  Phone,
  User,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  BadgeIndianRupee,
} from "lucide-react";

import { useState } from "react";

import {
  Button,
  Card,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Switch,
} from "@/components/ui";

import { Vendor } from "../types";

interface VendorCardProps {
  vendor: Vendor;
  onView?: () => void;
  onEdit?: () => void;
  onPurchase?: () => void;
  onPayment?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);

export default function VendorCard({
  vendor,
  onView,
  onEdit,
  onPurchase,
  onPayment,
  onToggleStatus,
  onDelete,
}: VendorCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteConfirm = () => {
    setIsDeleteOpen(false);
    onDelete?.();
  };

  const contactName = vendor.contacts?.[0]?.name || "—";
  const contactPhone = vendor.contacts?.[0]?.mobile || vendor.phone || "—";
  const location =
    vendor.addresses?.[0]?.cityId ||
    vendor.addresses?.[0]?.stateId ||
    "—";

  const normalizedStatus = String(vendor.status ?? "").trim().toUpperCase();
  const isActiveStatus = normalizedStatus === "ACTIVE";
  const statusLabel =
    normalizedStatus === "ACTIVE"
      ? "Active"
      : normalizedStatus === "INACTIVE"
      ? "Inactive"
      : normalizedStatus === "BLOCKED"
      ? "Blocked"
      : vendor.status || "—";
  const statusActionLabel = isActiveStatus ? "Set Inactive" : "Set Active";

  return (
    <>
      <Card className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="p-5">
          {/* ── Top: Identity + Outstanding ───────────────── */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/50">
                <Building2 size={18} className="text-primary" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-[15px] font-semibold text-slate-800">
                    {vendor.vendorName}
                  </h2>
                  <Badge className="rounded-full border-0 bg-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {vendor.vendorType}
                  </Badge>
                  <Badge
                    className={`rounded-full border-0 px-2 py-0.5 text-[11px] font-medium ${
                      normalizedStatus === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700"
                        : normalizedStatus === "INACTIVE"
                        ? "bg-slate-100 text-slate-500"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {statusLabel}
                  </Badge>
                  {onToggleStatus && (
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                      <Switch
                        checked={isActiveStatus}
                        onCheckedChange={() => onToggleStatus?.()}
                        className="bg-slate-300 data-[state=checked]:bg-emerald-500"
                      />
                      <span className="text-[11px] font-medium text-slate-600">
                        {isActiveStatus ? "Active" : "Inactive"}
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {vendor.vendorCode}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Outstanding
              </p>
              <p className="text-sm font-semibold tabular-nums text-amber-600">
                ₹{formatCurrency(vendor.outstanding)}
              </p>
            </div>
          </div>

          {/* ── Contact line ──────────────────────────────── */}
          <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <User size={13} className="text-slate-300" />
              <span className="font-medium text-slate-600">{contactName}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone size={13} className="text-slate-300" />
              {contactPhone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-300" />
              {location}
            </span>
          </div>

          {/* ── Only 2 important details ──────────────────── */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-slate-50/90 px-3.5 py-3">
              <p className="text-[11px] font-medium text-slate-400">
                Total Purchase
              </p>
              <p className="mt-1 text-base font-semibold tabular-nums text-slate-800">
                ₹{formatCurrency(vendor.totalPurchase)}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50/70 px-3.5 py-3">
              <p className="text-[11px] font-medium text-emerald-600/80">
                Credit Limit
              </p>
              <p className="mt-1 text-base font-semibold tabular-nums text-emerald-700">
                ₹{formatCurrency(vendor.creditLimit)}
              </p>
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────── */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={onView}
                className="h-8 gap-1.5 rounded-lg border-sky-200 bg-primary/10 px-2.5 text-xs font-medium text-primary hover:bg-primary/20"
              >
                <Eye size={13} />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Pencil size={13} />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                className="h-8 gap-1.5 rounded-lg border-red-100 bg-red-50/60 px-2.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={13} />
                Delete
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                onClick={onPurchase}
                className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium text-white"
              >
                <BadgeIndianRupee size={13} />
                Purchase
              </Button>
              <Button
                variant="outline"
                onClick={onPayment}
                className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Payment
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete confirmation */}
      <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Delete vendor?</ModalTitle>
            <ModalDescription>
              This action will permanently remove{" "}
              {vendor.vendorName || "this vendor"}.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this vendor from your records?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteConfirm}
              className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}