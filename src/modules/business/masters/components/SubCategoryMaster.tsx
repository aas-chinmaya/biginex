"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Pencil,
  Trash2,
  Layers,
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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
import { categoryMasterApi, subCategoryMasterApi } from "@/modules/business/masters/api/masterApi";

// ── Types ───────────────────────────────────────────────────────────────────
// NOTE: the Prisma model maps subCategoryName + a categoryId relation onto the
// "categories" table (see @@map("categories") in schema.prisma). The parent
// lookup table itself is Category → "business_categories".
export interface CategoryOption {
  id: string | number;
  categoryName: string;
}

export interface SubCategory {
  id: string | number;
  categoryId: string | number;
  subCategoryName: string;
  description: string | null;
  status: boolean;
  updatedAt: string;
  category?: CategoryOption;
}

interface SubCategoryPayload {
  categoryId: string | number;
  subCategoryName: string;
  description: string | null;
  status: boolean;
}

type StatusFilter = "all" | "true" | "false";
type BannerState = { type: "success" | "error"; text: string } | null;
type ModalState =
  | { mode: "add" }
  | { mode: "edit"; row: SubCategory }
  | null;

// ── Config ──────────────────────────────────────────────────────────────────
const API_BASE = "/subcategories";
const CATEGORY_API_BASE = "/categories";
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

