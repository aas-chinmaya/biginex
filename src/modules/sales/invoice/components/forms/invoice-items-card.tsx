
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { BadgeIndianRupee, Minus, PackagePlus, Percent, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchInvoiceItems } from "../../slice/invoiceItem-slice";
import type { InvoiceItemFormValues, InvoiceFormValues } from "../../types/invoice-form.types";

const EMPTY_ITEMS: InvoiceItemFormValues[] = [];

const number = (value: unknown) => Math.max(0, Number(value) || 0);

const newLineItem = (): InvoiceItemFormValues => ({
  productId: "",
  productName: "",
  unit: "NOS",
  hsnSacCode: "NA",

  classification: "GOODS",

  quantity: 1,
  rate: 0,

  discountType: "percentage",
  discountValue: 0,

  taxableAmount: 0,

  cgst: 0,
  sgst: 0,
  igst: 0,
  cess: 0,

  grandTotal: 0,

  description: "",
});

function lineTotals(item: InvoiceItemFormValues) {
  const subtotal = number(item.quantity) * number(item.rate);
  const discount =
    item.discountType === "fixed"
      ? Math.min(number(item.discountValue), subtotal)
      : Math.min((subtotal * number(item.discountValue)) / 100, subtotal);
  const taxable = subtotal - discount;
  const tax = number(item.igst) || (taxable * 18) / 100;
  return { subtotal, discount, tax, total: taxable + tax };
}

export default function InvoiceItemsCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.invoiceItem);
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();
  const { fields, append, remove, replace } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" }) ?? EMPTY_ITEMS;

  useEffect(() => {
    void dispatch(fetchInvoiceItems());
  }, [dispatch]);

  useEffect(() => {
    if (!fields.length) replace([newLineItem()]);
  }, [fields.length, replace]);

  const totals = useMemo(
    () =>
      items.reduce(
        (result, item) => {
          const line = lineTotals(item);
          return {
            quantity: result.quantity + number(item.quantity),
            subtotal: result.subtotal + line.subtotal,
            discount: result.discount + line.discount,
            tax: result.tax + line.tax,
            total: result.total + line.total,
          };
        },
        { quantity: 0, subtotal: 0, discount: 0, tax: 0, total: 0 }
      ),
    [items]
  );

  const updateLine = (index: number, patch: Partial<InvoiceItemFormValues>) => {
    const current = { ...getValues(`items.${index}`), ...patch } as InvoiceItemFormValues;

    const qty = number(current.quantity);
    const rate = number(current.rate);
    const subtotal = qty * rate;
    const discountValue = number(current.discountValue);
    const discountAmount =
      current.discountType === "fixed"
        ? Math.min(discountValue, subtotal)
        : Math.min((subtotal * discountValue) / 100, subtotal);
    const taxable = Number((subtotal - discountAmount).toFixed(2));

    const gstRate =
      number(current.igst) > 0 && taxable > 0
        ? (number(current.igst) / taxable) * 100
        : 18;
    const taxAmount = Number(((taxable * gstRate) / 100).toFixed(2));

    const next: InvoiceItemFormValues = {
      ...current,
      taxableAmount: taxable,
      cgst: 0,
      sgst: 0,
      igst: taxAmount,
      cess: 0,
      grandTotal: Number((taxable + taxAmount).toFixed(2)),
    };

    Object.entries(next).forEach(([key, value]) =>
      setValue(`items.${index}.${key}` as never, value as never, {
        shouldDirty: true,
        shouldValidate: true,
      })
    );
  };

