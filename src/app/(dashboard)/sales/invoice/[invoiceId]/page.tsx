// "use client";

// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";

// import type { AppDispatch, RootState } from "@/store/store";

// import { fetchInvoiceById } from "@/modules/sales/invoice/slice/invoice.slice";
// import InvoiceView from "@/modules/sales/invoice/components/view/invoice-view";

// export default function InvoiceViewPage() {
//   const params = useParams<{ invoiceId: string }>();
//   const dispatch = useDispatch<AppDispatch>();

//   const { invoice, loading, error } = useSelector(
//     (state: RootState) => state.invoice,
//   );

//   useEffect(() => {
//     if (!params.invoiceId) return;

//     dispatch(fetchInvoiceById(params.invoiceId));
//   }, [dispatch, params.invoiceId]);

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
//         Loading invoice...
//       </div>
//     );
//   }

//   if (error || !invoice) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
//         {error ?? "Invoice not found."}
//       </div>
//     );
//   }

//   return <InvoiceView invoice={invoice} />;
// }




"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useInvoiceQuery } from "@/modules/sales/invoice/hooks/use-invoice-query";

import InvoiceView from "@/modules/sales/invoice/components/view/invoice-view";

export default function InvoiceViewPage() {
  const params = useParams<{ invoiceId: string }>();

  const {
    selectedInvoice,
    loading,
    error,
    getInvoiceById,
  } = useInvoiceQuery();

  useEffect(() => {
    if (!params.invoiceId) return;

    getInvoiceById(params.invoiceId);
  }, [params.invoiceId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        Loading invoice...
      </div>
    );
  }

  if (error || !selectedInvoice) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        {error ?? "Invoice not found."}
      </div>
    );
  }
console.log("selectedInvoice", selectedInvoice);
  return <InvoiceView invoice={selectedInvoice} />;
}