# Product Requirements Document (PRD)
## MallMate — Multi-Mall Smart Shopping, Navigation, Dining & Loyalty Platform

**Working name:** MallMate (placeholder)  
**Initial pilot:** LuckyOne Mall, Karachi, Pakistan  
**Product type:** Multi-tenant mobile application and merchant/mall management platform  
**Primary mobile stack:** React Native + Expo + TypeScript  
**Platforms:** Android and iOS  
**Status:** Proposed, pre-development  
**Version:** 1.0

---

## 1. Executive Summary

Build a unified digital platform that helps visitors discover, navigate, shop, dine, park, attend events, and earn rewards across participating malls. The first pilot is LuckyOne Mall. The architecture must support additional malls without creating a separate application for each mall.

Visitors choose a mall from a selector. The app loads that mall's listings, services, events, maps, promotions, and enabled capabilities. A mall with a working parking integration can show live parking availability; a mall without one must not show that feature as available.

### Product objectives
1. Help visitors discover restaurants, stores, offers, events, and facilities.
2. Support practical indoor navigation where reliable map data exists.
3. Enable online ordering and payments for participating merchants.
4. Reward eligible purchases through an auditable loyalty ledger.
5. Give merchants tools for listings, orders, offers, paid campaigns, and analytics.
6. Integrate available infrastructure such as parking systems.
7. Support many malls through configuration and tenant isolation.
8. Monetize through sponsored placements, subscriptions, transaction commissions, and mall partnerships.

### Core principles
- One platform, multiple malls.
- Capabilities are configured per mall.
- Paid placements are clearly labeled.
- Organic rankings reflect real, defined transaction data.
- Financial operations are auditable and idempotent.
- The app never claims data is live or accurate when the integration cannot support that claim.
- Privacy, security, accessibility, and tenant isolation are mandatory.

---

## 2. Users and Roles

### Visitor
Browse malls, search listings, view offers, navigate, order, pay, earn/redeem points, manage favorites, view order history, and control notification preferences.

### Merchant owner/manager
Manage approved business profile, hours, menu/products, prices, availability, promotions, orders, staff, and reports.

### Merchant employee
Perform explicitly permitted operational tasks such as accepting orders or marking them ready. No implicit access to finances or account administration.

### Mall administrator
Manage one or more assigned malls, merchant approvals, maps, events, campaigns, capability settings, facilities, reports, and support workflows.

### Platform administrator
Onboard malls, manage global configuration, platform commercial plans, integrations, roles, disputes, fraud, reconciliation, and platform-wide reporting.

### Support/finance/auditor roles
Optional least-privilege roles for support cases, payment reconciliation, and audit review.

---

## 3. Scope

### MVP
- Visitor authentication and profile.
- Mall selector and capability-based home screen.
- Restaurant and retail directory.
- Search, categories, tags, filters, and Show All pages.
- Sponsored/featured placements, labeled clearly.
- Top-selling lists based on a documented metric and known data coverage.
- Merchant pages, menus/products, active offers.
- QR-based time-bound food-court seat sessions.
- Basic indoor map and route calculation if mall map data is available.
- Single-merchant ordering and supported online payment.
- Order status updates and notifications.
- Loyalty ledger and transaction history.
- Merchant web portal.
- Mall/platform administration portals.
- Basic analytics, audit logs, monitoring, and support process.

### Later releases
- Parking sensor integration.
- Live indoor positioning and 3D maps.
- POS/inventory integrations.
- Waitlists and reservations.
- Treasure hunts, referrals, advanced campaigns.
- Cross-mall rewards.
- Cross-merchant carts.
- Personalized recommendations and advanced analytics.

### Explicitly out of scope for initial MVP
- Manufacturing parking sensors.
- Operating a delivery fleet.
- Guaranteeing indoor location without suitable infrastructure.
- Universal real-time inventory across all merchants.
- Cross-merchant checkout before single-merchant commerce is stable.

---

## 4. Mobile Information Architecture

Bottom navigation: **Home | Explore | Map | Rewards | Profile**.

- **Home:** mall selector, search, categories, featured merchants, popularity, discounts, events, supported facility cards.
- **Explore:** full searchable and filterable directory.
- **Map:** floors, destinations, routes, and supported location features.
- **Rewards:** balance, ledger, available rewards, redemption.
- **Profile:** identity, preferences, orders, favorites, settings, help.

Feature flows should also be accessible contextually, such as an active seat session from the food-court page.

