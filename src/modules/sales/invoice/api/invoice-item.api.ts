import api from "@/services/api";

const INVOICE_ITEM_ENDPOINTS = {
  GET_ITEMS: "/invoice-items",
} as const;

/** Inline shape — no external types file */
interface InvoiceItem {
  id: string;
  name: string;
  itemCode: string;
  classification: "GOODS" | "SERVICES";
  unit: string;
  hsnSacCode: string;
  salePrice: number;
  gstRate: number;
  description?: string;
}

export const invoiceItemApi = {
  getItems(search?: string) {
    const items: InvoiceItem[] = [
      {
        id: "1",
        name: "Daikin 1.5 Ton Inverter Split Air Conditioner",
        itemCode: "AC-DAIKIN-1.5T",
        classification: "GOODS",
        unit: "PCS",
        hsnSacCode: "84151010",
        salePrice: 42500,
        gstRate: 18,
        description:
          "Energy-efficient 5-star inverter split AC with copper condenser.",
      },
      {
        id: "2",
        name: "AC Installation Service",
        itemCode: "SERVICE-AC-INSTALL",
        classification: "SERVICES",
        unit: "JOB",
        hsnSacCode: "998716",
        salePrice: 2500,
        gstRate: 18,
        description:
          "Installation of indoor and outdoor units, piping, wiring, testing.",
      },
      {
        id: "3",
        name: "Copper Pipe 1/4 inch",
        itemCode: "COPPER-PIPE-14",
        classification: "GOODS",
        unit: "MTR",
        hsnSacCode: "74111000",
        salePrice: 180,
        gstRate: 18,
      },
      {
        id: "4",
        name: "Stabilizer 4 KVA",
        itemCode: "STAB-4KVA",
        classification: "GOODS",
        unit: "PCS",
        hsnSacCode: "85044090",
        salePrice: 3200,
        gstRate: 18,
      },
    ];

    const filteredItems = search
      ? items.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        )
      : items;

    return Promise.resolve({
      data: filteredItems,
    });
  },
};
