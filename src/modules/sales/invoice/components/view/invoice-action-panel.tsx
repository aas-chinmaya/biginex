


"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type ShareChannel = "sms" | "email" | "whatsapp";

interface InvoiceActionPanelProps {
  channels: ShareChannel[];
  toggleChannel: (ch: ShareChannel) => void;
  handleSend: () => Promise<void>;
  sending: boolean;
  customerEmail: string | null;
  customerPhone: string | null;
  invoiceStatus: string;
  invoiceType: string;
  onDownloadPdf: () => void;
  onPrintPdf: () => void;
  copyType: "ORIGINAL" | "DUPLICATE" | "BOTH";
  onCopyTypeChange: (value: "ORIGINAL" | "DUPLICATE" | "BOTH") => void;
  theme: "mono" | "ocean" | "emerald" | "violet" | "rose";
  onThemeChange: (value: "mono" | "ocean" | "emerald" | "violet" | "rose") => void;
}

export default function InvoiceActionPanel({
  channels,
  toggleChannel,
  handleSend,
  sending,
  customerEmail,
  customerPhone,
  invoiceStatus,
  invoiceType,
  onDownloadPdf,
  onPrintPdf,
  copyType,
  onCopyTypeChange,
  theme,
  onThemeChange,
}: InvoiceActionPanelProps) {
  const isOriginal = copyType === "ORIGINAL" || copyType === "BOTH";
  const isDuplicate = copyType === "DUPLICATE" || copyType === "BOTH";

  const handleCopyToggle = (type: "ORIGINAL" | "DUPLICATE", checked: boolean) => {
    if (type === "ORIGINAL") {
      if (checked && isDuplicate) onCopyTypeChange("BOTH");
      else if (checked) onCopyTypeChange("ORIGINAL");
      else if (isDuplicate) onCopyTypeChange("DUPLICATE");
      else onCopyTypeChange("ORIGINAL"); // keep at least one
    } else {
      if (checked && isOriginal) onCopyTypeChange("BOTH");
      else if (checked) onCopyTypeChange("DUPLICATE");
      else if (isOriginal) onCopyTypeChange("ORIGINAL");
      else onCopyTypeChange("ORIGINAL"); // keep at least one
    }
  };

  return (
    <aside className="lg:sticky lg:top-6 space-y-4 print:hidden">
      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={invoiceStatus} />
          <TypeBadge type={invoiceType} />
        </div>
      </div>

      {/* Document actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          Document
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
          onClick={onPrintPdf}
        >
          <PrintIcon />
          Print
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
          onClick={onDownloadPdf}
        >
          <DownloadIcon />
          Download PDF
        </Button>
      </div>

      {/* PDF Layout */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          PDF layout
        </p>

        {/* 2 Checkboxes instead of radio */}
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300">
            <Checkbox
              checked={isOriginal}
              onCheckedChange={(checked) =>
                handleCopyToggle("ORIGINAL", checked === true)
              }
            />
            Original
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300">
            <Checkbox
              checked={isDuplicate}
              onCheckedChange={(checked) =>
                handleCopyToggle("DUPLICATE", checked === true)
              }
            />
            Duplicate
          </label>
        </div>

        {/* Theme - Color boxes */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">Theme</p>
          <div className="flex flex-wrap gap-2">
            <ThemeBox
              value="mono"
              color="bg-gray-800"
              label="Classic"
              selected={theme === "mono"}
              onSelect={onThemeChange}
            />
            <ThemeBox
              value="ocean"
              color="bg-blue-500"
              label="Ocean"
              selected={theme === "ocean"}
              onSelect={onThemeChange}
            />
            <ThemeBox
              value="emerald"
              color="bg-emerald-500"
              label="Emerald"
              selected={theme === "emerald"}
              onSelect={onThemeChange}
            />
            <ThemeBox
              value="violet"
              color="bg-violet-500"
              label="Violet"
              selected={theme === "violet"}
              onSelect={onThemeChange}
            />
            <ThemeBox
              value="rose"
              color="bg-rose-500"
              label="Rose"
              selected={theme === "rose"}
              onSelect={onThemeChange}
            />
          </div>
        </div>
      </div>

      {/* Send via */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Send via
        </p>
        <p className="text-[11px] text-gray-400 -mt-1">
          Select one or more channels
        </p>
        <div className="space-y-1.5">
          <ChannelRow
            label="SMS"
            icon={<SmsIcon />}
            checked={channels.includes("sms")}
            onChange={() => toggleChannel("sms")}
            detail={customerPhone || "No phone"}
          />
          <ChannelRow
            label="Email"
            icon={<EmailIcon />}
            checked={channels.includes("email")}
            onChange={() => toggleChannel("email")}
            detail={customerEmail || "No email"}
          />
          <ChannelRow
            label="WhatsApp"
            icon={<WhatsAppIcon />}
            checked={channels.includes("whatsapp")}
            onChange={() => toggleChannel("whatsapp")}
            detail={customerPhone || "No phone"}
          />
        </div>
        <Button
          type="button"
          disabled={channels.length === 0 || sending}
          onClick={handleSend}
          className="w-full mt-2 "
        >
          {sending
            ? "Sending…"
            : channels.length === 0
              ? "Select a channel"
              : `Send via ${channels.map((c) => c.toUpperCase()).join(" + ")}`}
        </Button>
      </div>
    </aside>
  );
}

/* ---------- Theme Color Box ---------- */
function ThemeBox({
  value,
  color,
  label,
  selected,
  onSelect,
}: {
  value: "mono" | "ocean" | "emerald" | "violet" | "rose";
  color: string;
  label: string;
  selected: boolean;
  onSelect: (value: "mono" | "ocean" | "emerald" | "violet" | "rose") => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all ${
        selected
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className={`h-6 w-6 rounded-full ${color}`} />
      <span className="text-[10px] font-medium text-gray-600">{label}</span>
    </button>
  );
}

/* ---------- Rest of helpers (unchanged) ---------- */
function ChannelRow({
  label,
  icon,
  checked,
  onChange,
  detail,
}: {
  label: string;
  icon: ReactNode;
  checked: boolean;
  onChange: () => void;
  detail: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
        checked
          ? "border-blue-200 bg-blue-50/60"
          : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-gray-500">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-[11px] text-gray-400 truncate">{detail}</div>
      </div>
    </label>
  );
}

function PrintIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M3.5 5V2h8v3M3 5h9a2 2 0 012 2v4H3V7a2 2 0 012-2zM3.5 11H3v2h9v-2h-.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="8" r=".75" fill="currentColor" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M7.5 2v8M5 8l2.5 2.5L10 8M2.5 11.5v1a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SmsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
    Sent: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
    Paid: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    "Partially Paid": { bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-400" },
    Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
    Overdue: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    Cancelled: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
    Void: { bg: "bg-gray-100", text: "text-gray-400", dot: "bg-gray-300" },
    Unpaid: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  };

  const cfg = statusConfig[status] ?? statusConfig["Draft"];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const typeConfig: Record<string, string> = {
    "B2B": "text-blue-700 bg-blue-50",
    "B2C": "text-purple-700 bg-purple-50",
    "Export": "text-teal-700 bg-teal-50",
    "SEG": "text-indigo-700 bg-indigo-50",
 
  };

  const cls = typeConfig[type] ?? "text-gray-600 bg-gray-100";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {type}
    </span>
  );
}