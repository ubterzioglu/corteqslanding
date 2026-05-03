export type LansmanRegistrationStatus = "pending" | "approved" | "rejected";

export type LansmanRegistration = {
  id: string;
  first_name: string;
  last_name: string;
  initials: string | null;
  phone: string;
  linkedin: string | null;
  instagram: string | null;
  twitter: string | null;
  website: string | null;
  description: string | null;
  status: LansmanRegistrationStatus;
  created_at: string;
};

export type LansmanRegistrationInsert = Omit<
  LansmanRegistration,
  "id" | "created_at"
>;

export type LansmanRegistrationFormData = {
  first_name: string;
  last_name: string;
  phone: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  website: string;
  description: string;
};

export type LansmanAdminAction = "list" | "update-status";

export type LansmanAdminListRequest = {
  action: "list";
};

export type LansmanAdminUpdateStatusRequest = {
  action: "update-status";
  id: string;
  status: Extract<LansmanRegistrationStatus, "approved" | "rejected">;
};

export type LansmanAdminRequest =
  | LansmanAdminListRequest
  | LansmanAdminUpdateStatusRequest;

export type LansmanAdminListResponse = {
  registrations: LansmanRegistration[];
};

export type LansmanAdminUpdateStatusResponse = {
  registration: LansmanRegistration;
};
