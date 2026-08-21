
import type { Invoice } from "../../types/invoice";

interface InvoiceDocumentProps {
  inv: Invoice;
  invoiceType: string;
  invoiceStatus: string;

  customerName: string;
  contactName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  customerGstin: string | null;

  billingAddress: string;

  sellerName: string;
  sellerAddress: string;

  subtotalAmount: number;
  taxAmountTotal: number;
}

export default function InvoiceDocument({
  inv,
  invoiceType,
  invoiceStatus,
  customerName,
  contactName,
  customerEmail,
  customerPhone,
  customerGstin,
  billingAddress,
  sellerName,
  sellerAddress,
  subtotalAmount,
  taxAmountTotal,
}: InvoiceDocumentProps) {
  
  const currency = inv.currency ?? "INR";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-[#0F1629] px-10 py-8">
        <div className="flex items-start justify-between gap-8">
          {/* Seller */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Bill From
            </p>

            <h1 className="text-xl font-bold text-white">
              {sellerName}
            </h1>

            {sellerAddress && (
              <p className="mt-2 max-w-sm text-xs leading-5 text-white/50">
                {sellerAddress}
              </p>
            )}

            {(inv.sellerEmail || inv.sellerPhone) && (
              <div className="mt-2 space-y-0.5 text-xs text-white/50">
                {inv.sellerEmail && (
                  <p>{inv.sellerEmail}</p>
                )}

                {inv.sellerPhone && (
                  <p>{inv.sellerPhone}</p>
                )}
              </div>
            )}

            {inv.sellerGSTIN && (
              <p className="mt-2 font-mono text-xs text-white/50">
                GSTIN: {inv.sellerGSTIN}
              </p>
            )}
          </div>

          {/* Invoice information */}
          <div className="text-right">
            <div className="mb-1 text-xs uppercase tracking-widest text-white/30">
              {invoiceType}
            </div>

            <div className="font-mono text-3xl font-bold tracking-tight text-white">
              {inv.invoiceNumber ?? "—"}
            </div>

            <div className="mt-4 space-y-1.5 text-xs">
              <InvoiceHeaderRow
                label="Date"
                value={formatDate(inv.invoiceDate)}
              />

             
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BUYER + DETAILS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-8 border-b border-gray-100 bg-gray-50/30 px-10 py-7">
        {/* Buyer */}
        <div>
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Bill To
          </p>

          <p className="text-sm font-bold text-[#1A1D2E]">
            {customerName}
          </p>

          {contactName && (
            <p className="mt-0.5 text-xs text-gray-500">
              {contactName}
            </p>
          )}

          {billingAddress && (
            <p className="mt-1.5 text-xs leading-5 text-gray-400">
              {billingAddress}
            </p>
          )}

          {customerEmail && (
            <p className="mt-1 text-xs text-gray-400">
              {customerEmail}
            </p>
          )}

          {customerPhone && (
            <p className="text-xs text-gray-400">
              {customerPhone}
            </p>
          )}

          {customerGstin && (
            <p className="mt-1 font-mono text-xs text-gray-400">
              GSTIN: {customerGstin}
            </p>
          )}
        </div>

        {/* Invoice details */}
        <div>
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Invoice Details
          </p>

          <div className="space-y-1.5">
            <DetailRow
              label="Status"
              value={invoiceStatus}
            />

            <DetailRow
              label="Currency"
              value={currency}
            />

            {inv.financialYear && (
              <DetailRow
                label="Financial Year"
                value={inv.financialYear}
              />
            )}

            {inv.branch && (
              <DetailRow
                label="Branch"
                value={inv.branch}
              />
            )}

            {inv.placeOfSupply && (
              <DetailRow
                label="Place of Supply"
                value={inv.placeOfSupply}
              />
            )}

            {inv.paymentTerms && (
              <DetailRow
                label="Payment Terms"
                value={inv.paymentTerms}
              />
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          ITEMS
      ===================================================== */}

      <div className="px-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                #
              </th>

              <th className="py-3.5 pl-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Product / Service
              </th>

              <th className="py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Qty
              </th>

              <th className="py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Rate
              </th>

              <th className="py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Disc
              </th>

              <th className="py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Tax
              </th>

              <th className="py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {inv.items.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="border-b border-gray-50"
              >
                {/* Number */}
                <td className="py-4 font-mono text-xs text-gray-300">
                  {String(index + 1).padStart(2, "0")}
                </td>

                {/* Product */}
                <td className="py-4 pl-2">
                  <div className="text-sm font-semibold text-[#1A1D2E]">
                    {item.itemName ??
                      item.itemCode ??
                      "Unnamed item"}
                  </div>

                  {item.itemCode && (
                    <div className="mt-1 font-mono text-[10px] text-gray-300">
                      {item.itemCode}
                    </div>
                  )}
                </td>

                {/* Quantity */}
                <td className="py-4 text-right font-mono text-sm text-gray-600">
                  {Number(item.quantity ?? 0)}

                </td>

                {/* Rate */}
                <td className="py-4 text-right font-mono text-sm text-gray-700">
                  {formatAmount(item.unitPrice, currency)}
                </td>

                {/* Discount */}
                <td className="py-4 text-right font-mono text-xs text-gray-400">
                  {formatDiscount(item)}
                </td>

                {/* Tax */}
                <td className="py-4 text-right font-mono text-xs text-gray-400">
                  {item.gstRate != null
                    ? `${item.gstRate}%`
                    : "—"}
                </td>

                {/* Amount */}
                <td className="py-4 text-right font-mono text-sm font-bold text-[#1A1D2E]">
                  {formatAmount(
                    item.lineTotal,
                    currency
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          TOTALS
      ===================================================== */}

      <div className="flex justify-end border-t border-gray-100 bg-gray-50/20 px-10 py-6">
        <div className="w-72 space-y-2">
          <TRow
            label="Taxable Amount"
            value={formatAmount(
              subtotalAmount,
              currency
            )}
          />

          {Number(inv.discountAmount ?? 0) > 0 && (
            <TRow
              label="Discount"
              value={`−${formatAmount(
                inv.discountAmount,
                currency
              )}`}
              green
            />
          )}

          {taxAmountTotal > 0 && (
            <TRow
              label="Tax"
              value={formatAmount(
                taxAmountTotal,
                currency
              )}
            />
          )}

          {Number(inv.roundOffAmount ?? 0) !== 0 && (
            <TRow
              label="Round Off"
              value={formatAmount(
                inv.roundOffAmount,
                currency
              )}
            />
          )}

          {/* Grand total */}
          <div className="mt-2 border-t-2 border-[#0F1629] pt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-[#1A1D2E]">
                Grand Total
              </span>

              <span className="font-mono text-2xl font-bold text-[#0F1629]">
                {formatAmount(
                  inv.grandTotal,
                  currency
                )}
              </span>
            </div>
          </div>

          {/* Paid */}
          {Number(inv.paidAmount ?? 0) > 0 && (
            <div className="flex justify-between pt-1 text-sm">
              <span className="text-gray-400">
                Paid
              </span>

              <span className="font-mono font-semibold text-green-600">
                −
                {formatAmount(
                  inv.paidAmount,
                  currency
                )}
              </span>
            </div>
          )}

          {/* Pending */}
          {Number(inv.pendingAmount ?? 0) > 0 ? (
            <div className="mt-2 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">
              <span className="text-xs font-bold uppercase tracking-wide text-amber-800">
                Due Amount
              </span>

              <span className="font-mono text-lg font-bold text-amber-700">
                {formatAmount(
                  inv.pendingAmount,
                  currency
                )}
              </span>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-3 py-2.5">
              <span className="text-xs font-bold uppercase tracking-wide text-green-700">
                Fully Paid
              </span>

              <span className="text-lg text-green-600">
                ✓
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          NOTES
      ===================================================== */}

      {(inv.notes || inv.termsAndConditions) && (
        <div className="grid grid-cols-2 gap-8 border-t border-gray-100 px-10 py-6">
          {inv.notes && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Note
              </p>

              <p className="text-sm leading-relaxed text-gray-500">
                {inv.notes}
              </p>
            </div>
          )}

          {inv.termsAndConditions && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Terms & Conditions
              </p>

              <p className="text-sm leading-relaxed text-gray-500">
                {inv.termsAndConditions}
              </p>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="flex items-center justify-between bg-[#0F1629] px-10 py-5">
        <p className="text-xs text-white/30">
          Generated by InvoiceFlow ·{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="font-mono text-xs text-white/20">
          {inv.invoiceNumber}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   HEADER ROW
========================================================= */

function InvoiceHeaderRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-end gap-3">
      <span className="text-white/40">
        {label}
      </span>

      <span className="font-mono font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 text-xs">
      <span className="w-28 shrink-0 text-gray-400">
        {label}
      </span>

      <span className="font-medium text-[#1A1D2E]">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   TOTAL ROW
========================================================= */

function TRow({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">
        {label}
      </span>

      <span
        className={`font-mono ${
          green
            ? "text-green-600"
            : "text-[#1A1D2E]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   FORMATTERS
========================================================= */

function formatAmount(
  value: number | null | undefined,
  currency: string
) {
  return `${currency} ${Number(value ?? 0).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatDiscount(item: Invoice["items"][number]) {
  const value = Number(item.discountValue ?? 0);

  if (!value) {
    return "—";
  }

  if (item.discountType === "PERCENTAGE") {
    return `${value}%`;
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}




