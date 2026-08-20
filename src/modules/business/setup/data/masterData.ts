import { MasterOption } from "../types";

// ============================================================
// Static master data.
//
// These stand in for the real `/masters/*` endpoints referenced
// in the schema (businessCategoryId, industryId, registrationType,
// currencyId, countryId, stateId, cityId are all "master table" /
// "master/api" driven). Swap `master.api.ts` to hit the real
// endpoints when they're ready — nothing in the UI layer changes.
// ============================================================

export const businessTypes: MasterOption[] = [
  { id: "proprietorship", name: "Proprietorship" },
  { id: "partnership", name: "Partnership" },
  { id: "private-limited", name: "Private Limited" },
  { id: "llp", name: "LLP" },
  { id: "public-limited", name: "Public Limited" },
  // { id: "huf", name: "HUF" },
  { id: "trust-society", name: "Trust / Society" },
  { id: "government-psu", name: "Government / PSU" },
  { id: "others", name: "Others" },
];

export const businessCategories: MasterOption[] = [
  { id: "1", name: "Grocery & Supermarket" },
  { id: "2", name: "Electronics & Appliances" },
  { id: "3", name: "Fashion & Apparel" },
  { id: "4", name: "Pharmaceuticals & Medical" },
  { id: "5", name: "Food & Beverage" },
  { id: "6", name: "Hardware & Building Material" },
  { id: "7", name: "Automobile & Spare Parts" },
  { id: "8", name: "Beauty & Personal Care" },
  { id: "9", name: "Furniture & Home Decor" },
  { id: "10", name: "Mobile & Accessories" },
  { id: "11", name: "Stationery & Books" },
  { id: "12", name: "Jewellery & Accessories" },
  { id: "13", name: "Wholesale & Distribution" },
  { id: "14", name: "Manufacturing" },
  { id: "15", name: "Construction & Real Estate" },
  { id: "16", name: "Agriculture & Farming" },
  { id: "17", name: "Transport & Logistics" },
  { id: "18", name: "Hospitality & Travel" },
  { id: "19", name: "Education & Training" },
  { id: "20", name: "Professional Services" },
  { id: "21", name: "IT & Software Services" },
  { id: "22", name: "E-commerce & Online Business" },
  { id: "23", name: "Printing & Publishing" },
  { id: "24", name: "Sports & Fitness" },
  { id: "25", name: "Pet Care & Supplies" },
  { id: "26", name: "Other" },
];



