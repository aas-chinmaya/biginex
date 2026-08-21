



import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type InvoiceCopyMode = "ORIGINAL" | "DUPLICATE" | "BOTH";
export type InvoiceTheme = "mono" | "ocean" | "emerald" | "violet" | "rose";

/** Minimal shape — no external types file needed */
interface InvoiceLineItem {
  itemName?: string | null;
  product?: string | null;
  itemCode?: string | null;
  description?: string | null;
  hsnSacCode?: string | null;
  gstRate?: number | string | null;
  quantity?: number | string | null;
  unit?: string | null;
  unitPrice?: number | string | null;
  lineTotal?: number | string | null;
}

interface Invoice {
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  dueDate?: string | null;
  currency?: string | null;
  sellerEmail?: string | null;
  sellerPhone?: string | null;
  sellerGSTIN?: string | null;
  taxableAmount?: number | string | null;
  discountAmount?: number | string | null;
  cgstAmount?: number | string | null;
  sgstAmount?: number | string | null;
  igstAmount?: number | string | null;
  cessAmount?: number | string | null;
  roundOffAmount?: number | string | null;
  grandTotal?: number | string | null;
  termsAndConditions?: string | null;
  notes?: string | null;
  items?: InvoiceLineItem[] | null;
}

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

  const palette = PALETTES[options.theme ?? "mono"];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PAGE.margin;
  const contentWidth = pageWidth - margin * 2;
  const currency = inv.currency ?? "INR";
  const label = copy === "ORIGINAL" ? "ORIGINAL FOR RECIPIENT" : "DUPLICATE FOR SUPPLIER";

  // White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Title bar
  doc.setFillColor(...palette.primary);
  doc.roundedRect(margin, 10, contentWidth, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TAX INVOICE", margin + 4, 16.4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(label, pageWidth - margin - 4, 16.2, { align: "right" });

  // ---- Seller block (left) ----
  const metaWidth = 52;
  const metaX = pageWidth - margin - metaWidth;
  const sellerBlockWidth = metaX - margin - 8;

  doc.setTextColor(28, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(sellerName || "Your business", margin, 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(90, 90, 90);
  const sellerAddrLines = doc.splitTextToSize(sellerAddress || "Business address", sellerBlockWidth);
  doc.text(sellerAddrLines, margin, 36);

  let sellerY = 36 + sellerAddrLines.length * 3.5;
  if (inv.sellerEmail || inv.sellerPhone) {
    const contact = [inv.sellerEmail, inv.sellerPhone].filter(Boolean).join("  ·  ");
    doc.text(contact, margin, sellerY);
    sellerY += 3.8;
  }
  if (inv.sellerGSTIN) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(45, 45, 45);
    doc.text(`GSTIN: ${inv.sellerGSTIN}`, margin, sellerY);
    sellerY += 3.8;
  }

  // ---- Meta box (right) — only INV number + date ----
  const metaRows: [string, string][] = [["Invoice date", formatDate(inv.invoiceDate)]];
  if (inv.dueDate) metaRows.push(["Due date", formatDate(inv.dueDate)]);

  const metaBoxHeight = 12 + metaRows.length * 6;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(metaX, 24, metaWidth, metaBoxHeight, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...palette.primary);
  doc.setFontSize(9);
  doc.text(inv.invoiceNumber ?? "DRAFT", metaX + 3.5, 30.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  metaRows.forEach(([k, v], i) => {
    drawKeyValue(doc, k, v, metaX + 3.5, 37 + i * 6, metaWidth - 7);
  });

  // ---- Party boxes ----
  const boxY = Math.max(sellerY + 7, 24 + metaBoxHeight + 6, 62);
  const half = (contentWidth - 4) / 2;

  const sellerBoxH = measurePartyBoxHeight(doc, sellerAddress, half, Boolean(inv.sellerGSTIN));
  const buyerBody = [contactName, billingAddress, customerEmail, customerPhone].filter(Boolean).join("\n");
  const buyerBoxH = measurePartyBoxHeight(doc, buyerBody, half, Boolean(customerGstin));
  const partyBoxHeight = Math.max(sellerBoxH, buyerBoxH, 28);

  drawPartyBox(doc, margin, boxY, half, partyBoxHeight, "BILLED BY", sellerName || "Your business", sellerAddress, inv.sellerGSTIN, palette);
  drawPartyBox(doc, margin + half + 4, boxY, half, partyBoxHeight, "BILLED TO", customerName, buyerBody, customerGstin, palette);

  // ---- Items table ----
  const items = inv.items ?? [];
  autoTable(doc, {
    startY: boxY + partyBoxHeight + 7,
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
      cellPadding: 2.5,
      lineColor: [230, 230, 230],
      lineWidth: 0.12,
      textColor: [50, 50, 50],
    },
    headStyles: {
      fillColor: palette.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 7,
    },
    alternateRowStyles: { fillColor: palette.soft },
    columnStyles: {
      0: { cellWidth: contentWidth - (20 + 18 + 20 + 28 + 32), halign: "left" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 18, halign: "center" },
      3: { cellWidth: 20, halign: "right" },
      4: { cellWidth: 28, halign: "right" },
      5: { cellWidth: 32, halign: "right", fontStyle: "bold" },
    },
  });

  // @ts-expect-error jspdf-autotable augments jsPDF at runtime
  let y = (doc.lastAutoTable?.finalY ?? boxY + partyBoxHeight + 7) + 7;

  // ---- Totals (right, no bank box) ----
  const totalLines = totalsRows(inv, subtotalAmount, taxAmountTotal).length;
  const totalsBlockHeight = 10 + totalLines * 5.5 + 14;
  const totalsWidth = 68;
  const totalsX = pageWidth - margin - totalsWidth;

  y = ensureSpace(doc, y, totalsBlockHeight, pageHeight);
  drawTotals(doc, totalsX, y, totalsWidth, inv, subtotalAmount, taxAmountTotal, currency, palette);
  y += totalsBlockHeight + 6;

  // ---- Bottom: Terms (left) + Signature (right) ----
  const bottomGap = 4;
  const termsWidth = contentWidth - totalsWidth - bottomGap;
  const termsHeight = measureTermsHeight(doc, inv, termsWidth);
  const sigHeight = 30;
  const bottomHeight = Math.max(termsHeight || sigHeight, sigHeight);

  y = ensureSpace(doc, y, bottomHeight + 2, pageHeight);

  if (inv.termsAndConditions || inv.notes) {
    drawTermsBox(doc, margin, y, termsWidth, bottomHeight, inv, palette);
  }
  drawSignatureBox(doc, totalsX, y, totalsWidth, bottomHeight, sellerName || "Your business", palette);

  // Footer
  doc.setDrawColor(...palette.primary);
  doc.setLineWidth(0.4);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  doc.text("This is a computer-generated invoice.", margin, pageHeight - 11);
  doc.text(label, pageWidth - margin, pageHeight - 11, { align: "right" });
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function itemLabel(item: InvoiceLineItem): string {
  return item.itemName ?? item.product ?? item.itemCode ?? "Unnamed item";
}

function measurePartyBoxHeight(doc: jsPDF, body: string, width: number, hasGstin: boolean): number {
  const lines = doc.splitTextToSize(body || "—", width - 6);
  return 15 + lines.length * 3.4 + (hasGstin ? 5 : 0);
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
  doc.setFontSize(6.5);
  doc.text(caption, x + 3, y + 4.5);

  doc.setTextColor(35, 35, 35);
  doc.setFontSize(8);
  doc.text(name || "—", x + 3, y + 10.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(95, 95, 95);
  const lines = doc.splitTextToSize(body || "—", width - 6);
  doc.text(lines, x + 3, y + 15.5);

  if (gstin) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(45, 45, 45);
    doc.text(`GSTIN: ${gstin}`, x + 3, y + height - 3.5);
  }
}

function totalsRows(inv: Invoice, subtotal: number, tax: number): [string, string][] {
  const currency = inv.currency ?? "INR";
  const rows: [string, string][] = [["Subtotal", money(subtotal, currency)]];

  if (Number(inv.discountAmount ?? 0) > 0) {
    rows.push(["Discount", `− ${money(inv.discountAmount, currency)}`]);
  }
  rows.push(["Taxable amount", money(inv.taxableAmount ?? subtotal, currency)]);

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
  inv: Invoice,
  subtotal: number,
  tax: number,
  currency: string,
  palette: Palette,
) {
  const rows = totalsRows(inv, subtotal, tax);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  rows.forEach(([label, value], index) => {
    drawKeyValue(doc, label, value, x, y + 4 + index * 5.5, width);
  });

  const grandY = y + 4 + rows.length * 5.5 + 3;
  doc.setFillColor(...palette.primary);
  doc.roundedRect(x, grandY, width, 9.5, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("GRAND TOTAL", x + 3, grandY + 6);
  doc.text(money(inv.grandTotal, currency), x + width - 3, grandY + 6, { align: "right" });
}

function measureTermsHeight(doc: jsPDF, inv: Invoice, width: number): number {
  const sections: string[] = [];
  if (inv.termsAndConditions) sections.push(inv.termsAndConditions);
  if (inv.notes) sections.push(inv.notes);
  if (!sections.length) return 0;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  const lines = doc.splitTextToSize(sections.join("\n\n"), width - 6);
  return 11 + lines.length * 3.1 + 5;
}

function drawTermsBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  inv: Invoice,
  palette: Palette,
) {
  const sections: string[] = [];
  if (inv.termsAndConditions) sections.push(inv.termsAndConditions);
  if (inv.notes) sections.push(inv.notes);
  if (!sections.length) return;

  doc.setFillColor(...palette.soft);
  doc.roundedRect(x, y, width, height, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...palette.primary);
  doc.text("TERMS & CONDITIONS", x + 3, y + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  doc.setTextColor(80, 80, 80);
  const lines = doc.splitTextToSize(sections.join("\n\n"), width - 6);
  doc.text(lines, x + 3, y + 10, { lineHeightFactor: 1.15 });
}

function drawSignatureBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  sellerName: string,
  palette: Palette,
) {
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, width, height, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...palette.primary);
  const forLines = doc.splitTextToSize(`For ${sellerName}`, width - 8);
  doc.text(forLines, x + width / 2, y + 5.5, { align: "center" });

  const lineY = y + height - 11;
  doc.setDrawColor(190, 190, 190);
  doc.setLineWidth(0.3);
  doc.line(x + 10, lineY, x + width - 10, lineY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(110, 110, 110);
  doc.text("Authorized Signatory", x + width / 2, y + height - 4.5, { align: "center" });
}

function drawKeyValue(doc: jsPDF, label: string, value: string, x: number, y: number, width: number) {
  doc.setTextColor(130, 130, 130);
  doc.text(label, x, y);
  doc.setTextColor(40, 40, 40);
  doc.text(value, x + width, y, { align: "right" });
}

function money(value: number | string | null | undefined, currency: string) {
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




