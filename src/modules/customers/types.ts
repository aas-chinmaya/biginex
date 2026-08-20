export type CustomerType =
  | "WALK_IN"
  | "REGULAR"
  | "WHOLESALE";

export interface Customer {
  id: string;
  businessId: string;
  branchId?: string | null;
  customerCode?: string | null;
  customerType: CustomerType;
  name: string;
  mobile: string;
  alternateMobile?: string | null;
  email?: string | null;
  gstin?: string | null;
  pan?: string | null;
  companyName?: string | null;
  creditLimit: number;
  creditDays: number;
  openingBalance: number;
  outstandingBalance: number;
  rewardPoints: number;
  isActive: boolean;
  notes?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
