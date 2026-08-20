

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice, InvoiceLineItem } from "../types/invoice";

export type InvoiceCopyMode = "ORIGINAL" | "DUPLICATE" | "BOTH";
export type InvoiceTheme = "mono" | "ocean" | "emerald" | "violet" | "rose";

interface GeneratePdfOptions {
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
  copyType?: InvoiceCopyMode;
  theme?: InvoiceTheme;
}

type Palette = { primary: [number, number, number]; soft: [number, number, number] };

const PALETTES: Record<InvoiceTheme, Palette> = {
  mono: { primary: [28, 28, 28], soft: [245, 245, 245] },
  ocean: { primary: [14, 116, 144], soft: [236, 252, 255] },
  emerald: { primary: [5, 122, 85], soft: [236, 253, 245] },
  violet: { primary: [109, 40, 217], soft: [245, 243, 255] },
  rose: { primary: [190, 24, 93], soft: [253, 242, 248] },
};

const PAGE = { margin: 12, footerHeight: 18 };

export function generateInvoicePDF(options: GeneratePdfOptions): Blob {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pages =
    options.copyType === "BOTH"
      ? (["ORIGINAL", "DUPLICATE"] as const)
      : ([options.copyType ?? "ORIGINAL"] as const);

  pages.forEach((copy, index) => {
    if (index) doc.addPage();
    drawInvoicePage(doc, options, copy);
  });

  return doc.output("blob");
}

// -----------------------------------------------------------
// Page layout helpers
// -----------------------------------------------------------

/** Adds a new page and returns the reset y-cursor if `needed` mm won't fit before the footer. */
function ensureSpace(doc: jsPDF, y: number, needed: number, pageHeight: number): number {
  if (y + needed > pageHeight - PAGE.footerHeight - 4) {
    doc.addPage();
    return 22;
  }
  return y;
}