export default function SubCategoryMaster() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const [rows, setRows] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState<BannerState>(null);

  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<SubCategory | null>(null);
  const [saving, setSaving] = useState(false);

  const bannerTimer = React.useRef<number | undefined>(undefined);
  const showBanner = (type: "success" | "error", text: string) => {
    setBanner({ type, text });
    window.clearTimeout(bannerTimer.current);
    bannerTimer.current = window.setTimeout(() => setBanner(null), 3500);
  };

  // Load parent categories for the select dropdown.
  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryMasterApi.list();
      const categoriesFromApi = Array.isArray(data) ? data : [];
      setCategories(categoriesFromApi);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoaded(true);
    }
  }, []);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subCategoryMasterApi.list();
      const rowsFromApi = Array.isArray(data) ? data : [];
      let filtered = rowsFromApi;

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter((row) => row.subCategoryName.toLowerCase().includes(query));
      }

      if (statusFilter === "true" || statusFilter === "false") {
        filtered = filtered.filter((row) => row.status === (statusFilter === "true"));
      }

      setRows(filtered);
    } catch (err) {
      setRows([]);
      showBanner("error", subCategoryMasterApi.getErrorMessage(err, "Unable to load sub-categories."));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const categoryName = (row: SubCategory) =>
    row.category?.categoryName ??
    categories.find((c) => c.id === row.categoryId)?.categoryName ??
    "—";

  // ── Actions ────────────────────────────────────────────────────────────
  const handleCreate = async (payload: SubCategoryPayload) => {
    setSaving(true);
    try {
      await subCategoryMasterApi.create({
        categoryId: payload.categoryId,
        subCategoryName: payload.subCategoryName,
        description: payload.description,
      });
      showBanner("success", `"${payload.subCategoryName}" added.`);
      setModal(null);
      fetchRows();
    } catch (err) {
      showBanner("error", subCategoryMasterApi.getErrorMessage(err, "Failed to create sub-category."));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string | number, payload: SubCategoryPayload) => {
    setSaving(true);
    try {
      await subCategoryMasterApi.update(id, {
        categoryId: payload.categoryId,
        subCategoryName: payload.subCategoryName,
        description: payload.description,
        status: payload.status,
      });
      showBanner("success", "Sub-category updated.");
      setModal(null);
      fetchRows();
    } catch (err) {
      showBanner("error", subCategoryMasterApi.getErrorMessage(err, "Failed to update sub-category."));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (row: SubCategory) => {
    try {
      await subCategoryMasterApi.update(row.id, { status: !row.status });
      showBanner("success", `Marked ${!row.status ? "active" : "inactive"}.`);
      fetchRows();
    } catch (err) {
      showBanner("error", subCategoryMasterApi.getErrorMessage(err, "Failed to update status."));
    }
  };

  const handleDelete = async (row: SubCategory) => {
    try {
      await subCategoryMasterApi.remove(row.id);
      showBanner("success", `"${row.subCategoryName}" deleted.`);
      setConfirmDelete(null);
      fetchRows();
    } catch (err) {
      showBanner("error", subCategoryMasterApi.getErrorMessage(err, "Failed to delete sub-category."));
    }
  };

  // ── Columns ────────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<SubCategory>[]>(
    () => [
      {
        accessorKey: "subCategoryName",
        header: "Sub-category name",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">{row.original.subCategoryName}</span>
        ),
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        cell: ({ row }) => <Badge variant="secondary">{categoryName(row.original)}</Badge>,
        size: 160,
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
          const sub = row.original;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={sub.status}
                onCheckedChange={() => handleToggleStatus(sub)}
                aria-label={`Mark ${sub.subCategoryName} ${sub.status ? "inactive" : "active"}`}
              />
              <Badge variant={sub.status ? "success" : "danger"}>
                {sub.status ? "Active" : "Inactive"}
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
          const sub = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${sub.subCategoryName}`}
                onClick={() => setModal({ mode: "edit", row: sub })}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${sub.subCategoryName}`}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setConfirmDelete(sub)}
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
    [categories]
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Sub-categories</h1>
            <p className="text-sm text-muted">
              Master table &middot; {rows.length} record{rows.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => setModal({ mode: "add" })} disabled={!categoriesLoaded || categories.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add sub-category
        </Button>
      </div>

      {categoriesLoaded && categories.length === 0 && (
        <Alert variant="warning">
          <AlertDescription>
            No categories found. Add a category first before creating sub-categories.
          </AlertDescription>
        </Alert>
      )}

      {banner && (
        <Alert variant={banner.type === "success" ? "success" : "error"}>
          <AlertDescription>{banner.text}</AlertDescription>
        </Alert>
      )}

      {/* Toolbar */}
      <TableToolbar>
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <Search value={search} onChange={setSearch} placeholder="Search sub-categories..." />
          <Filters
            filters={statusFilterConfig}
            onChange={(values) => setStatusFilter((values.status as StatusFilter) || "all")}
          />
        </div>
      </TableToolbar>

      {/* Table */}
      {!loading && rows.length === 0 ? (
        <NoData
          title="No sub-categories found"
          description="Try a different search or filter, or add a new sub-category."
          buttonText="Clear filters"
          onReset={resetFilters}
        />
      ) : (
        <>
          <DataTable columns={columns} data={pageRows} loading={loading} emptyMessage="No sub-categories found." />
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
      <SubCategoryFormModal
        open={modal !== null}
        mode={modal?.mode ?? "add"}
        row={modal?.mode === "edit" ? modal.row : undefined}
        categories={categories}
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
            <ModalTitle>Delete sub-category?</ModalTitle>
            <ModalDescription>
              This will remove{" "}
              <span className="font-medium text-gray-700">"{confirmDelete?.subCategoryName}"</span>.
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

interface SubCategoryFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  row?: SubCategory;
  categories: CategoryOption[];
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: SubCategoryPayload) => void;
}

function SubCategoryFormModal({
  open,
  mode,
  row,
  categories,
  saving,
  onOpenChange,
  onSubmit,
}: SubCategoryFormModalProps) {
  const [categoryId, setCategoryId] = useState<string | number | undefined>(row?.categoryId);
  const [name, setName] = useState(row?.subCategoryName || "");
  const [description, setDescription] = useState(row?.description || "");
  const [status, setStatus] = useState(row?.status ?? true);
  const [errors, setErrors] = useState<{ category?: string; name?: string }>({});

  // Re-sync form fields whenever a different row is opened for editing.
  useEffect(() => {
    if (open) {
      setCategoryId(row?.categoryId ?? (categories.length > 0 ? categories[0].id : undefined));
      setName(row?.subCategoryName || "");
      setDescription(row?.description || "");
      setStatus(row?.status ?? true);
      setErrors({});
    }
  }, [open, row, categories]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { category?: string; name?: string } = {};
    if (!categoryId) nextErrors.category = "A parent category is required.";
    if (!name.trim()) nextErrors.name = "Sub-category name is required.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSubmit({
      categoryId: categoryId as string | number,
      subCategoryName: name.trim(),
      description: description.trim() || null,
      status,
    });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={submit}>
          <ModalHeader>
            <ModalTitle>{mode === "add" ? "Add sub-category" : "Edit sub-category"}</ModalTitle>
            <ModalDescription>
              {mode === "add"
                ? "Create a new entry in the sub-categories master table."
                : "Update this sub-category's details."}
            </ModalDescription>
          </ModalHeader>

          <ModalBody className="space-y-4">
            <FormField label="Parent category" required error={errors.category}>
              <Select
                value={categoryId ? String(categoryId) : ""}
                onValueChange={(v) => setCategoryId(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Sub-category name" required error={errors.name}>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mobile Phones"
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
              {saving ? "Saving..." : mode === "add" ? "Add sub-category" : "Save changes"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