---

## 5. Functional Requirements

### 5.1 Authentication and accounts
- Registration/login, verification, logout, recovery, profile updates, account deletion request.
- Guest browsing where feasible; require authentication for account-based rewards and checkout.
- Merchant accounts require approval and tenant-scoped roles.
- Every protected API checks role, resource ownership, mall scope, and merchant scope server-side.

### 5.2 Multi-mall selector
- Search and select a participating mall.
- Show selected mall name/logo and operating information.
- Switching malls refreshes all mall-scoped data without logging out.
- Preserve the user's account and global points.
- Never move an in-progress order to a different mall.
- Clear or revalidate mall-scoped cart contents after switching.
- Avoid stale content from the previously selected mall.

### 5.3 Capability-based home screen
Each mall has a configurable capability registry, e.g. `food_court`, `restaurant_discovery`, `retail_discovery`, `online_ordering`, `online_payment`, `loyalty`, `indoor_navigation`, `live_parking`, `events`, `seat_sessions`, `reservations`, `digital_coupons`.

Capability statuses: `ENABLED`, `DEGRADED`, `DISABLED`. Unsupported capabilities are hidden; degraded capabilities show a clear status; backend APIs independently enforce capability state. Normal configuration updates should not require a mobile app release.

### 5.4 Discovery and listings
Merchant cards can show name, logo, image, category/cuisine, floor/location, opening status, active offer, price range, rating (only if trustworthy), and sponsored label. Merchant pages support business details, map destination, hours, contact details when approved, offers, tags, menu/products, availability, and ordering where enabled.

### 5.5 Featured placements
- Merchants purchase or request eligible campaign inventory.
- Campaigns have start/end, budget or placement limits, target scope, approval status, and reporting.
- Expired/paused campaigns stop appearing.
- Paid content must be labeled `Sponsored` or `Featured`.
- Advertising must not manipulate organic top-selling rankings.

### 5.6 Organic top-selling rankings
- Define one primary metric and time window per ranking.
- Initial default can be completed eligible app orders over the previous seven days.
- Exclude or adjust cancelled/refunded orders according to policy.
- Separate restaurant and retail rankings.
- Clearly disclose when rankings only cover app transactions or a subset of merchants because POS data is incomplete.
- Never imply total mall sales when only app data is available.

### 5.7 Search and filters
Search merchant name, category, cuisine, product/menu item where available, tags, offer keywords, floor/location. Filters may include category, cuisine, active discount, price, open now, floor, dietary attributes where verified, fulfillment type, and rating if implemented. Results are mall-scoped by default, paginated, and distinguish empty states from network errors.

### 5.8 Discounts
Support percentage, fixed amount, bundle, buy-one-get-one, coupon, and loyalty reward offers. Store terms, dates, eligibility, limits, stacking rules, and applicable products/categories. Backend validates discount at checkout. Expired offers disappear from active lists. Completed transaction terms cannot be silently rewritten.

### 5.9 QR food-court seat sessions
- QR identifies a backend-managed seat/table/zone.
- Validate mall, food court, and seat before starting a session.
- User confirms occupancy or starts a session; QR scan alone is not proof of physical occupancy.
- Seat states: `AVAILABLE`, `OCCUPIED`, `RESERVED` (if enabled), `UNAVAILABLE`, `UNKNOWN`.
- Sessions expire under configurable rules and may be corrected by authorized staff.
- Prevent conflicting active sessions and log state changes.
- Multi-seat tables must be modeled differently from individual seats.
- Physical sensors can later improve accuracy.

### 5.10 Ordering and payment
MVP supports one merchant per order, with pickup and dine-in where available. Backend validates item availability, prices, taxes, fees, discounts, and total. Payment provider callbacks are verified server-side. Use idempotency for order creation and payment processing. Never treat a client success screen as payment proof. Do not store raw card numbers or card security codes. Define cancellation, refund, reconciliation, and settlement policies before launch.

Suggested states: `DRAFT`, `PENDING_PAYMENT`, `PAID`, `AWAITING_MERCHANT`, `ACCEPTED`, `PREPARING`, `READY_FOR_PICKUP`, `COMPLETED`, `CANCELLATION_REQUESTED`, `CANCELLED`, `REFUND_PENDING`, `PARTIALLY_REFUNDED`, `REFUNDED`, `PAYMENT_FAILED`. Enforce valid transitions server-side.