//sub cat
export const businessSubCategories = {
  "Grocery & Supermarket": [
    "Fruits & Vegetables",
    "Dairy & Milk Products",
    "Bakery & Biscuits",
    "Rice, Flour & Grains",
    "Pulses & Lentils",
    "Spices & Masala",
    "Cooking Oil & Ghee",
    "Packaged Food",
    "Snacks & Namkeen",
    "Beverages",
    "Tea & Coffee",
    "Frozen Food",
    "Personal Care",
    "Household Cleaning",
    "Baby Care",
    "Pet Food",
    "Other",
  ],

  "Electronics & Appliances": [
    "Televisions",
    "Refrigerators",
    "Washing Machines",
    "Air Conditioners",
    "Coolers & Fans",
    "Microwave & Ovens",
    "Kitchen Appliances",
    "Home Appliances",
    "Audio & Speakers",
    "Cameras & Accessories",
    "Electrical Appliances",
    "Other",
  ],

  "Fashion & Apparel": [
    "Men's Clothing",
    "Women's Clothing",
    "Kids' Clothing",
    "Ethnic Wear",
    "Western Wear",
    "Innerwear",
    "Footwear",
    "Bags & Luggage",
    "Watches",
    "Fashion Accessories",
    "Other",
  ],

  "Pharmaceuticals & Medical": [
    "Prescription Medicines",
    "OTC Medicines",
    "Ayurvedic Medicines",
    "Homeopathic Medicines",
    "Medical Devices",
    "Surgical Supplies",
    "First Aid",
    "Vitamins & Supplements",
    "Baby Care",
    "Personal Care",
    "Healthcare Equipment",
    "Other",
  ],

  "Food & Beverage": [
    "Restaurant",
    "Cafe & Coffee Shop",
    "Bakery",
    "Fast Food",
    "Catering",
    "Sweets & Confectionery",
    "Snacks & Namkeen",
    "Beverages",
    "Packaged Food",
    "Frozen Food",
    "Other",
  ],

  "Hardware & Building Material": [
    "Cement",
    "Steel & Iron",
    "Bricks & Blocks",
    "Sand & Aggregates",
    "Paints & Chemicals",
    "Plumbing Materials",
    "Electrical Materials",
    "Tools & Equipment",
    "Tiles & Flooring",
    "Sanitaryware",
    "Doors & Windows",
    "Fasteners & Fittings",
    "Other",
  ],

  "Automobile & Spare Parts": [
    "Car Parts",
    "Bike Parts",
    "Commercial Vehicle Parts",
    "Engine Parts",
    "Electrical Parts",
    "Tyres & Tubes",
    "Batteries",
    "Lubricants & Oils",
    "Accessories",
    "Tools & Equipment",
    "Body Parts",
    "Other",
  ],

  "Beauty & Personal Care": [
    "Skincare",
    "Haircare",
    "Makeup & Cosmetics",
    "Fragrances",
    "Bath & Body",
    "Hair Salon Products",
    "Beauty Tools & Equipment",
    "Personal Hygiene",
    "Men's Grooming",
    "Women's Grooming",
    "Other",
  ],

  "Furniture & Home Decor": [
    "Living Room Furniture",
    "Bedroom Furniture",
    "Dining Furniture",
    "Office Furniture",
    "Kitchen Furniture",
    "Outdoor Furniture",
    "Mattresses",
    "Home Decor",
    "Lighting & Lamps",
    "Curtains & Blinds",
    "Carpets & Rugs",
    "Other",
  ],

  "Mobile & Accessories": [
    "Mobile Phones",
    "Smartphones",
    "Tablets",
    "Chargers & Adapters",
    "USB Cables",
    "Power Banks",
    "Mobile Covers",
    "Screen Protectors",
    "Earphones & Headphones",
    "Smart Watches",
    "Mobile Spare Parts",
    "Other",
  ],

  "Stationery & Books": [
    "Notebooks & Registers",
    "Pens & Pencils",
    "Paper Products",
    "Office Supplies",
    "School Supplies",
    "Art & Craft Supplies",
    "Books",
    "Educational Materials",
    "Files & Folders",
    "Printing Supplies",
    "Other",
  ],

  "Jewellery & Accessories": [
    "Gold Jewellery",
    "Silver Jewellery",
    "Diamond Jewellery",
    "Artificial Jewellery",
    "Fashion Jewellery",
    "Rings",
    "Necklaces",
    "Earrings",
    "Bracelets & Bangles",
    "Watches",
    "Jewellery Accessories",
    "Other",
  ],

  "Wholesale & Distribution": [
    "FMCG Distribution",
    "Food Distribution",
    "Electronics Distribution",
    "Pharmaceutical Distribution",
    "Textile Distribution",
    "Hardware Distribution",
    "Automobile Parts Distribution",
    "Industrial Products",
    "Consumer Goods",
    "Other",
  ],

  "Manufacturing": [
    "Food Manufacturing",
    "Textile Manufacturing",
    "Plastic Manufacturing",
    "Metal Manufacturing",
    "Chemical Manufacturing",
    "Pharmaceutical Manufacturing",
    "Electrical Manufacturing",
    "Electronics Manufacturing",
    "Furniture Manufacturing",
    "Machinery Manufacturing",
    "Packaging Manufacturing",
    "Other",
  ],

  "Construction & Real Estate": [
    "Residential Construction",
    "Commercial Construction",
    "Civil Construction",
    "Interior & Renovation",
    "Property Development",
    "Property Sales",
    "Property Rental",
    "Building Maintenance",
    "Architecture & Design",
    "Real Estate Brokerage",
    "Other",
  ],

  "Agriculture & Farming": [
    "Seeds",
    "Fertilizers",
    "Pesticides",
    "Agricultural Equipment",
    "Irrigation Equipment",
    "Animal Feed",
    "Dairy Farming",
    "Poultry Farming",
    "Organic Farming",
    "Farm Produce",
    "Nursery & Plants",
    "Other",
  ],

  "Transport & Logistics": [
    "Goods Transportation",
    "Passenger Transportation",
    "Courier Services",
    "Freight Services",
    "Warehouse & Storage",
    "Packers & Movers",
    "Fleet Management",
    "Truck Rental",
    "Taxi & Cab Services",
    "Delivery Services",
    "Other",
  ],

  "Hospitality & Travel": [
    "Hotels",
    "Resorts",
    "Guest Houses",
    "Restaurants",
    "Cafes",
    "Travel Agency",
    "Tour Operator",
    "Car Rental",
    "Event & Banquet Services",
    "Homestays",
    "Other",
  ],

  "Education & Training": [
    "Schools",
    "Colleges",
    "Coaching Centers",
    "Training Institutes",
    "Computer Training",
    "Vocational Training",
    "Online Education",
    "Skill Development",
    "Language Training",
    "Professional Training",
    "Other",
  ],

  "Professional Services": [
    "Accounting & Tax Services",
    "Legal Services",
    "Consulting",
    "Business Services",
    "Marketing & Advertising",
    "Human Resources",
    "Architecture & Design",
    "Engineering Services",
    "Financial Services",
    "Insurance Services",
    "Other",
  ],

  "IT & Software Services": [
    "Software Development",
    "Web Development",
    "Mobile App Development",
    "IT Consulting",
    "Cloud Services",
    "Cybersecurity",
    "Networking",
    "IT Hardware",
    "Software Products",
    "SaaS Services",
    "Technical Support",
    "Other",
  ],

  "E-commerce & Online Business": [
    "Online Retail",
    "Marketplace Seller",
    "Dropshipping",
    "Direct-to-Consumer",
    "Online Grocery",
    "Online Fashion",
    "Online Electronics",
    "Digital Products",
    "Subscription Services",
    "Online Services",
    "Other",
  ],

  "Printing & Publishing": [
    "Digital Printing",
    "Offset Printing",
    "Flex & Banner Printing",
    "Screen Printing",
    "Packaging Printing",
    "Business Cards",
    "Brochures & Flyers",
    "Books & Magazines",
    "Labels & Stickers",
    "Publishing Services",
    "Other",
  ],

  "Sports & Fitness": [
    "Gym & Fitness Center",
    "Sports Equipment",
    "Sportswear",
    "Fitness Accessories",
    "Yoga & Wellness",
    "Outdoor Sports",
    "Indoor Sports",
    "Swimming",
    "Sports Coaching",
    "Nutrition & Fitness Products",
    "Other",
  ],

  "Pet Care & Supplies": [
    "Pet Food",
    "Pet Accessories",
    "Pet Grooming",
    "Veterinary Services",
    "Pet Medicines",
    "Pet Toys",
    "Pet Clothing",
    "Pet Hygiene",
    "Pet Training",
    "Pet Boarding",
    "Other",
  ],

  "Other": [
    "General Trading",
    "Retail",
    "Services",
    "Online Business",
    "Consulting",
    "Other",
  ],
};






