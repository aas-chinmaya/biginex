import {
  UserRound,
  UsersRound,
  Building2,
  Network,
  Landmark,
  HandHeart,
  ShieldCheck,
  CircleHelp,
  ShoppingBasket,
  Cpu,
  Shirt,
  Pill,
  UtensilsCrossed,
  Hammer,
  Car,
  Sparkles,
  Armchair,
  Smartphone,
  BookOpen,
  Gem,
  Truck,
  Factory,
  Wheat,
  Warehouse,
  Hotel,
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  ShoppingCart,
  Printer,
  Dumbbell,
  PawPrint,
  MoreHorizontal,
  ShoppingBag,
  Package2,
  HeartPulse,
  HardHat,
  FlaskConical,
  Clapperboard,
  Radio,
  Zap,
  Pickaxe,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// Maps master-data option ids to an icon, purely for the picker
// UI. Falls back to MoreHorizontal for any id not listed here.
//
// Keys MUST match the `id` values in masterData.ts.
// ============================================================

export const businessTypeIcons: Record<string, LucideIcon> = {
  proprietorship: UserRound,
  partnership: UsersRound,
  "private-limited": Building2,
  llp: Network,
  "public-limited": Landmark,
  "trust-society": HandHeart,
  "government-psu": ShieldCheck,
  others: CircleHelp,
};

export const businessCategoryIcons: Record<string, LucideIcon> = {
  "1": ShoppingBasket,      // Grocery & Supermarket
  "2": Cpu,                 // Electronics & Appliances
  "3": Shirt,               // Fashion & Apparel
  "4": Pill,                // Pharmaceuticals & Medical
  "5": UtensilsCrossed,     // Food & Beverage
  "6": Hammer,              // Hardware & Building Material
  "7": Car,                 // Automobile & Spare Parts
  "8": Sparkles,            // Beauty & Personal Care
  "9": Armchair,            // Furniture & Home Decor
  "10": Smartphone,         // Mobile & Accessories
  "11": BookOpen,           // Stationery & Books
  "12": Gem,                // Jewellery & Accessories
  "13": Truck,              // Wholesale & Distribution
  "14": Factory,            // Manufacturing
  "15": Building2,          // Construction & Real Estate
  "16": Wheat,              // Agriculture & Farming
  "17": Warehouse,          // Transport & Logistics
  "18": Hotel,              // Hospitality & Travel
  "19": GraduationCap,      // Education & Training
  "20": BriefcaseBusiness,  // Professional Services
  "21": Code2,              // IT & Software Services
  "22": ShoppingCart,       // E-commerce & Online Business
  "23": Printer,            // Printing & Publishing
  "24": Dumbbell,           // Sports & Fitness
  "25": PawPrint,           // Pet Care & Supplies
  "26": MoreHorizontal,     // Other
};

// Industries use numeric ids from masterData
export const industryIcons: Record<string, LucideIcon> = {
  "1": Package2, // FMCG & Consumer Goods
  "2": UtensilsCrossed, // Food & Beverage
  "3": ShoppingBag, // Retail & E-commerce
  "4": Truck, // Wholesale & Distribution
  "5": Factory, // Manufacturing
  "6": HeartPulse, // Healthcare & Pharmaceuticals
  "7": Shirt, // Textile & Apparel
  "8": Car, // Automobile & Auto Components
  "9": Cpu, // Electronics & Electrical
  "10": HardHat, // Construction & Infrastructure
  "11": Building2, // Real Estate
  "12": Code2, // IT & Software
  "13": Landmark, // Banking & Financial Services
  "14": ShieldCheck, // Insurance
  "15": GraduationCap, // Education & Training
  "16": Hotel, // Hospitality & Tourism
  "17": Truck, // Transportation & Logistics
  "18": Wheat, // Agriculture & Farming
  "19": FlaskConical, // Chemicals & Petrochemicals
  "20": Pill, // Pharmaceuticals & Medical Devices
  "21": Sparkles, // Beauty & Personal Care
  "22": Clapperboard, // Media & Entertainment
  "23": BriefcaseBusiness, // Professional Services
  "24": Radio, // Telecommunications
  "25": Zap, // Energy & Utilities
  "26": Pickaxe, // Mining & Metals
  "27": Printer, // Printing & Publishing
  "28": Dumbbell, // Sports & Fitness
  "29": Landmark, // Government & Public Sector
  "30": MoreHorizontal, // Other
};

export function getOptionIcon(
  map: Record<string, LucideIcon>,
  id?: string
): LucideIcon {
  return (id && map[id]) || MoreHorizontal;
}
