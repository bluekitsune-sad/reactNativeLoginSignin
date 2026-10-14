# Merchant, Mall Admin, and Platform Admin Portals

## 1. Merchant portal

### Navigation
Overview, Orders, Catalog, Promotions, Campaigns, Analytics, Team, Settings, Help.

### Overview
- Today's orders and sales from defined data sources.
- Pending orders.
- Active campaigns.
- Listing approval status.
- Recent performance and operational alerts.

### Orders
- Filter by state/date.
- View item snapshots, fulfillment method, payment state, and customer-provided instructions.
- Accept/reject only under documented policy.
- Update allowed order states.
- Mark ready for pickup and completed when appropriate.
- Cancellation/refund actions require authorization and state validation.
- Do not expose full payment credentials.

### Catalog
- Create/edit products or menu items.
- Manage prices, images, options, availability, and descriptions.
- Changes affecting active orders must not mutate historical order snapshots.
- Some fields may require mall approval.

### Promotions/campaigns
- Create discount rules and terms.
- Request paid placements.
- Show inventory, schedule, price, approval status, and billing terms.
- Report impressions, clicks, attributable orders, and measurement window.
- Define attribution and bot filtering.

### Team and permissions
- Owner: full merchant scope, subject to platform policies.
- Manager: catalog, promotions, orders, permitted reports.
- Staff: operational orders only unless granted more.
- Revocation must take effect server-side.

### Reporting
Clearly define gross order value, discounts, refunds, taxes, provider fees, platform commission, other fees, and net payable. Reports must state source and coverage; app orders are not the same as all in-store sales.

## 2. Mall admin portal

### Navigation
Mall Overview, Merchants, Categories, Capabilities, Maps/Floors, Food Court, Parking, Events, Campaigns, Reports, Support, Audit.

### Responsibilities
- Manage mall profile and operating information.
- Approve/reject merchant applications.
- Configure feature capability status and integration health.
- Manage map versions, floors, destinations, and route graph publication.
- Manage QR seats and authorized overrides.
- Publish events and approve campaigns.
- View mall-scoped aggregate analytics.
- Handle reports and customer escalations.

### Controls
- Admin must be assigned to the mall.
- Capability changes require audit records.
- Map publication should validate coordinates and graph connectivity.
- Campaign approval and merchant approval must record actor/time/reason.
- Financial records cannot be silently edited.
- Integration secrets are never displayed; use secret references and controlled rotation.

## 3. Platform admin portal

### Navigation
Malls, Global Merchants/Policy, Roles, Commercial Plans, Advertising Inventory, Loyalty Policy, Integrations, Payments/Reconciliation, Risk, Platform Analytics, Audit.

### Responsibilities
- Onboard and suspend malls.
- Assign mall admins.
- Configure global policies and defaults.
- Manage integration catalog and environment-specific configuration.
- Review payment/refund/reconciliation exceptions.
- Manage commercial plans and platform-wide campaign rules.
- Investigate fraud and abuse.
- Manage data retention and support escalation policy.

### Least privilege
Platform administrator is a high-risk role. Prefer scoped permissions (e.g. `mall:manage`, `payment:reconcile`, `campaign:approve`) over one unrestricted role. Sensitive operations should require re-authentication or additional approval where appropriate.

## 4. Shared portal UX rules
- Responsive layouts.
- Accessible tables and keyboard navigation.
- Confirm destructive actions.
- Show loading, empty, error, and success states.
- Use server pagination for large tables.
- Export only permitted fields and audit exports.
- Avoid showing personally identifiable visitor data unless necessary for the task.