export const industries: MasterOption[] = [
  { id: "1", name: "FMCG & Consumer Goods" },
  { id: "2", name: "Food & Beverage" },
  { id: "3", name: "Retail & E-commerce" },
  { id: "4", name: "Wholesale & Distribution" },
  { id: "5", name: "Manufacturing" },
  { id: "6", name: "Healthcare & Pharmaceuticals" },
  { id: "7", name: "Textile & Apparel" },
  { id: "8", name: "Automobile & Auto Components" },
  { id: "9", name: "Electronics & Electrical" },
  { id: "10", name: "Construction & Infrastructure" },
  { id: "11", name: "Real Estate" },
  { id: "12", name: "IT & Software" },
  { id: "13", name: "Banking & Financial Services" },
  { id: "14", name: "Insurance" },
  { id: "15", name: "Education & Training" },
  { id: "16", name: "Hospitality & Tourism" },
  { id: "17", name: "Transportation & Logistics" },
  { id: "18", name: "Agriculture & Farming" },
  { id: "19", name: "Chemicals & Petrochemicals" },
  { id: "20", name: "Pharmaceuticals & Medical Devices" },
  { id: "21", name: "Beauty & Personal Care" },
  { id: "22", name: "Media & Entertainment" },
  { id: "23", name: "Professional Services" },
  { id: "24", name: "Telecommunications" },
  { id: "25", name: "Energy & Utilities" },
  { id: "26", name: "Mining & Metals" },
  { id: "27", name: "Printing & Publishing" },
  { id: "28", name: "Sports & Fitness" },
  { id: "29", name: "Government & Public Sector" },
  { id: "30", name: "Others" },
];