function drawInvoicePage(doc: jsPDF, options: GeneratePdfOptions, copy: "ORIGINAL" | "DUPLICATE") {
  const {
    inv,
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
  } = options;
console.log(inv, "inv");
  const palette = PALETTES[options.theme ?? "mono"];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PAGE.margin;
  const contentWidth = pageWidth - margin * 2;
  const currency = inv.currency ?? "INR";
  const label = copy === "ORIGINAL" ? "ORIGINAL FOR RECIPIENT" : "DUPLICATE FOR SUPPLIER";

  // Background + title bar
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFillColor(...palette.primary);
  doc.roundedRect(margin, 10, contentWidth, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TAX INVOICE", margin + 4, 16.4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(label, pageWidth - margin - 4, 16.2, { align: "right" });

  // Seller name / address block (left)
  const metaWidth = 58;
  const metaX = pageWidth - margin - metaWidth;
  const sellerBlockWidth = metaX - margin - 6;

  doc.setTextColor(32, 32, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(sellerName || "Your business", margin, 31);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(90, 90, 90);
  const sellerAddrLines = doc.splitTextToSize(sellerAddress || "Business address", sellerBlockWidth);
  doc.text(sellerAddrLines, margin, 37.5);

  let sellerY = 37.5 + sellerAddrLines.length * 3.6;
  if (inv.sellerEmail || inv.sellerPhone) {
    const contact = [inv.sellerEmail, inv.sellerPhone].filter(Boolean).join("  ·  ");
    doc.text(contact, margin, sellerY);
    sellerY += 4;
  }
  if (inv.sellerGSTIN) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${inv.sellerGSTIN}`, margin, sellerY);
  }

  // Invoice meta box (right) — height grows if dueDate/reference present
  const metaRows: [string, string][] = [
    ["Invoice date", formatDate(inv.invoiceDate)],
    ["Invoice type", options.invoiceType],
    ["Status", options.invoiceStatus],
  ];
  if (inv.dueDate) metaRows.push(["Due date", formatDate(inv.dueDate)]);
  if (inv.referenceNumber) metaRows.push(["Reference", inv.referenceNumber]);

  const metaBoxHeight = 14 + metaRows.length * 6;
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(metaX, 25, metaWidth, metaBoxHeight, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...palette.primary);
  doc.setFontSize(8);
  doc.text(inv.invoiceNumber ?? "DRAFT", metaX + 4, 32);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 75, 75);
  doc.setFontSize(7);
  metaRows.forEach(([k, v], i) => drawKeyValue(doc, k, v, metaX + 4, 39 + i * 6, metaWidth - 8));

  // Party boxes — height computed from actual wrapped text, not a fixed guess
  const boxY = Math.max(sellerY + 8, 25 + metaBoxHeight + 6, 68);
  const half = (contentWidth - 4) / 2;

  const sellerBoxH = measurePartyBoxHeight(doc, sellerAddress, half, Boolean(inv.sellerGSTIN));
  const buyerBody = [contactName, billingAddress, customerEmail, customerPhone].filter(Boolean).join("\n");
  const buyerBoxH = measurePartyBoxHeight(doc, buyerBody, half, Boolean(customerGstin));
  const partyBoxHeight = Math.max(sellerBoxH, buyerBoxH, 30);

  drawPartyBox(doc, margin, boxY, half, partyBoxHeight, "BILLED BY", sellerName || "Your business", sellerAddress, inv.sellerGSTIN, palette);
  drawPartyBox(doc, margin + half + 4, boxY, half, partyBoxHeight, "BILLED TO", customerName, buyerBody, customerGstin, palette);

  // Items table
  const items = inv.items ?? [];
  autoTable(doc, {
    startY: boxY + partyBoxHeight + 8,
    margin: { left: margin, right: margin },
    head: [["Item name & description", "HSN/SAC", "GST rate", "Qty", "Rate", "Amount"]],
    body: items.map((item) => [
      [itemLabel(item), item.description ?? ""].filter(Boolean).join("\n"),
      item.hsnSacCode ?? "—",
      `${Number(item.gstRate ?? 0)}%`,
      `${Number(item.quantity ?? 0)} ${item.unit ?? ""}`.trim(),
      money(item.unitPrice, currency),
      money(item.lineTotal, currency),
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 7.2,
      cellPadding: 2.6,
      lineColor: [228, 228, 228],
      lineWidth: 0.15,
      textColor: [55, 55, 55],
    },
    headStyles: { fillColor: palette.primary, textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
    alternateRowStyles: { fillColor: palette.soft },
    columnStyles: {
      0: { cellWidth: contentWidth - (20 + 18 + 20 + 28 + 32) },
      1: { cellWidth: 20 },
      2: { cellWidth: 18, halign: "center" },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 28, halign: "right" },
      5: { cellWidth: 32, halign: "right", fontStyle: "bold" },
    },
  });

  // @ts-expect-error jspdf-autotable augments jsPDF at runtime.
  let y = (doc.lastAutoTable?.finalY ?? boxY + partyBoxHeight + 8) + 8;

  const leftWidth = 112;
  const rightX = margin + leftWidth + 5;
  const rightWidth = contentWidth - leftWidth - 5;

  // Height depends on how many payment fields and total rows actually exist
  const paymentLines = paymentDetailRows(inv).length;
  const totalLines = totalsRows(inv, subtotalAmount, taxAmountTotal).length;
  const bottomBlockHeight = Math.max(16 + paymentLines * 6, 16 + totalLines * 6 + 14) + 4;

  y = ensureSpace(doc, y, bottomBlockHeight, pageHeight);

  drawPaymentBox(doc, margin, y, leftWidth, bottomBlockHeight, inv, palette);
  drawTotals(doc, rightX, y, rightWidth, bottomBlockHeight, inv, subtotalAmount, taxAmountTotal, currency, palette);
  y += bottomBlockHeight + 6;

  drawNotes(doc, margin, y, contentWidth, inv, palette, pageHeight);

  // Footer
  doc.setDrawColor(...palette.primary);
  doc.setLineWidth(0.45);
  doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(115, 115, 115);
  doc.text("This is a computer-generated invoice.", margin, pageHeight - 12);
  doc.text(label, pageWidth - margin, pageHeight - 12, { align: "right" });
}

// -----------------------------------------------------------
// Sub-drawers
// -----------------------------------------------------------

function itemLabel(item: InvoiceLineItem): string {
  return item.itemName ?? item.product ?? item.itemCode ?? "Unnamed item";
}

function measurePartyBoxHeight(doc: jsPDF, body: string, width: number, hasGstin: boolean): number {
  const lines = doc.splitTextToSize(body || "—", width - 6);
  return 16 + lines.length * 3.6 + (hasGstin ? 6 : 0);
}

function drawPartyBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  caption: string,
  name: string,
  body: string,
  gstin: string | null | undefined,
  palette: Palette,
) {
  doc.setFillColor(...palette.soft);
  doc.roundedRect(x, y, width, height, 2, 2, "F");
  doc.setTextColor(...palette.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.text(caption, x + 3, y + 5);
  doc.setTextColor(45, 45, 45);
  doc.setFontSize(8.2);
  doc.text(name || "—", x + 3, y + 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.7);
  doc.setTextColor(90, 90, 90);
  const lines = doc.splitTextToSize(body || "—", width - 6);
  doc.text(lines, x + 3, y + 16);
  if (gstin) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN: ${gstin}`, x + 3, y + height - 4);
  }
}

function paymentDetailRows(inv: Invoice): [string, string][] {
  return ([
    ["Payment method", inv.paymentMethod],
    ["Payment status", inv.paymentStatus],
    ["Received account", inv.receivedAccount],
    ["Transaction ID", inv.transactionId],
    ["Payment date", inv.paymentDate ? formatDate(inv.paymentDate) : undefined],
  ] as [string, string | undefined][]).filter((row): row is [string, string] => Boolean(row[1]));
}

