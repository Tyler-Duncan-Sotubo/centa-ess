export interface AssetRequest {
  id: string;
  requestDate: string; // ISO date (e.g., "2025-06-19")
  assetType: string;
  purpose: string;
  urgency: "Normal" | "High" | "Critical";
  notes: string;
  status: "requested" | "approved" | "rejected" | "processing";
  createdAt: string; // ISO datetime
  updatedAt: string;
  employeeId: string;
  companyId: string;
  rejectionReason: string | null;
}

export interface Asset {
  id: string;
  internalId: string;
  name: string;
  modelName: string;
  serialNumber: string;
  category: "Laptop" | "Monitor" | "Phone" | "Furniture" | "Other";
  lendDate: string | null;
  location: string;
  status: "assigned" | "available" | "maintenance" | "retired" | string;
  hasReport: boolean;
}