### 5.11 Loyalty
- Use an append-only/auditable ledger rather than editable balance-only storage.
- Track earned, pending, available, redeemed, expired, reversed, and adjusted points.
- Each entry records user, type, amount, related order/reward, timestamp, status, expiry, and reversal reference when applicable.
- Award only after the configured qualifying event.
- Refunds/cancellations trigger policy-based reversal.
- Define eligible spend (e.g. treatment of taxes, fees, discounts) and reward funding.
- Server validates all earning/redemption.
- Distinguish platform-wide, mall-specific, and merchant-specific rewards.

### 5.12 Indoor maps
MVP requires digitized floor plans, destination coordinates, walkable paths, floor transitions, and route calculation. If live indoor positioning is unavailable, users choose a start point or use QR checkpoints. GPS alone is not reliable for precise indoor navigation. Live positioning may require BLE, Wi-Fi positioning, visual positioning, or other suitable infrastructure. 3D maps are optional later.

### 5.13 Parking
- Show only for malls with a supported integration.
- Display zone-level available/occupied counts only when supplied reliably.
- Show last update time and distinguish stale/unavailable data.
- Normalize sensor events and deduplicate them.
- Do not imply parking reservation, entry, or payment merely because availability is displayed.

### 5.14 Events
Manage title, description, image, category, time, location, organizer, registration/ticket link, capacity if applicable, publication status, and reminders. Expired events leave upcoming lists.

### 5.15 Notifications
Support order/payment/refund updates, loyalty activity, opted-in offers, event reminders, and merchant alerts. Marketing consent and preferences are required. Notification delivery failure must not change financial state.

### 5.16 Merchant portal
Manage profile, menu/products, prices, availability, offers, orders, campaign purchases, staff roles, and analytics. Reports clearly separate gross value, discounts, refunds, commissions, provider fees, other fees, and net payable.

### 5.17 Mall administration
Manage mall configuration/capabilities, maps/floors, merchant approvals, categories, events, campaigns, seats, parking integration health, reports, support, and audit logs. Administrators are restricted to assigned malls.

### 5.18 Platform administration
Onboard malls, assign admins, manage global settings, commercial plans, advertising inventory, loyalty policy, integrations, reconciliation, disputes, fraud, and platform analytics.

---

## 6. Monetization
Potential revenue:
1. Sponsored placements.
2. Merchant subscription tiers.
3. Commission on eligible transactions.
4. Mall partnership/integration fees.

Commercial terms must define campaign measurement, payment settlement, refund treatment, reward funding, taxes, and merchant responsibilities. Paid placement must not alter organic rankings.

---

## 7. Growth and guerrilla marketing
Potential campaigns include QR discovery, treasure hunts, limited-time offers, referrals, and event-linked promotions. Measure scans, signups, redemptions, completed purchases, and repeat engagement. Campaigns must be safe, optional, transparent, and approved by mall management.

---

## 8. Design System
Theme: **Midnight Graphite + Emerald**.

| Token | Hex | Usage |
|---|---|---|
| Background | `#101418` | App background |
| Surface | `#191F24` | Cards |
| Elevated surface | `#232B32` | Sheets/menus |
| Primary accent | `#19C37D` | Primary actions |
| Pressed accent | `#12A66A` | Pressed state |
| Highlight | `#F5B942` | Offers/rewards |
| Primary text | `#F5F7F8` | Main text |
| Secondary text | `#A6B0B8` | Supporting text |
| Muted text | `#7E8A94` | Low-priority metadata |
| Divider | `#303A42` | Borders |
| Error | `#FF6464` | Errors |
| Information | `#65B8FF` | Information |

Typography: Inter. Suggested scale: Display 32/700; H1 28/700; H2 24/600; H3 20/600; H4 18/600; body 16/400 and 14/400; labels 13/500; captions 12/400; buttons 15/600; prices 18/700. Respect dynamic font scaling and contrast.

Spacing uses 4-point increments: 4, 8, 12, 16, 24, 32, 48 px. Cards radius 16, buttons/inputs 12, bottom sheet top radius 24. Aim for 44–48 px touch targets. Use one consistent icon family, restrained motion, reduced-motion support, loading/empty/error states, and no color-only status communication.

---

