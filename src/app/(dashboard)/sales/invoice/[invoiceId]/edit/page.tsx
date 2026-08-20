
import EditInvoiceWrapper from "@/modules/sales/invoice/components/forms/EditInvoiceWrapper";

type Props = {
  params: Promise<{
    invoiceId: string;
  }>;
};

export default async function EditInvoicePage({
  params,
}: Props) {
  const { invoiceId } = await params;

  return (
    <EditInvoiceWrapper
      invoiceId={invoiceId}
    />
  );
}