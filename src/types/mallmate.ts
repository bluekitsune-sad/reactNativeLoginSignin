/**
 * Core MallMate entity types — for new MallMate code only.
 *
 * Derived from the logical model in
 * `MallMate_Project_Blueprint/02-data/ERD.md`. Per the ERD, ids are UUIDs
 * and timestamps are UTC ISO-8601; final field constraints are left open
 * until implementation. Existing screens stay JavaScript (`allowJs`) — do
 * not force-convert them. Keep capability keys/statuses in sync with
 * `src/constants/Capabilities.js` and PRD.md section 5.3.
 */

/** UUID primary key (ERD: "Use UUID primary keys"). */
export type Uuid = string;

/** UTC timestamp, ISO-8601 (ERD: "UTC timestamps unless ..."). */
export type Timestamp = string;

/**
 * Capability registry keys — PRD.md section 5.3; mirrors
 * `CAPABILITIES` in `src/constants/Capabilities.js`.
 */
export type CapabilityKey =
  | "food_court"
  | "restaurant_discovery"
  | "retail_discovery"
  | "online_ordering"
  | "online_payment"
  | "loyalty"
  | "indoor_navigation"
  | "live_parking"
  | "events"
  | "seat_sessions"
  | "reservations"
  | "digital_coupons";

/** Capability statuses — PRD.md section 5.3; mirrors `CAPABILITY_STATUS`. */
export type CapabilityStatus = "ENABLED" | "DEGRADED" | "DISABLED";

/** One weekday's opening hours in local mall time. */
export interface OpeningHoursDay {
  /** 0 = Sunday … 6 = Saturday. */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Opening time, 24h "HH:mm" local time. */
  opensAt: string;
  /** Closing time, 24h "HH:mm" local time. */
  closesAt: string;
  closed?: boolean;
}

/** Weekly operating schedule (Mall operating info, PRD 5.2; Merchant hours). */
export interface OpeningHours {
  /** IANA timezone override; defaults to the mall's timezone. */
  timezone?: string;
  days: OpeningHoursDay[];
  /** Exceptions (holidays, special hours); `date` is "YYYY-MM-DD". */
  exceptions?: Array<{
    date: string;
    closed: boolean;
    opensAt?: string;
    closesAt?: string;
  }>;
}

/** ERD "Identity and tenancy" → Mall. */
export interface Mall {
  id: Uuid;
  slug: string;
  name: string;
  address: string;
  /** IANA timezone, e.g. "Asia/Karachi". */
  timezone: string;
  /** ISO 4217 currency code, e.g. "PKR". */
  currency: string;
  /** Lifecycle status; final values TBD by the ERD's open constraints. */
  status: string;
  logoUrl?: string | null;
  media?: string[];
  openingHours?: OpeningHours;
  updatedAt?: Timestamp;
}

/** ERD "Identity and tenancy" → MallCapability. */
export interface Capability {
  id: Uuid;
  mallId: Uuid;
  capabilityKey: CapabilityKey;
  status: CapabilityStatus;
  /** Per-key configuration blob; shape varies by capability. */
  config?: Record<string, unknown>;
  configVersion?: number;
  updatedBy?: Uuid;
  updatedAt?: Timestamp;
}

/** Contact details approved for display (ERD Merchant "contact"). */
export interface MerchantContact {
  email?: string;
  phone?: string;
  website?: string;
}

/** ERD "Merchants and catalog" → Merchant. */
export interface Merchant {
  id: Uuid;
  mallId: Uuid;
  legalName: string;
  displayName: string;
  category?: string;
  /** Lifecycle/approval status; final values TBD. */
  status: string;
  /** Location/floor reference (ERD). */
  floorId?: Uuid | null;
  hours?: OpeningHours;
  contact?: MerchantContact | null;
  logoUrl?: string | null;
  approvedAt?: Timestamp | null;
  createdAt?: Timestamp;
}