function drawPaymentBox(doc: jsPDF, x: number, y: number, width: number, height: number, inv: Invoice, palette: Palette) {
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(x, y, width, height, 2, 2, "S");
  doc.setFillColor(...palette.soft);
  doc.roundedRect(x, y, width, 7, 2, 2, "F");
  doc.rect(x, y + 5, width, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...palette.primary);
  doc.setFontSize(7);
  doc.text("BANK AND PAYMENT DETAILS", x + 3, y + 4.6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(85, 85, 85);
  doc.setFontSize(7);

  const rows = paymentDetailRows(inv);
  if (rows.length === 0) {
    doc.setTextColor(150, 150, 150);
    doc.text("No payment recorded yet.", x + 3, y + 14);
    return;
  }
  rows.forEach(([key, value], index) => drawKeyValue(doc, key, value, x + 3, y + 13 + index * 6, width - 6));
}

function totalsRows(inv: Invoice, subtotal: number, tax: number): [string, string][] {
  const currency = inv.currency ?? "INR";
  const rows: [string, string][] = [["Subtotal", money(subtotal, currency)]];

  if (Number(inv.discountAmount ?? 0) > 0) {
    rows.push(["Discount", `− ${money(inv.discountAmount, currency)}`]);
  }
  rows.push(["Taxable amount", money(inv.taxableAmount ?? subtotal, currency)]);

  // Show CGST/SGST/IGST individually so the buyer can see the real tax
  // split instead of a single opaque "GST" figure.
  if (Number(inv.cgstAmount ?? 0) > 0) rows.push(["CGST", money(inv.cgstAmount, currency)]);
  if (Number(inv.sgstAmount ?? 0) > 0) rows.push(["SGST", money(inv.sgstAmount, currency)]);
  if (Number(inv.igstAmount ?? 0) > 0) rows.push(["IGST", money(inv.igstAmount, currency)]);
  if (Number(inv.cessAmount ?? 0) > 0) rows.push(["Cess", money(inv.cessAmount, currency)]);
  if (rows.length === 1 && tax > 0) rows.push(["GST", money(tax, currency)]);

  if (Number(inv.roundOffAmount ?? 0) !== 0) {
    rows.push(["Round off", money(inv.roundOffAmount, currency)]);
  }

  return rows;
}

function drawTotals(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  inv: Invoice,
  subtotal: number,
  tax: number,
  currency: string,
  palette: Palette,
) {
  const rows = totalsRows(inv, subtotal, tax);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.3);
  rows.forEach(([label, value], index) => drawKeyValue(doc, label, value, x, y + 5 + index * 6, width));

  const grandY = y + 5 + rows.length * 6 + 3;
  doc.setFillColor(...palette.primary);
  doc.roundedRect(x, grandY, width, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.4);
  doc.text("GRAND TOTAL", x + 3, grandY + 6.2);
  doc.text(money(inv.grandTotal, currency), x + width - 3, grandY + 6.2, { align: "right" });

  const paid = Number(inv.paidAmount ?? 0);
  const pending = Number(inv.pendingAmount ?? Math.max(Number(inv.grandTotal ?? 0) - paid, 0));
  if (paid > 0 || pending > 0) {
    let py = grandY + 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    if (paid > 0) {
      drawKeyValue(doc, "Paid", money(paid, currency), x, py, width);
      py += 5;
    }
    if (pending > 0) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(190, 24, 93);
      doc.text("Balance due", x, py);
      doc.text(money(pending, currency), x + width, py, { align: "right" });
      doc.setTextColor(48, 48, 48);
    }
  }
}

function drawNotes(doc: jsPDF, x: number, y: number, width: number, inv: Invoice, palette: Palette, pageHeight: number) {
  const sections: string[] = [];
  if (inv.termsAndConditions) sections.push(`Terms & Conditions\n${inv.termsAndConditions}`);
  if (inv.notes) sections.push(`Additional Notes\n${inv.notes}`);
  if (!sections.length) return;

  const paddingX = 3;
  const topPadding = 5;
  const bottomPadding = 4;
  const lineHeight = 3.2;
  const contentWidth = width - paddingX * 2;
  const notesText = sections.join("\n\n");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  const lines = doc.splitTextToSize(notesText, contentWidth);
  const boxHeight = topPadding + lines.length * lineHeight + bottomPadding + 4;

  y = ensureSpace(doc, y, boxHeight, pageHeight);

  doc.setFillColor(...palette.soft);
  doc.roundedRect(x, y, width, boxHeight, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...palette.primary);
  doc.text("TERMS & NOTES", x + paddingX, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(85, 85, 85);
  doc.text(lines, x + paddingX, y + 10, { lineHeightFactor: 1.15 });
}

function drawKeyValue(doc: jsPDF, label: string, value: string, x: number, y: number, width: number) {
  doc.setTextColor(125, 125, 125);
  doc.text(label, x, y);
  doc.setTextColor(48, 48, 48);
  doc.text(value, x + width, y, { align: "right" });
}

function money(value: number | null | undefined, currency: string) {
  return `${currency} ${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}