## 9. Technical Direction
- Mobile: React Native, Expo, TypeScript, Expo Router or React Navigation.
- Server state: TanStack Query or equivalent.
- Client state: choose Zustand or Redux Toolkit only where needed.
- Backend: Node.js + TypeScript, preferably NestJS for a modular starting architecture.
- Database: PostgreSQL.
- Optional Redis for caching/rate limiting/queues where justified.
- Merchant/admin portals: Next.js + TypeScript.
- Media: object storage and image optimization.
- Operations: CI/CD, secrets management, monitoring, centralized logs, backups, recovery tests.

Start with a modular monolith rather than microservices unless real scale/team needs justify splitting services.

### Core modules
Identity and access, mall configuration, merchant/catalog, search/discovery, promotions, orders, payments, loyalty, seat sessions, maps, parking integration, events, notifications, analytics, audit/support.

---

## 10. Non-Functional Requirements
- Define performance and availability SLOs before production.
- Initial target: common API reads p95 around 500 ms under expected load, excluding external-provider latency; validate with tests.
- Paginate listings, optimize images, cache safe reads, use bounded retries/timeouts.
- Use indexes and tenant-scoped queries.
- Support English and Urdu, including RTL.
- Respect accessibility and font scaling.
- Keep secrets and sensitive data out of logs.
- Back up critical data and test restoration.
- Monitor payment, order, loyalty, parking, map, and notification failures.

---

## 11. Security and Privacy
- Server-side authorization for every protected operation.
- Least privilege and tenant isolation.
- Stronger authentication for privileged roles where supported.
- Input validation, rate limits, secure transport, parameterized database access, safe upload validation.
- Verify payment callbacks and use idempotency.
- Do not store raw card details.
- Minimize personal/location data, request permissions contextually, define retention, provide account/data request workflows, obtain marketing consent.
- Confirm applicable local consumer, tax, payment, privacy, advertising, and app-store obligations with qualified advisors.

---

## 12. Analytics
Visitor: active users, search-to-click, listing-to-order conversion, completed orders, repeat purchase, points redemption, offer redemption, navigation usage, seat session conversion, retention.

Merchant: active/approved merchants, listing views, campaign impressions/clicks/conversions, order acceptance/fulfillment times, merchant retention.

Platform: revenue by source, gross transaction value, net platform revenue, payment failure/refund rate, acquisition costs, contribution margin, operating cost.

Clearly define each metric and distinguish app transaction data from total offline sales.

---

## 13. QA and Acceptance Criteria
- Mall switching loads correct content and never leaks data.
- Capability settings correctly control visibility and backend access.
- Search, filters, offers, expiry, and pagination work.
- QR seat sessions prevent conflicts and expire safely.
- Payment callbacks cannot duplicate orders or rewards.
- Refund/cancellation policy updates financial and loyalty ledgers.
- Map routes use verified map data and never falsely promise live positioning.
- Parking shows freshness and unavailable states.
- Merchant and mall roles cannot access unauthorized records.
- Audit logs, backups, monitoring, and recovery procedures are tested.
- Representative visitors, merchants, and mall staff complete end-to-end pilot testing.

---

## 14. Risks
- Incomplete merchant data → structured onboarding and verification.
- No POS integration → disclose ranking coverage.
- Poor indoor positioning → start with mapped routes/manual start/QR checkpoints.
- Stale parking sensors → timestamps and degradation states.
- QR occupancy inaccuracies → sessions, staff overrides, optional sensors.
- Payment integration delays → confirm provider/business model early.
- Merchant adoption → prove value with pilot campaigns.
- Loyalty fraud → server-side rules and auditable ledger.
- Per-mall customizations → configuration-driven reusable modules.
- Scope creep → phase advanced features after MVP.

---

## 15. Roadmap
1. **Discovery/Foundation:** validate business model, integrations, maps, merchants, architecture, design.
2. **Core platform:** identity, mall configuration, listings, search, portals.
3. **Commerce:** orders, payments, refunds, loyalty, notifications.
4. **Facilities:** QR sessions, maps/routes, parking where available, events.
5. **Pilot:** limited merchants, staff training, financial reconciliation, usability tests.
6. **Expansion:** additional malls, POS, advanced campaigns, personalization, cross-mall rewards.

Schedule depends on team size, vendor access, map quality, and merchant readiness.

---

## 16. Final Direction
Build a configurable multi-mall platform, pilot the core discovery and commerce workflows at LuckyOne, and add advanced integrations only when the infrastructure and business case are validated. The product's advantage is the reusable platform and reliable connections between visitors, merchants, mall operations, and commerce—not the number of features on the home screen.
