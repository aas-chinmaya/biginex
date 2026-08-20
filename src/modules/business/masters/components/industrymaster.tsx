

"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
} from "lucide-react";

import {
  Button,
  Badge,
  Switch,
  Alert,
  AlertDescription,
  Input,
  Textarea,
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
import { industryMasterApi } from "@/modules/business/masters/api/masterApi";



export interface Industry {
  id: string | number;
  industryName: string;
  description: string | null;
  status: boolean;
  updatedAt: string;
}

interface IndustryPayload {
  industryName: string;
  description: string | null;
  status: boolean;
}

type StatusFilter = "all" | "true" | "false";
type BannerState = { type: "success" | "error"; text: string } | null;
type ModalState =
  | { mode: "add" }
  | { mode: "edit"; row: Industry }
  | null;

// ── Config ──────────────────────────────────────────────────────────────────
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

export default function IndustryMaster() {

  const [rows, setRows] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState<BannerState>(null);

  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<Industry | null>(null);
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
      const data = await industryMasterApi.list();
      const rowsFromApi = Array.isArray(data) ? data : [];
      let filtered = rowsFromApi;

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter((row) => row.industryName.toLowerCase().includes(query));
      }

      if (statusFilter === "true" || statusFilter === "false") {
        filtered = filtered.filter((row) => row.status === (statusFilter === "true"));
      }

      setRows(filtered);
    } catch (err) {
      setRows([]);
      showBanner("error", industryMasterApi.getErrorMessage(err, "Unable to load industries."));
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
  const handleCreate = async (payload: IndustryPayload) => {
    setSaving(true);
    try {
      await industryMasterApi.create({
        industryName: payload.industryName,
        description: payload.description,
        status: payload.status,
      });
      showBanner("success", `"${payload.industryName}" added.`);
      setModal(null);
      fetchRows();
    } catch (err) {
      showBanner("error", industryMasterApi.getErrorMessage(err, "Failed to create industry."));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string | number, payload: IndustryPayload) => {
    setSaving(true);
    try {
      await industryMasterApi.update(id, {
        industryName: payload.industryName,
        description: payload.description,
        status: payload.status,
      });
      showBanner("success", "Industry updated.");
      setModal(null);
      fetchRows();
    } catch (err) {
      showBanner("error", industryMasterApi.getErrorMessage(err, "Failed to update industry."));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (row: Industry) => {
    try {
      await industryMasterApi.update(row.id, { status: !row.status });
      showBanner("success", `Marked ${!row.status ? "active" : "inactive"}.`);
      fetchRows();
    } catch (err) {
      showBanner("error", industryMasterApi.getErrorMessage(err, "Failed to update status."));
    }
  };

  const handleDelete = async (row: Industry) => {
    try {
      await industryMasterApi.remove(row.id);
      showBanner("success", `"${row.industryName}" deleted.`);
      setConfirmDelete(null);
      fetchRows();
    } catch (err) {
      showBanner("error", industryMasterApi.getErrorMessage(err, "Failed to delete industry."));
    }
  };

  // ── Columns ────────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<Industry>[]>(
    () => [
      {
        accessorKey: "industryName",
        header: "Industry name",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">{row.original.industryName}</span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="block max-w-xs truncate text-gray-500">
            {row.original.description || "—"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const industry = row.original;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={industry.status}
                onCheckedChange={() => handleToggleStatus(industry)}
                aria-label={`Mark ${industry.industryName} ${industry.status ? "inactive" : "active"}`}
              />
              <Badge variant={industry.status ? "success" : "danger"}>
                {industry.status ? "Active" : "Inactive"}
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
          const industry = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${industry.industryName}`}
                onClick={() => setModal({ mode: "edit", row: industry })}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${industry.industryName}`}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setConfirmDelete(industry)}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Industries</h1>
            <p className="text-sm text-muted">
              Master table &middot; {rows.length} record{rows.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => setModal({ mode: "add" })}>
          <Plus className="mr-2 h-4 w-4" />
          Add industry
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
          <Search value={search} onChange={setSearch} placeholder="Search industries..." />
          <Filters
            filters={statusFilterConfig}
            onChange={(values) => setStatusFilter((values.status as StatusFilter) || "all")}
          />
        </div>
      </TableToolbar>

      {/* Table */}
      {!loading && rows.length === 0 ? (
        <NoData
          title="No industries found"
          description="Try a different search or filter, or add a new industry."
          buttonText="Clear filters"
          onReset={resetFilters}
        />
      ) : (
        <>
          <DataTable columns={columns} data={pageRows} loading={loading} emptyMessage="No industries found." />
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
      <IndustryFormModal
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
            <ModalTitle>Delete industry?</ModalTitle>
            <ModalDescription>
              This will remove{" "}
              <span className="font-medium text-gray-700">"{confirmDelete?.industryName}"</span>.
              Businesses linked to it will keep referencing this id, but it won't appear in active
              lists.
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

interface IndustryFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  row?: Industry;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: IndustryPayload) => void;
}

function IndustryFormModal({ open, mode, row, saving, onOpenChange, onSubmit }: IndustryFormModalProps) {
  const [name, setName] = useState(row?.industryName || "");
  const [description, setDescription] = useState(row?.description || "");
  const [status, setStatus] = useState(row?.status ?? true);
  const [error, setError] = useState("");

  // Re-sync form fields whenever a different row is opened for editing.
  useEffect(() => {
    if (open) {
      setName(row?.industryName || "");
      setDescription(row?.description || "");
      setStatus(row?.status ?? true);
      setError("");
    }
  }, [open, row]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Industry name is required.");
      return;
    }
    setError("");
    onSubmit({ industryName: name.trim(), description: description.trim() || null, status });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={submit}>
          <ModalHeader>
            <ModalTitle>{mode === "add" ? "Add industry" : "Edit industry"}</ModalTitle>
            <ModalDescription>
              {mode === "add"
                ? "Create a new entry in the industries master table."
                : "Update this industry's details."}
            </ModalDescription>
          </ModalHeader>

          <ModalBody className="space-y-4">
            <FormField label="Industry name" required error={error || undefined}>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Information Technology"
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Short description..."
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
              {saving ? "Saving..." : mode === "add" ? "Add industry" : "Save changes"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}