const selectProduct = (index: number, productId: string) => {
  const product = list.find((entry) => entry.id === productId);

  if (!product) return;

  const gstRate = number(product.gstRate) || 18;
  const rate = number(product.salePrice);

  updateLine(index, {
    productId: product.id,
    productName: product.name ?? "",
    unit: product.unit ?? "NOS",
    hsnSacCode: product.hsnSacCode ?? "NA",
  itemCode: product.itemCode ?? product.id,

    classification:
      product.classification === "SERVICES"
        ? "SERVICES"
        : "GOODS",

    rate,

    igst: Number(((rate * gstRate) / 100).toFixed(2)),

    discountValue: 0,
    discountType: "percentage",
  });
};

  const removeLine = (index: number) => {
    if (fields.length === 1) {
      replace([newLineItem()]);
    } else {
      remove(index);
    }
  };

  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600">
          <PackagePlus className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-900">Invoice items</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Add products or services, then set the quantity and discount for each line.
          </p>
        </div>
      </div>

      {typeof errors.items?.message === "string" && (
        <p className="mb-2 text-xs text-red-600">{errors.items.message}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="bg-gray-50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Product / service</th>
              <th className="p-3">Qty</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Discount</th>
              <th className="p-3 text-right">Tax</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3" />
            </tr>
          </thead>

          <tbody>
            {fields.map((field, index) => {
              const item = items[index] ?? newLineItem();
              const total = lineTotals(item);
              const itemError = errors.items?.[index];

              return (
                <tr key={field.id} className="border-t align-top transition-colors hover:bg-gray-50/60">
                  <td className="p-3 text-muted-foreground">{index + 1}</td>

                  <td className="min-w-72 max-w-72 p-2">
                    <ProductPicker
                      value={item.productId}
                      loading={loading}
                      products={list}
                      onSelect={(id) => selectProduct(index, id)}
                    />
                    <textarea
                      aria-label="Item note"
                      value={item.description ?? ""}
                      onChange={(event) => updateLine(index, { description: event.target.value })}
                      placeholder="Item note (optional)"
                      className="mt-2 min-h-16 w-full resize-y rounded-lg border border-amber-100 bg-amber-50/60 p-2 text-xs outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                    {itemError?.productId && (
                      <p className="mt-1 text-xs text-red-600">{itemError.productId.message}</p>
                    )}
                  </td>

                  <td className="p-2">
                    <Input
                      aria-label="Quantity"
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(event) => updateLine(index, { quantity: number(event.target.value) })}
                    />
                  </td>

                  <td className="p-2">
                    <Input
                      aria-label="Unit price"
                      type="number"
                      value={item.rate}
                      readOnly
                      className="text-right"
                    />
                  </td>

                  <td className="min-w-44 p-2">
                    <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
                      <Input
                        aria-label="Discount"
                        type="number"
                        min="0"
                        step="any"
                        value={item.discountValue ?? 0}
                        onChange={(event) =>
                          updateLine(index, { discountValue: number(event.target.value) })
                        }
                        className="min-w-0 flex-1 rounded-none border-0 px-3 focus:ring-0"
                      />
                      <Select
                        value={item.discountType ?? "percentage"}
                        onValueChange={(value) =>
                          updateLine(index, { discountType: value as "percentage" | "fixed" })
                        }
                      >
                        <SelectTrigger
                          aria-label="Discount type"
                          className="h-auto w-14 shrink-0 rounded-none border-0 border-l bg-gray-50 px-2"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            <span className="flex items-center gap-1">
                              <Percent className="h-3.5 w-3.5" /> %
                            </span>
                          </SelectItem>
                          <SelectItem value="fixed">
                            <span className="flex items-center gap-1">
                              <BadgeIndianRupee className="h-3.5 w-3.5" /> Rs
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>

                  <td className="p-2">
                    <Input
                      aria-label="Tax amount"
                      type="number"
                      value={total.tax.toFixed(2)}
                      readOnly
                      className="text-right"
                    />
                  </td>

                  <td className="p-3 text-right font-medium">Rs. {total.total.toFixed(2)}</td>

                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Add item after this row"
                        title="Add item"
                        className="rounded-full text-primary hover:bg-primary/10"
                        onClick={() => append(newLineItem())}
                      >
                        <Plus className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove item"
                        title="Remove item"
                        className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => removeLine(index)}
                      >
                        <Minus className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot className="border-t bg-gray-50 font-medium">
            <tr>
              <td colSpan={2} className="p-3">Total</td>
              <td className="p-3">{totals.quantity}</td>
              <td />
              <td className="p-3 text-right">Rs. {totals.discount.toFixed(2)}</td>
              <td className="p-3 text-right">Rs. {totals.tax.toFixed(2)}</td>
              <td className="p-3 text-right">Rs. {totals.total.toFixed(2)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

type Product = {
  id: string;
  name?: string;
  classification?: "GOODS" | "SERVICES";
  salePrice?: number;
  unit?: string;
  hsnSacCode?: string;
  gstRate?: number;
};

function ProductPicker({
  value,
  products,
  loading,
  onSelect,
}: {
  value: string;
  products: Product[];
  loading: boolean;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = products.find((product) => product.id === value);
  const matches = products.filter((product) =>
    `${product.name ?? ""} ${product.unit ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className="h-10 min-w-0 w-full justify-between font-normal">
          <span className="min-w-0 flex-1 truncate text-left">
            {selected?.name ?? (loading ? "Loading products..." : "Search or select product")}
          </span>
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] p-2">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.stopPropagation()}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>

        <div className="max-h-56 overflow-y-auto">
          {matches.length ? (
            matches.map((product) => (
              <DropdownMenuItem
                key={product.id}
                onSelect={() => {
                  onSelect(product.id);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex-col items-start gap-0.5"
              >
                <span className="font-medium">{product.name ?? "Unnamed product"}</span>
                <span className="text-xs text-muted-foreground">
                  {[product.unit, product.salePrice != null ? `Rs. ${product.salePrice}` : ""]
                    .filter(Boolean)
                    .join(" / ")}
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-muted-foreground">No products found.</p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}