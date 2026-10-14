# Technical Specification

## 1. Architecture choice
Use a modular monolith for the first production version. Keep domain modules and integration adapters isolated so they can be split later if scale or ownership boundaries justify it.

### Logical layers
1. **Clients:** Expo mobile app, merchant portal, mall/platform admin portal.
2. **API:** REST API, authentication middleware, request validation, rate limiting, versioning.
3. **Application modules:** identity, mall config, catalog, search, promotions, orders, payments, loyalty, seats, maps, parking, events, notifications, analytics.
4. **Persistence:** PostgreSQL, object storage, optional Redis/queue.
5. **External adapters:** payment provider, parking vendor, POS, push notifications, maps/geospatial provider.

## 2. Suggested stack
- Mobile: React Native + Expo + TypeScript.
- Navigation: choose Expo Router or React Navigation.
- Server state: TanStack Query.
- Client state: Zustand or Redux Toolkit, not both by default.
- Backend: NestJS + TypeScript.
- Database: PostgreSQL with migrations.
- Web portals: Next.js + TypeScript.
- Testing: Jest/Vitest, API integration tests, mobile end-to-end tests as appropriate.
- Observability: structured logs, error tracking, metrics, alerts.
- Media: object storage plus CDN/image transformations.

## 3. Module boundaries
- **Identity:** users, sessions, verification, role memberships.
- **Mall configuration:** malls, capability registry, operating hours, configuration versions.
- **Merchant/catalog:** merchant profiles, categories, menus, products, prices, availability.
- **Discovery:** search, tags, filters, organic rankings.
- **Promotions:** discounts, sponsored inventory, campaign approvals, reporting.
- **Orders:** cart validation, order lifecycle, fulfillment.
- **Payments:** provider intents, callbacks, refunds, reconciliation, settlements.
- **Loyalty:** points ledger, policies, redemption, expiry and reversal.
- **Seat sessions:** QR identifiers, seat state, session expiry, staff overrides.
- **Maps:** floors, points of interest, route graph, publication.
- **Parking:** provider adapter, normalized snapshots, freshness status.
- **Events:** publication, registration links, reminders.
- **Notifications:** templates, consent, delivery attempts.
- **Admin/audit:** approvals, permission changes, audit events.
- **Analytics:** defined event collection and aggregate reporting.

## 4. API conventions
- Base path: `/api/v1`.
- JSON request/response bodies.
- ISO 8601 UTC timestamps in API payloads.
- UUIDs for externally visible identifiers.
- Cursor pagination for large or changing lists.
- Standard error envelope; never return stack traces to clients.
- `Idempotency-Key` for order/payment/redeem operations where applicable.
- Correlation/request ID for logs and support.
- Validate payloads at API boundaries.
- Use explicit DTOs; do not expose ORM models directly.

### Example success
```json
{
  "data": { "id": "uuid", "status": "ACTIVE" },
  "meta": { "requestId": "req_..." }
}
```

### Example error
```json
{
  "error": {
    "code": "CAPABILITY_DISABLED",
    "message": "This feature is not available at the selected mall.",
    "details": {}
  },
  "meta": { "requestId": "req_..." }
}
```

## 5. Configuration and capabilities
Store capability status per mall. Backend checks the capability for every relevant operation; frontend uses a public configuration response to decide which navigation/cards to show. Use a configuration version and publish workflow. `DISABLED` means not offered; `DEGRADED` means offered with explicit limitation; `ENABLED` means operational. Integrations can additionally report health/freshness.

## 6. Environments
- Local development.
- Shared development.
- Staging/UAT.
- Production.

Separate databases, credentials, payment credentials, storage buckets, and push notification configuration by environment. Use sandbox payment accounts in development/staging.

## 7. Deployment
- CI: lint, type-check, unit tests, API tests, dependency/security checks.
- CD: deploy staging automatically after passing checks; production deployment gated by review.
- Use backward-compatible database migrations and a rollback plan.
- Expo EAS or an equivalent controlled build/release process for mobile.
- Store secrets in a secret manager, never in source control.
- Feature flags and capability settings must be auditable.

## 8. Architecture non-goals
Do not start with microservices, a custom payment processor, custom parking hardware, or guaranteed indoor positioning. Introduce those only when justified by validated requirements.
