// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import {
//   Eye,
//   Pencil,
//   Trash2,
// } from "lucide-react";

// import { Button } from "@/components/ui";

// import InvoiceDeleteModal from "./invoice-delete";

// type InvoiceActionsProps = {
//   id: string;
//   invoiceNumber?: string;
//   status?: string | null;
//   isDraft?: boolean;
// };

// export default function InvoiceActions({
//   id,
//   invoiceNumber,
//   status,
//   isDraft = false,
// }: InvoiceActionsProps) {
//   const router = useRouter();

//   const [isDeleteOpen, setIsDeleteOpen] =
//     useState(false);

//   return (
//     <>
//       <div className="flex items-center justify-end gap-1">
//         {isDraft ? (
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             aria-label="Edit draft"
//             title="Edit draft"
//             onClick={() =>
//               router.push(
//                 `/sales/invoice/${id}/edit`
//               )
//             }
//             className="hover:bg-blue-50 hover:text-blue-600"
//           >
//             <Pencil className="size-4" />
//           </Button>
//         ) : (
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             aria-label="View invoice"
//             title="View invoice"
//             onClick={() =>
//               router.push(
//                 `/sales/invoice/${id}`
//               )
//             }
//             className="hover:bg-violet-50 hover:text-violet-600"
//           >
//             <Eye className="size-4" />
//           </Button>
//         )}

//         <Button
//           type="button"
//           variant="ghost"
//           size="icon"
//           aria-label={
//             isDraft
//               ? "Delete draft"
//               : "Cancel invoice"
//           }
//           title={
//             isDraft
//               ? "Delete draft"
//               : "Cancel invoice"
//           }
//           onClick={() =>
//             setIsDeleteOpen(true)
//           }
//           className="hover:bg-red-50 hover:text-red-600"
//         >
//           <Trash2 className="size-4" />
//         </Button>
//       </div>

//       <InvoiceDeleteModal
//         open={isDeleteOpen}
//         onOpenChange={setIsDeleteOpen}
//         invoiceId={id}
//         invoiceNumber={invoiceNumber}
//         isDraft={isDraft}
//       />
//     </>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui";

import InvoiceDeleteModal from "./invoice-delete";

type InvoiceActionsProps = {
  id: string;
  invoiceNumber?: string;
  status?: string | null;
  isDraft?: boolean;
};

export default function InvoiceActions({
  id,
  invoiceNumber,
  status,
  isDraft = false,
}: InvoiceActionsProps) {
  const router = useRouter();

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {isDraft ? (
          <>
            {/* EDIT DRAFT */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Edit draft"
              title="Edit draft"
              onClick={() =>
                router.push(
                  `/sales/invoice/${id}/edit`
                )
              }
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil className="size-4" />
            </Button>

            {/* DELETE DRAFT */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Delete draft"
              title="Delete draft"
              onClick={() =>
                setIsDeleteOpen(true)
              }
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        ) : (
          /* VIEW INVOICE */
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="View invoice"
            title="View invoice"
            onClick={() =>
              router.push(
                `/sales/invoice/${id}`
              )
            }
            className="hover:bg-violet-50 hover:text-violet-600"
          >
            <Eye className="size-4" />
          </Button>
        )}
      </div>

      {isDraft && (
        <InvoiceDeleteModal
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          invoiceId={id}
          invoiceNumber={invoiceNumber}
          isDraft={isDraft}
        />
      )}
    </>
  );
}