# Delivery Roadmap and Initial Backlog

## Phase 0 — Product validation
- [ ] Confirm legal/commercial entity and marketplace role.
- [ ] Interview mall management and 5–10 prospective merchants.
- [ ] Obtain permission and data for LuckyOne directory, floor plans, and parking interface.
- [ ] Select payment provider and confirm supported payment/marketplace settlement model.
- [ ] Define loyalty funding and point liability.
- [ ] Choose pilot success metrics.
- [ ] Finalize MVP scope and user flows.

**Exit:** critical business and integration assumptions are documented and owned.

## Phase 1 — Foundation
- [ ] Monorepo and CI setup.
- [ ] TypeScript/lint/format/test standards.
- [ ] Database migrations and seed data for local development.
- [ ] Authentication and role membership.
- [ ] Mall configuration and capability APIs.
- [ ] Audit logging.
- [ ] Design tokens and base mobile components.
- [ ] Environments, secrets, and logging.

**Exit:** secure development foundation and one sample mall.

## Phase 2 — Discovery
- [ ] Mall selector.
- [ ] Capability-driven home screen.
- [ ] Categories and merchant directory.
- [ ] Merchant profile and catalog.
- [ ] Search, filters, pagination.
- [ ] Offers and sponsored label.
- [ ] Organic ranking with metric disclosure.
- [ ] Merchant portal listing management.
- [ ] Mall admin merchant approval.

**Exit:** user can discover published businesses across multiple configured malls.

## Phase 3 — Commerce and loyalty
- [ ] Cart and authoritative quote.
- [ ] Single-merchant order model.
- [ ] Payment provider sandbox.
- [ ] Verified webhook processing.
- [ ] Merchant order queue.
- [ ] Cancellation/refund workflows.
- [ ] Loyalty ledger, award, reversal, redemption.
- [ ] Order notifications and history.
- [ ] Reconciliation reports.

**Exit:** test purchase reconciles end-to-end, including failure and refund cases.

## Phase 4 — Facilities
- [ ] QR seat management.
- [ ] Session expiry and staff override.
- [ ] Floor and POI admin.
- [ ] Route graph and route preview.
- [ ] Parking provider adapter if data is available.
- [ ] Events module.
- [ ] Integration health states.

**Exit:** every enabled facility has verified data and operational ownership.

## Phase 5 — Pilot/UAT
- [ ] Test with representative devices.
- [ ] Test poor network and interrupted checkout.
- [ ] Cross-tenant authorization review.
- [ ] Merchant training.
- [ ] Customer support and escalation process.
- [ ] Backup restoration drill.
- [ ] Security review.
- [ ] Pilot analytics dashboard.
- [ ] Launch approval and rollback plan.

## Phase 6 — Expansion
- [ ] Add further malls via configuration.
- [ ] POS integration pilot.
- [ ] Advanced campaign analytics.
- [ ] Queue management.
- [ ] Referral/treasure hunt experiments.
- [ ] Cross-mall loyalty after funding/settlement policy.
- [ ] Indoor positioning only if infrastructure supports it.

## Definition of done for each feature
- Requirements and error states defined.
- Authorization/tenant scope tested.
- Unit and integration tests added.
- Loading, empty, stale, and error states handled.
- Analytics events documented.
- Privacy impact considered.
- Monitoring/alerts added for critical flows.
- Documentation and support instructions updated.
- Product owner acceptance recorded.
