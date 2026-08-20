import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Receipt,
  Users,
  PersonStandingIcon,
  Truck,
  BarChart3,
  Settings,
  Bell,

  //business
  GitBranch,
  Factory,
  Coins,

  //role
  UsersRound,

  // item
  PackageSearch,
  FolderTree,
  Folder,
  Tags,
  Ruler,
  Layers3,
  List,

  // Inventory
  Warehouse,
  SlidersHorizontal,
  ArrowRightLeft,

  // Sales
  FileText,
  FileCheck,
  RotateCcw,
  CreditCard,

  // Purchase
  ClipboardList,
  FileSearch,
  FileSpreadsheet,
  PackageCheck,
  ReceiptText,

  // Reports
  ChartColumn,
  ChartPie,
  Archive,
  Landmark,
  TrendingUp,

  //masters
  ShieldCheck,
  Blocks,
  Component,
  Webhook,

  // Settings
  Building2,
  UserCog,
  Shield,
  Percent,
  FileCog,
  DatabaseBackup,
} from "lucide-react";

export interface SidebarChild {
  title: string;
  href: string;
  icon: any;
  badge?: string;
}

export interface SidebarItem {
  title: string;
  icon: any;
  href?: string;
  badge?: string;
  children?: SidebarChild[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Business Masters",
    icon: Package,
    children: [
      {
        title: "Registration Type",
        href: "/business-setup/masters/registration-type",
        icon: Building2,
      },
      {
        title: "Category",
        href: "/business-setup/masters/category",
        icon: Tags,
      },
      {
        title: "Sub Category",
        href: "/business-setup/masters/subcategory",
        icon: GitBranch,
      },
      {
        title: "Industry",
        href: "/business-setup/masters/industry",
        icon: Factory,
      },
      {
        title: "Currency",
        href: "/business-setup/masters/currency",
        icon: Coins,
      },
    ],
  },

  {
    title: "Role Access",
    icon: Shield,
    children: [
      {
        title: "Access Management",
        href: "/role-access",
        icon: ShieldCheck,
      },
      {
        title: "Roles",
        href: "/masters/roleManagement",
        icon: UsersRound,
      },
      {
        title: "Module & Submodule",
        href: "/masters/muduleAndSubmodule",
        icon: Blocks,
      },
      {
        title: "Features",
        href: "/masters/featureManagement",
        icon: Component,
      },
      {
        title: "APIs",
        href: "/masters/apiManagement",
        icon: Webhook,
      },
    ],
  },

  {
    title: "Users",
    href: "/users",
    icon: Users,
  },

  {
    title: "Vendors / Suppliers",
    href: "/vendors",
    icon: Truck,
  },

  {
    title: "Items",
    icon: Package,
    children: [
      {
        title: "All Items",
        href: "/items",
        icon: PackageSearch,
      },
      {
        title: "Category",
        href: "/items/category-master",
        icon: FolderTree,
      },
      {
        title: "Sub Category",
        href: "/items/sub-category",
        icon: Folder,
      },
      {
        title: "Brands",
        href: "/items/brands",
        icon: Tags,
      },
      {
        title: "Units",
        href: "/items/units",
        icon: Ruler,
      },
      {
        title: "Variant Type",
        href: "/items/variant-type",
        icon: Layers3,
      },
      {
        title: "Variant Value",
        href: "/items/variant-value",
        icon: List,
      },
      {
        title: "Tax",
        href: "/items/tax-master",
        icon: Percent,
      },
    ],
  },

  {
    title: "Inventory",
    icon: Boxes,
    children: [
      {
        title: "Stock",
        href: "/inventory",
        icon: Warehouse,
      },
      {
        title: "Stock Adjustment",
        href: "/inventory/adjustment",
        icon: SlidersHorizontal,
      },
      {
        title: "Stock Transfer",
        href: "/inventory/transfer",
        icon: ArrowRightLeft,
      },
      {
        title: "Warehouses",
        href: "/inventory/warehouses",
        icon: Warehouse,
      },
    ],
  },

  {
    title: "Sales",
    icon: ShoppingCart,
    children: [
      {
        title: "Invoices",
        href: "/sales/invoice",
        icon: FileText,
      },
      {
        title: "Quotations",
        href: "/sales/quotations",
        icon: FileCheck,
      },
      {
        title: "Returns",
        href: "/sales/returns",
        icon: RotateCcw,
      },
      {
        title: "Payments",
        href: "/sales/payments",
        icon: CreditCard,
      },
    ],
  },

  {
    title: "Purchase",
    icon: Receipt,
    children: [
      {
        title: "Purchase Orders",
        href: "/purchase",
        icon: ReceiptText,
      },
      {
        title: "Purchase Requests",
        href: "/purchase/requests",
        icon: ClipboardList,
      },
      {
        title: "RFQ",
        href: "/purchase/rfq",
        icon: FileSearch,
      },
      {
        title: "Vendor Quotations",
        href: "/purchase/quotations",
        icon: FileSpreadsheet,
      },
      {
        title: "Goods Received Note",
        href: "/purchase/grn",
        icon: PackageCheck,
      },
      {
        title: "Purchase Invoice",
        href: "/purchase/invoices",
        icon: FileText,
      },
      {
        title: "Debit Notes",
        href: "/purchase/debit-notes",
        icon: FileText,
      },
      {
        title: "Credit Notes",
        href: "/purchase/credit-notes",
        icon: FileText,
      },
    ],
  },

  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },

  {
    title: "Reports",
    icon: BarChart3,
    children: [
      {
        title: "Sales Report",
        href: "/reports/sales",
        icon: ChartColumn,
      },
      {
        title: "Purchase Report",
        href: "/reports/purchase",
        icon: ChartPie,
      },
      {
        title: "Inventory Report",
        href: "/reports/inventory",
        icon: Archive,
      },
      {
        title: "GST Report",
        href: "/reports/gst",
        icon: Landmark,
      },
      {
        title: "Profit & Loss",
        href: "/reports/profit-loss",
        icon: TrendingUp,
      },
    ],
  },

  {
    title: "Settings",
    icon: Settings,
    children: [
      {
        title: "Manage Business",
        href: "/business-setup/manage-business",
        icon: Building2,
      },
      {
        title: "Users",
        href: "/settings/users",
        icon: UserCog,
      },
      {
        title: "Roles & Permissions",
        href: "/settings/roles",
        icon: Shield,
      },
      {
        title: "Taxes",
        href: "/settings/taxes",
        icon: Percent,
      },
      {
        title: "Invoice Settings",
        href: "/settings/invoice",
        icon: FileCog,
      },
      {
        title: "Backup & Restore",
        href: "/settings/backup",
        icon: DatabaseBackup,
      },
    ],
  },
];