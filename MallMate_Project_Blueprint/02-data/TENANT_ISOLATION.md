# Tenant Isolation and Authorization Rules

## 1. Core rule
Every request must establish the actor, role/membership scope, target resource, and tenant scope. Client-supplied `mallId` or `merchantId` is a selector, not proof of authorization.

## 2. Required authorization checks
- Visitor: may read published public listings; may read/update only their own profile, orders, loyalty account, favorites, and sessions.
- Merchant member: may access only their assigned merchant and only actions permitted by their merchant role.
- Mall administrator: may access only explicitly assigned mall(s).
- Platform administrator: may perform platform-wide actions according to audited permissions.
- Support/finance roles: scoped to specific tasks; do not grant broad access by convenience.

## 3. Request pattern
1. Authenticate request.
2. Load current membership/role from trusted server-side data.
3. Resolve target resource.
4. Derive resource mall/merchant scope from database, not request body alone.
5. Verify membership and capability.
6. Apply operation.
7. Write audit event for privileged or sensitive changes.
8. Return only permitted fields.

## 4. Never trust
- Hidden buttons or client route guards.
- A `mallId` sent by the mobile client.
- A merchant ID in a submitted order without validating catalog ownership.
- Client-calculated prices, discounts, taxes, commissions, points, or payment status.
- Client claims that payment succeeded.
- A QR code alone as proof of physical occupancy.

## 5. Database protections
- Foreign keys should prevent cross-tenant relationship mistakes.
- Index `(mall_id, status)` and other query-specific scope keys.
- Consider PostgreSQL row-level security as defense in depth after policies are tested.
- Do not assume row-level security replaces application authorization.
- Tests must attempt cross-mall and cross-merchant reads/writes.

## 6. Audit
Audit role changes, capability changes, merchant approvals, campaign approvals, map publications, financial adjustments, refunds, loyalty adjustments, seat overrides, and integration configuration changes. Exclude passwords, tokens, card details, and unnecessary personal data from logs.
