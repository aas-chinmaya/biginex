"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Pencil,
  Trash2,
  Coins,
} from "lucide-react";

import {
  Button,
  Badge,
  Switch,
  Alert,
  AlertDescription,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui";
import { FormField } from "@/components/form";
import {
  DataTable,
  TableToolbar,
  Search,
  Filters,
  Pagination,
  NoData,
} from "@/components/data-table";
import type { FilterItem } from "@/components/data-table/Filters";
import { currencyMasterApi } from "@/modules/business/masters/api/masterApi";

export interface Currency {
  id: string | number;
  currencyName: string;
  currencyCode: string;
  currencySymbol: string;
  countryName: string | null;
  status: boolean;
  updatedAt: string;
}

interface CurrencyPayload {
  currencyName: string;
  currencyCode: string;
  currencySymbol: string;
  countryName: string | null;
  status: boolean;
}

type StatusFilter = "all" | "true" | "false";
type BannerState = { type: "success" | "error"; text: string } | null;
type ModalState =
  | { mode: "add" }
  | { mode: "edit"; row: Currency }
  | null;

// ── Config ──────────────────────────────────────────────────────────────────
const API_BASE = "/currencies";
const PAGE_SIZE = 8;

const statusFilterConfig: FilterItem[] = [
  {
    label: "Status",
    key: "status",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];

export default function CurrencyMaster() {

  const [rows, setRows] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState<BannerState>(null);

  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<Currency | null>(null);
  const [saving, setSaving] = useState(false);

  const bannerTimer = React.useRef<number | undefined>(undefined);
  const showBanner = (type: "success" | "error", text: string) => {
    setBanner({ type, text });
    window.clearTimeout(bannerTimer.current);
    bannerTimer.current = window.setTimeout(() => setBanner(null), 3500);
  };

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await currencyMasterApi.list();
      const rowsFromApi = Array.isArray(data) ? data : [];
      let filtered = rowsFromApi;

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (row) =>
            row.currencyName.toLowerCase().includes(query) ||
            row.currencyCode.toLowerCase().includes(query)
        );
      }

      if (statusFilter === "true" || statusFilter === "false") {
        filtered = filtered.filter((row) => row.status === (statusFilter === "true"));
      }

      setRows(filtered);
    } catch (err) {
      setRows([]);
      showBanner("error", currencyMasterApi.getErrorMessage(err, "Unable to load currencies."));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  useEffect(() => setPage(1), [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  // ── Actions ────────────────────────────────────────────────────────────
  const handleCreate = async (payload: CurrencyPayload) => {
    setSaving(true);
    try {
      await currencyMasterApi.create({
        currencyName: payload.currencyName,
        currencyCode: payload.currencyCode,
        currencySymbol: payload.currencySymbol,
        countryName: payload.countryName,
      });
      showBanner("success", `"${payload.currencyName}" added.`);
      setModal(null);
      fetchRows();
    } catch (err) {
      showBanner("error", currencyMasterApi.getErrorMessage(err, "Failed to create currency."));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string | number, payload: CurrencyPayload) => {
    setSaving(true);
    try {
      await currencyMasterApi.update(id, {
        currencyName: payload.currencyName,
        currencyCode: payload.currencyCode,
        currencySymbol: payload.currencySymbol,
        countryName: payload.countryName,
        status: payload.status,
      });
      showBanner("success", "Currency updated.");
      setModal(null);
      fetchRows();
    } catch (err) {
      showBanner("error", currencyMasterApi.getErrorMessage(err, "Failed to update currency."));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (row: Currency) => {
    try {
      await currencyMasterApi.update(row.id, { status: !row.status });
      showBanner("success", `Marked ${!row.status ? "active" : "inactive"}.`);
      fetchRows();
    } catch (err) {
      showBanner("error", currencyMasterApi.getErrorMessage(err, "Failed to update status."));
    }
  };

  const handleDelete = async (row: Currency) => {
    try {
      await currencyMasterApi.remove(row.id);
      showBanner("success", `"${row.currencyName}" deleted.`);
      setConfirmDelete(null);
      fetchRows();
    } catch (err) {
      showBanner("error", currencyMasterApi.getErrorMessage(err, "Failed to delete currency."));
    }
  };

  // ── Columns ────────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<Currency>[]>(
    () => [
      {
        accessorKey: "currencyName",
        header: "Currency",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-600">
              {row.original.currencySymbol}
            </span>
            <span className="font-medium text-gray-900">{row.original.currencyName}</span>
          </div>
        ),
      },
      {
        accessorKey: "currencyCode",
        header: "Code",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.currencyCode}</Badge>
        ),
        size: 100,
      },
      {
        accessorKey: "countryName",
        header: "Country",
        cell: ({ row }) => (
          <span className="text-gray-500">{row.original.countryName || "—"}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const currency = row.original;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={currency.status}
                onCheckedChange={() => handleToggleStatus(currency)}
                aria-label={`Mark ${currency.currencyName} ${currency.status ? "inactive" : "active"}`}
              />
              <Badge variant={currency.status ? "success" : "danger"}>
                {currency.status ? "Active" : "Inactive"}
              </Badge>
            </div>
          );
        },
        size: 160,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const currency = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${currency.currencyName}`}
                onClick={() => setModal({ mode: "edit", row: currency })}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${currency.currencyName}`}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setConfirmDelete(currency)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
        size: 60,
      },
    ],
    []
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Coins className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Currencies</h1>
            <p className="text-sm text-muted">
              Master table &middot; {rows.length} record{rows.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => setModal({ mode: "add" })}>
          <Plus className="mr-2 h-4 w-4" />
          Add currency
        </Button>
      </div>

      {banner && (
        <Alert variant={banner.type === "success" ? "success" : "error"}>
          <AlertDescription>{banner.text}</AlertDescription>
        </Alert>
      )}

      {/* Toolbar */}
      <TableToolbar>
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <Search value={search} onChange={setSearch} placeholder="Search currencies..." />
          <Filters
            filters={statusFilterConfig}
            onChange={(values) => setStatusFilter((values.status as StatusFilter) || "all")}
          />
        </div>
      </TableToolbar>

      {/* Table */}
      {!loading && rows.length === 0 ? (
        <NoData
          title="No currencies found"
          description="Try a different search or filter, or add a new currency."
          buttonText="Clear filters"
          onReset={resetFilters}
        />
      ) : (
        <>
          <DataTable columns={columns} data={pageRows} loading={loading} emptyMessage="No currencies found." />
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalRecords={rows.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Add / Edit modal */}
      <CurrencyFormModal
        open={modal !== null}
        mode={modal?.mode ?? "add"}
        row={modal?.mode === "edit" ? modal.row : undefined}
        saving={saving}
        onOpenChange={(open) => !open && setModal(null)}
        onSubmit={(payload) =>
          modal?.mode === "edit" ? handleUpdate(modal.row.id, payload) : handleCreate(payload)
        }
      />

      {/* Delete confirmation */}
      <Modal open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete currency?</ModalTitle>
            <ModalDescription>
              This will remove{" "}
              <span className="font-medium text-gray-700">"{confirmDelete?.currencyName}"</span>.
              Businesses linked to it will keep referencing this id, but it won't appear in
              active lists.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => confirmDelete && handleDelete(confirmDelete)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

interface CurrencyFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  row?: Currency;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CurrencyPayload) => void;
}

function CurrencyFormModal({ open, mode, row, saving, onOpenChange, onSubmit }: CurrencyFormModalProps) {
  const [name, setName] = useState(row?.currencyName || "");
  const [code, setCode] = useState(row?.currencyCode || "");
  const [symbol, setSymbol] = useState(row?.currencySymbol || "");
  const [country, setCountry] = useState(row?.countryName || "");
  const [status, setStatus] = useState(row?.status ?? true);
  const [errors, setErrors] = useState<{ name?: string; code?: string; symbol?: string }>({});

  // Re-sync form fields whenever a different row is opened for editing.
  useEffect(() => {
    if (open) {
      setName(row?.currencyName || "");
      setCode(row?.currencyCode || "");
      setSymbol(row?.currencySymbol || "");
      setCountry(row?.countryName || "");
      setStatus(row?.status ?? true);
      setErrors({});
    }
  }, [open, row]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; code?: string; symbol?: string } = {};
    if (!name.trim()) nextErrors.name = "Currency name is required.";
    if (!code.trim()) nextErrors.code = "Currency code is required.";
    if (!symbol.trim()) nextErrors.symbol = "Currency symbol is required.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSubmit({
      currencyName: name.trim(),
      currencyCode: code.trim().toUpperCase(),
      currencySymbol: symbol.trim(),
      countryName: country.trim() || null,
      status,
    });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={submit}>
          <ModalHeader>
            <ModalTitle>{mode === "add" ? "Add currency" : "Edit currency"}</ModalTitle>
            <ModalDescription>
              {mode === "add"
                ? "Create a new entry in the currencies master table."
                : "Update this currency's details."}
            </ModalDescription>
          </ModalHeader>

          <ModalBody className="space-y-4">
            <FormField label="Currency name" required error={errors.name}>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Indian Rupee"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Currency code" required error={errors.code}>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. INR"
                  maxLength={3}
                />
              </FormField>

              <FormField label="Symbol" required error={errors.symbol}>
                <Input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. ₹"
                  maxLength={5}
                />
              </FormField>
            </div>

            <FormField label="Country">
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India"
              />
            </FormField>

            <FormField label="Status">
              <div className="flex items-center gap-2">
                <Switch checked={status} onCheckedChange={setStatus} />
                <span className="text-sm text-gray-600">{status ? "Active" : "Inactive"}</span>
              </div>
            </FormField>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : mode === "add" ? "Add currency" : "Save changes"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
