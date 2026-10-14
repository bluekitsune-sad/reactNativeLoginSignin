# Security, QA, and Deployment Checklist

## Security
- [ ] Authentication provider and session model selected.
- [ ] Role/permission matrix reviewed.
- [ ] Every endpoint checks tenant scope.
- [ ] Cross-mall and cross-merchant tests pass.
- [ ] Rate limits on login, QR, search, checkout, and redemption.
- [ ] Secrets stored in a secret manager.
- [ ] No secrets committed or bundled in mobile app.
- [ ] Payment callbacks signature-verified and replay-protected.
- [ ] Idempotency implemented for financial operations.
- [ ] Upload type/size validation and safe storage.
- [ ] Logs exclude tokens, passwords, card data, and unnecessary personal data.
- [ ] Dependency scanning and update process established.
- [ ] Admin actions and financial adjustments audited.
- [ ] Account deletion and retention processes documented.

## QA test matrix
### Mall/config
- Switch mall while browsing.
- Switch mall with a cart.
- Disabled/degraded capability behavior.
- Stale configuration cache.
- Unpublished merchant hidden.

### Search/catalog
- Empty query and special characters.
- No results vs network failure.
- Pagination and duplicate items.
- Expired promotion.
- Price changed between viewing and checkout.
- Unsupported category/filter values.

### Orders/payments
- Success, decline, timeout, delayed webhook.
- Duplicate webhook.
- Client closes app during payment.
- Provider redirect succeeds but webhook is delayed.
- Duplicate submit.
- Partial/full refund.
- Merchant rejection.
- Invalid state transition.
- Reconciliation mismatch.

### Loyalty
- Award once.
- Duplicate award event.
- Refund reversal.
- Concurrent redemptions.
- Expired points.
- Insufficient balance.
- Reward eligibility changes.
- Audited manual adjustment.

### Facilities
- Invalid/revoked QR.
- Conflicting seat session.
- Session expiry.
- Staff override.
- Stale parking snapshot.
- Impossible sensor counts.
- Disconnected map graph.
- Accessible route unavailable.
- Location permission denied.

### Access control
- Visitor requests another user's order.
- Merchant requests another merchant's catalog/orders.
- Mall admin requests another mall.
- Staff attempts finance action.
- Revoked membership continues using old token.

## Deployment
- [ ] Separate development/staging/production environments.
- [ ] Separate sandbox and production payment credentials.
- [ ] Database migrations are reviewed and backward-compatible.
- [ ] Automated backup and restoration test.
- [ ] Monitoring and alerts for API errors, payments, orders, loyalty, integrations.
- [ ] Mobile crash/error monitoring.
- [ ] Feature flags/capabilities have audit history.
- [ ] Rollback process documented.
- [ ] Incident owner and escalation contacts defined.
- [ ] Privacy policy, terms, refund rules, merchant agreements reviewed.
