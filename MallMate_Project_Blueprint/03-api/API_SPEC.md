# REST API Specification (Initial Contract)

This is a proposed endpoint contract, not a fully generated OpenAPI document. Exact schemas and error codes should be formalized before implementation.

## Conventions
- Base path: `/api/v1`
- JSON, UTF-8.
- UUID identifiers.
- UTC ISO-8601 timestamps.
- Cursor pagination: `?limit=20&cursor=...`
- Search query: `q=...`
- Use `Idempotency-Key` for order creation, payment initiation, seat session start, and loyalty redemption where relevant.
- Require authenticated bearer/session credentials for protected routes.
- Every endpoint enforces authorization and tenant scope server-side.

## Common response envelopes
```json
{
  "data": {},
  "meta": { "requestId": "req_example" }
}
```
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted information.",
    "details": {}
  },
  "meta": { "requestId": "req_example" }
}
```

## Public discovery and mall configuration
| Method | Path | Purpose |
|---|---|---|
| GET | `/malls` | List published malls |
| GET | `/malls/:mallId` | Public mall details |
| GET | `/malls/:mallId/configuration` | Public capabilities and configuration version |
| GET | `/malls/:mallId/categories` | Categories |
| GET | `/malls/:mallId/merchants` | Search/list merchants; filters and cursor |
| GET | `/malls/:mallId/merchants/:merchantId` | Merchant details |
| GET | `/malls/:mallId/merchants/:merchantId/catalog` | Menu/products |
| GET | `/malls/:mallId/promotions` | Active public promotions |
| GET | `/malls/:mallId/rankings` | Defined organic rankings with metric/window metadata |
| GET | `/malls/:mallId/events` | Published events |
| GET | `/malls/:mallId/floors` | Published floors |
| GET | `/malls/:mallId/points-of-interest` | Searchable map destinations |
| GET | `/malls/:mallId/parking` | Parking snapshot, only if capability is enabled |

### Merchant list query examples
`GET /api/v1/malls/{mallId}/merchants?q=coffee&category=cafe&discountOnly=true&floor=1&sort=relevance&limit=20`

Supported parameters should be validated and documented. Do not accept arbitrary sort SQL or field names from clients.

## Identity and visitor
| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Authenticate |
| POST | `/auth/logout` | End session |
| POST | `/auth/verify` | Verify configured email/phone flow |
| POST | `/auth/password/forgot` | Start recovery |
| POST | `/auth/password/reset` | Complete recovery |
| GET | `/me` | Current profile |
| PATCH | `/me` | Update permitted profile fields |
| DELETE | `/me` | Request account deletion |
| GET | `/me/orders` | Own order history |
| GET | `/me/loyalty` | Own balances and ledger |
| GET | `/me/favorites` | Own favorites |
| PUT/DELETE | `/me/favorites/:merchantId` | Save/remove favorite |
| GET/PATCH | `/me/notification-preferences` | Read/update preferences |

Use the chosen identity provider's recommended secure flow rather than inventing a password protocol.

## Seat sessions
| Method | Path | Purpose |
|---|---|---|
| GET | `/malls/:mallId/seats/qr/:token` | Resolve valid QR token to public seat details |
| POST | `/malls/:mallId/seats/:seatId/sessions` | Start session; idempotent |
| GET | `/me/seat-sessions/active` | Current user's active session |
| POST | `/seat-sessions/:sessionId/end` | End/release session |
| POST | `/admin/malls/:mallId/seats/:seatId/override` | Authorized staff correction |

Never embed secrets or private user data in a QR URL. Use random, revocable identifiers or signed/opaque tokens and validate server-side.

## Orders and payments
| Method | Path | Purpose |
|---|---|---|
| POST | `/orders/quote` | Validate cart and return authoritative totals |
| POST | `/orders` | Create order using idempotency |
| GET | `/orders/:orderId` | Authorized order details |
| GET | `/me/orders` | Visitor order history |
| POST | `/orders/:orderId/cancel` | Request cancellation if allowed |
| POST | `/orders/:orderId/payment-intent` | Create provider payment flow |
| POST | `/webhooks/payments/:provider` | Provider callback; signature verification |
| POST | `/orders/:orderId/refunds` | Authorized refund request |
| GET | `/me/orders/:orderId/receipt` | Own receipt, if supported |

Webhook routes use provider-specific signature verification and replay protection. Webhook payloads must be idempotently processed. Do not trust a client to set order status to `PAID` or `COMPLETED`.

## Merchant endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/merchant/me` | Current merchant context |
| PATCH | `/merchant/me/profile` | Update permitted profile fields |
| CRUD | `/merchant/catalog/items` | Manage items/menu entries |
| GET | `/merchant/orders` | Merchant-scoped orders |
| POST | `/merchant/orders/:orderId/accept` | Accept order |
| POST | `/merchant/orders/:orderId/reject` | Reject under policy |
| POST | `/merchant/orders/:orderId/status` | Validated status transition |
| CRUD | `/merchant/promotions` | Manage promotions |
| POST | `/merchant/campaigns` | Request/purchase campaign |
| GET | `/merchant/analytics` | Authorized merchant reports |
| CRUD | `/merchant/members` | Manage employee membership |

## Loyalty
| Method | Path | Purpose |
|---|---|---|
| GET | `/me/loyalty` | Balances and policy summary |
| GET | `/me/loyalty/transactions` | Ledger history |
| GET | `/rewards` | Available rewards in current scope |
| POST | `/rewards/:rewardId/redeem` | Redeem; idempotent |
| POST | `/internal/loyalty/order-events` | Internal trusted event handler, not public client API |

Award/reversal operations should normally be triggered by trusted order/payment domain events, not directly by the mobile client.

## Mall/platform administration
Use `/admin/malls/:mallId/...` for mall-scoped resources and `/platform/...` for platform-wide administration. Include endpoints for capabilities, merchant approvals, categories, floor/map publication, seat management, events, campaigns, integration health, reports, and audit logs. Every route requires explicit role and scope checks.

## HTTP status guidance
- `200` read/update success.
- `201` created.
- `202` accepted asynchronous operation.
- `204` successful no-content deletion/update.
- `400` malformed request.
- `401` unauthenticated.
- `403` authenticated but unauthorized.
- `404` absent or intentionally concealed resource.
- `409` state conflict/idempotency conflict.
- `422` business-rule validation failure.
- `429` rate limit.
- `500` generic server failure.
- `503` dependent capability temporarily unavailable.

## API acceptance tests
- Cross-tenant attempts fail.
- Disabled capability endpoints do not perform the operation.
- Stale price/offer checkout is rejected or requoted.
- Duplicate idempotency keys return the original outcome or a defined conflict.
- Invalid webhook signatures fail.
- Invalid state transitions fail.
- Responses never leak stack traces or secret values.