export const registrationTypes: MasterOption[] = [
  { id: "1", name: "GST Registered" },
  { id: "2", name: "Not Registered under GST" },
  { id: "3", name: "Composition Scheme" },
  { id: "4", name: "Others" },
];

export const otherRegistrationTypes: MasterOption[] = [
  { id: "1", name: "Trade Licence" },
  { id: "2", name: "FSSAI Licence" },
  { id: "3", name: "Drug Licence" },
  { id: "4", name: "Professional Tax" },
  { id: "5", name: "Import Export Code (IEC)" },
  { id: "6", name: "Others" },
];

export const currencies: MasterOption[] = [
  { id: "1", name: "Indian Rupee", meta: "₹" },
  { id: "2", name: "US Dollar", meta: "$" },
  { id: "3", name: "UAE Dirham", meta: "د.إ" },
  { id: "4", name: "Euro", meta: "€" },
  { id: "5", name: "British Pound", meta: "£" },
];

export const timezones: MasterOption[] = [
  { id: "Asia/Kolkata", name: "Asia/Kolkata (IST)" },
  { id: "Asia/Dubai", name: "Asia/Dubai (GST)" },
  { id: "Europe/London", name: "Europe/London (GMT/BST)" },
  { id: "America/New_York", name: "America/New_York (ET)" },
];

export const financialYears: MasterOption[] = [
  { id: "2024-2025", name: "2024 - 2025" },
  { id: "2025-2026", name: "2025 - 2026" },
  { id: "2026-2027", name: "2026 - 2027" },
];

export const documentTypes: MasterOption[] = [
  { id: "GST", name: "GST Certificate" },
  { id: "PAN", name: "PAN Card" },
  { id: "MSME", name: "MSME Certificate" },
  { id: "TAN", name: "TAN Certificate" },
  { id: "LICENSE", name: "Business License" },
  { id: "CERTIFICATE", name: "Certificate" },
  { id: "OTHER", name: "Other" },
];

// ---- Location: country -> state -> city -------------------

export const countries: MasterOption[] = [
  { id: "in", name: "India", meta: "+91" },
  { id: "ae", name: "United Arab Emirates", meta: "+971" },
  { id: "us", name: "United States", meta: "+1" },
  { id: "gb", name: "United Kingdom", meta: "+44" },
];

export const states: MasterOption[] = [
  // India
  { id: "in-od", name: "Odisha", parentId: "in" },
  { id: "in-mh", name: "Maharashtra", parentId: "in" },
  { id: "in-ka", name: "Karnataka", parentId: "in" },
  { id: "in-dl", name: "Delhi", parentId: "in" },
  { id: "in-wb", name: "West Bengal", parentId: "in" },
  // UAE
  { id: "ae-du", name: "Dubai", parentId: "ae" },
  { id: "ae-ad", name: "Abu Dhabi", parentId: "ae" },
  // USA
  { id: "us-ny", name: "New York", parentId: "us" },
  { id: "us-ca", name: "California", parentId: "us" },
  // UK
  { id: "gb-lon", name: "London", parentId: "gb" },
];

export const cities: MasterOption[] = [
  { id: "in-od-bbsr", name: "Bhubaneswar", parentId: "in-od" },
  { id: "in-od-ctc", name: "Cuttack", parentId: "in-od" },
  { id: "in-mh-mum", name: "Mumbai", parentId: "in-mh" },
  { id: "in-mh-pun", name: "Pune", parentId: "in-mh" },
  { id: "in-ka-blr", name: "Bengaluru", parentId: "in-ka" },
  { id: "in-dl-ndl", name: "New Delhi", parentId: "in-dl" },
  { id: "in-wb-kol", name: "Kolkata", parentId: "in-wb" },
  { id: "ae-du-dxb", name: "Dubai City", parentId: "ae-du" },
  { id: "ae-ad-adc", name: "Abu Dhabi City", parentId: "ae-ad" },
  { id: "us-ny-nyc", name: "New York City", parentId: "us-ny" },
  { id: "us-ca-la", name: "Los Angeles", parentId: "us-ca" },
  { id: "gb-lon-lon", name: "London", parentId: "gb-lon" },
];


