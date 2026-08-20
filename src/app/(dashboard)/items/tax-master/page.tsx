"use client";

import { useMemo } from "react";
import AddTaxMasterButton from "@/modules/items/components/masters/tax-master/AddTaxMasterButton";
import TaxMasterMasterTable from "@/modules/items/components/masters/tax-master/TaxMasterMasterTable";
import { useTaxMasters } from "@/modules/items/hooks/useTaxMasters";

export default function TaxMasterPage() {
  const { taxMasters, loading, page, totalPages, totalRecords, refetch, setPage } = useTaxMasters();

  const pageTitle = useMemo(() => "Tax Master", []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-500">Manage GST tax master records used across items and billing workflows.</p>
        </div>

        <div>
          <AddTaxMasterButton />
        </div>
      </div>

      <TaxMasterMasterTable
        taxMasters={taxMasters}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          refetch(nextPage);
        }}
        onRefresh={() => refetch(page)}
      />
    </div>
  );
}
