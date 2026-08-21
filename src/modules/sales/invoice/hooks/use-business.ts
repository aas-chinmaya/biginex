"use client";

export interface BusinessContext {
  id: string;

  branchId: string;
  createdBy: string;

  sellerLegalName: string;
  sellerTradeName: string;

  sellerGSTIN: string;
  sellerPAN: string;

  sellerPhone: string;
  sellerEmail: string;

  sellerAddressLine1: string;
  sellerAddressLine2: string;

  sellerCity: string;
  sellerState: string;
  sellerStateCode: string;
  sellerPincode: string;
  sellerCountry: string;
}

export function useBusiness(): {
  business: BusinessContext;
} {
  return {
    business: {
      // ====================================================
      // IMPORTANT:
      // Replace these with real database IDs.
      // ====================================================

      id: "business_0012",

      branchId: "BRANCH_ID_1003",

      createdBy: "USER_ID_7035",

      // ====================================================
      // Seller
      // ====================================================

      sellerLegalName: "AAS International Private Limited",

      sellerTradeName: "AAS International",

      sellerGSTIN: "21ABCDE1234F1Z5",

      sellerPAN: "ABCDE1234F",

      sellerPhone: "+91 98765 43210",

      sellerEmail: "info@aasint.com",

      sellerAddressLine1: "Plot No. 123",

      sellerAddressLine2: "Infocity Road",

      sellerCity: "Bhubaneswar",

      sellerState: "Odisha",

      sellerStateCode: "21",

      sellerPincode: "751024",

      sellerCountry: "India",
    },
  };
}