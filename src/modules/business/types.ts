export interface Branch {
  id: string;

  name: string;

  code: string;

  address: string;

  city: string;

  state: string;

  country: string;

  phone: string;

  email: string;

  manager: string;

  status: "Active" | "Inactive";
}

export interface Business {
  id: string;

  name: string;

  legalName: string;

  gstin: string;

  pan: string;

  businessType: string;

  industry: string;

  city: string;

  state: string;

  country: string;

  phone: string;

  email: string;

  website?: string;

  logo?: string;

  status: "Active" | "Inactive";

  vendors: number;

  employees: number;

  branches: Branch[];
}