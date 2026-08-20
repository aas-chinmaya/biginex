

"use client";

import { useState, useEffect } from "react";
import type { Invoice } from "../../types/invoice";
import InvoiceActionPanel from "./invoice-action-panel";
import { generateInvoicePDF } from "../../utils/generate-invoice-pdf";

type ShareChannel = "sms" | "email" | "whatsapp";

interface ViewInvoiceProps {
  invoice: Invoice | null;
}

export default function InvoiceView({ invoice: inv }: ViewInvoiceProps) {
  const [channels, setChannels] = useState<ShareChannel[]>(["sms"]);
  const [sending, setSending] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [copyType, setCopyType] = useState<"ORIGINAL" | "DUPLICATE" | "BOTH">("ORIGINAL");
  const [theme, setTheme] = useState<"mono" | "ocean" | "emerald" | "violet" | "rose">("mono");
  // Generate PDF as soon as invoice is available
  useEffect(() => {
    if (!inv) return;

    setLoadingPdf(true);

    const invoiceType = inv.invoiceType ?? "B2B";
    const invoiceStatus = formatInvoiceStatus(inv.invoiceStatus);

    const customerName = inv.buyerName ?? inv.buyerCompanyName ?? "Customer";
    const contactName =
      inv.buyerCompanyName && inv.buyerCompanyName !== customerName
        ? inv.buyerCompanyName
        : null;

    const customerEmail = inv.buyerEmail ?? null;
    const customerPhone = inv.buyerPhone ?? null;
    const customerGstin = inv.buyerGSTIN ?? null;

    const billingAddress = [
      inv.billingAddressLine1,
      inv.billingAddressLine2,
      inv.billingCity,
      inv.billingState,
      inv.billingPincode,
      inv.billingCountry,
    ]
      .filter(Boolean)
      .join(", ");

    const sellerName = inv.sellerTradeName ?? inv.sellerLegalName ?? "Seller";
    const sellerAddress = [
      inv.sellerAddressLine1,
      inv.sellerAddressLine2,
      inv.sellerCity,
      inv.sellerState,
      inv.sellerPincode,
      inv.sellerCountry,
    ]
      .filter(Boolean)
      .join(", ");

    const subtotalAmount = Number(inv.taxableAmount ?? 0);
    const taxAmountTotal =
      Number(inv.cgstAmount ?? 0) +
      Number(inv.sgstAmount ?? 0) +
      Number(inv.igstAmount ?? 0) +
      Number(inv.cessAmount ?? 0);

    try {
      const blob = generateInvoicePDF({
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
        copyType,
        theme,
      });

      const url = URL.createObjectURL(blob);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setLoadingPdf(false);
    }

    // Cleanup
    return () => {
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [inv, copyType, theme]);

  if (!inv) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Invoice not found.
      </div>
    );
  }

  const invoiceType = inv.invoiceType ?? "Sales Invoice";
  const invoiceStatus = formatInvoiceStatus(inv.invoiceStatus);
  const customerEmail = inv.buyerEmail ?? null;
  const customerPhone = inv.buyerPhone ?? null;

  const shareText = `Invoice ${inv.invoiceNumber} — ${inv.currency ?? "INR"} ${Number(
    inv.grandTotal ?? 0
  ).toLocaleString()} for ${inv.buyerName ?? inv.buyerCompanyName ?? "Customer"}.`;

  const toggleChannel = (ch: ShareChannel) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSend = async () => {
    if (channels.length === 0) return;
    setSending(true);
    try {
      if (channels.includes("whatsapp")) {
        const phone = customerPhone?.replace(/\D/g, "") ?? "";
        window.open(
          `https://wa.me/${phone}?text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      }
      if (channels.includes("sms")) {
        const phone = customerPhone?.replace(/\D/g, "") ?? "";
        window.open(
          `sms:${phone}?body=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      }
      if (channels.includes("email")) {
        const subject = `Invoice ${inv.invoiceNumber}`;
        window.open(
          `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      }
    } finally {
      setSending(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `Invoice-${inv.invoiceNumber || "draft"}.pdf`;
    a.click();
  };

  const handlePrintPdf = () => {
    if (!pdfUrl) return;
    const frame = document.createElement("iframe");
    frame.src = pdfUrl;
    frame.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden";
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      window.setTimeout(() => frame.remove(), 1000);
    };
    document.body.appendChild(frame);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="py-8 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 max-w-7xl mx-auto items-start">
        
        {/* PDF Preview (directly shown in UI) */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm min-h-[800px]">
          {loadingPdf ? (
            <div className="flex h-[800px] items-center justify-center text-gray-400">
              Generating PDF...
            </div>
          ) : pdfUrl ? (
            <iframe
              // src={pdfUrl}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-[900px]"
              title="Invoice PDF"
            />
          ) : (
            <div className="flex h-[800px] items-center justify-center text-gray-400">
              Failed to generate PDF
            </div>
          )}
        </div>

        <InvoiceActionPanel
          channels={channels}
          toggleChannel={toggleChannel}
          handleSend={handleSend}
          sending={sending}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          invoiceStatus={invoiceStatus}
          invoiceType={invoiceType}
          onDownloadPdf={handleDownloadPdf}
          onPrintPdf={handlePrintPdf}
          copyType={copyType}
          onCopyTypeChange={setCopyType}
          theme={theme}
          onThemeChange={setTheme}
        />
      </div>
    </div>
  );
}

function formatInvoiceStatus(status: string | null | undefined) {
  if (!status) return "Draft";
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

