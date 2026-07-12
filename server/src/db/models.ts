export type Role = {
  id: number;
  slug: string;
  name: string;
  created_at: Date;
};

export type User = {
  id: number;
  email: string;
  name: string | null;
  password_hash: string | null;
  department: string | null;
  department_id: number | null;
  role_id: number;
  auth_provider: "local" | "google";
  provider_account_id: string | null;
  is_active: boolean;
  email_verified_at: Date | null;
  email_verification_token_hash: string | null;
  email_verification_token_expires_at: Date | null;
  password_reset_token_hash: string | null;
  password_reset_token_expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type UserWithRole = {
  id: number;
  email: string;
  name: string | null;
  department: string | null;
  department_id: number | null;
  role_id: number;
  role_slug: string;
  role_name: string;
  is_active: boolean;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type SampleEntity = {
  id: number;
  name: string;
  status: string;
  owner_user_id: number | null;
  created_at: Date;
};

export type Department = {
  id: number;
  name: string;
  code: string | null;
  parent_department_id: number | null;
  head_user_id: number | null;
  status: "active" | "inactive";
  created_at: Date;
  updated_at: Date;
};

export type AssetCategory = {
  id: number;
  name: string;
  description: string | null;
  custom_fields: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
};

export type AssetStatus = "available" | "allocated" | "reserved" | "under_maintenance" | "lost" | "retired" | "disposed";
export type AssetCondition = "excellent" | "good" | "fair" | "poor";

export type Asset = {
  id: number;
  name: string;
  asset_tag: string;
  serial_number: string | null;
  category_id: number | null;
  department_id: number | null;
  status: AssetStatus;
  condition: AssetCondition;
  location: string | null;
  acquisition_date: Date | null;
  acquisition_cost: number | null;
  is_shared_bookable: boolean;
  photo_url: string | null;
  document_url: string | null;
  notes: string | null;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
};

export type AssetStatusHistory = {
  id: number;
  asset_id: number;
  from_status: string | null;
  to_status: string;
  changed_by: number | null;
  reason: string | null;
  created_at: Date;
};

export type AllocationStatus = "active" | "returned" | "transferred";

export type AssetAllocation = {
  id: number;
  asset_id: number;
  allocated_to_user_id: number | null;
  allocated_to_department_id: number | null;
  allocated_by: number | null;
  expected_return_date: Date | null;
  returned_at: Date | null;
  return_condition_notes: string | null;
  status: AllocationStatus;
  created_at: Date;
  updated_at: Date;
};

export type TransferStatus = "requested" | "approved" | "rejected" | "completed";

export type TransferRequest = {
  id: number;
  asset_id: number;
  from_allocation_id: number | null;
  requested_by: number;
  to_user_id: number | null;
  to_department_id: number | null;
  approved_by: number | null;
  status: TransferStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
};

export type BookingStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type ResourceBooking = {
  id: number;
  asset_id: number;
  booked_by: number;
  department_id: number | null;
  starts_at: Date;
  ends_at: Date;
  purpose: string | null;
  status: BookingStatus;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
};

export type MaintenancePriority = "low" | "medium" | "high" | "critical";
export type MaintenanceStatus = "pending" | "approved" | "rejected" | "technician_assigned" | "in_progress" | "resolved";

export type MaintenanceRequest = {
  id: number;
  asset_id: number;
  requested_by: number;
  description: string;
  priority: MaintenancePriority;
  photo_url: string | null;
  status: MaintenanceStatus;
  approved_by: number | null;
  technician_name: string | null;
  rejection_reason: string | null;
  resolved_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type AuditCycleStatus = "open" | "in_progress" | "closed";

export type AuditCycle = {
  id: number;
  name: string;
  department_id: number | null;
  location: string | null;
  starts_on: Date;
  ends_on: Date;
  status: AuditCycleStatus;
  created_by: number | null;
  closed_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type AuditItem = {
  id: number;
  audit_cycle_id: number;
  asset_id: number;
  result: "verified" | "missing" | "damaged" | null;
  notes: string | null;
  verified_by: number | null;
  verified_at: Date | null;
};

export type Notification = {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string;
  entity_type: string | null;
  entity_id: number | null;
  is_read: boolean;
  created_at: Date;
};

export type ActivityLog = {
  id: number;
  actor_id: number | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  metadata: Record<string, unknown>;
  created_at: Date;
};
