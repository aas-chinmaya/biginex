export interface Vendor {
  id: string;

  // Basic

  vendorCode: string;

  businessId: string;

  vendorType: VendorType;

  vendorName: string;

  gstin?: string;

  pan: string;

  email: string;

  phone: string;

  websiteLink?: string;

  currencyId: string;

  paymentTerm: string;

  paymentMode: string;

  creditLimit: number;

  status: VendorStatus;

  addresses: VendorAddress[];

  contacts: VendorContact[];

  banks: VendorBank[];

  documents: VendorDocument[];


  // Contact

  vendorId: string;

  name: string;

  designation: string;

  mobile: string;

  // Address

  addressLine1: string;

  addressLine2?: string;

  countryId: string;

  stateId: string;

  cityId: string;

  pincode: string;

  isBilling: boolean;

  isShipping: boolean;

  // Bank

  accountHolder: string;

  bankName: string;

  accountNumber: string;

  ifscCode: string;

  branch: string;

  upiId?: string;

  isPrimary: boolean;

  // Business
  paymentTerms: string;

  currency: string;

  openingBalance: number;

  // Statistics

  totalPurchase: number;

  totalOrders: number;

  outstanding: number;

  lastPurchaseDate?: string;

  createdAt?: string;

  updatedAt?: string; 
}

export interface VendorStats {
  totalVendors: number;
  activeVendors: number;
  totalPurchase: number;
  outstanding: number;
}