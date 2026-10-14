# Open Decisions — Resolve Before Implementation

These decisions materially affect scope, cost, schema, and commercial/legal responsibility.

## P0 — Blockers
1. **Payment model:** Does the platform process payments for merchants, use provider marketplace/connected accounts, or redirect to each merchant's own checkout?
2. **Merchant settlement:** Who receives funds, calculates commissions, issues refunds, and reconciles payouts?
3. **Payment methods:** Which Pakistan-supported provider and methods are available under the intended business model?
4. **Mall permissions:** Can the project obtain official LuckyOne branding, merchant directory, floor plans, map data, and infrastructure access?
5. **Ordering scope:** Pickup only, food-court dine-in, or both for the first pilot?
6. **Loyalty funding:** Platform-funded, mall-funded, merchant-funded, or mixed? What is the redemption value and liability?
7. **Data coverage:** Will organic rankings include app orders only or POS sales too?
8. **Merchant onboarding:** Who verifies tenancy, identity, and payout details?

## P1 — MVP design decisions
9. Seat model: individual seat, table, or seating zone? How will staff handle incorrect occupancy?
10. QR codes: static permanent identifiers or revocable tokens? Who can reissue them?
11. Map data: who supplies CAD/floor plans and who verifies routes on-site?
12. Navigation: manual start point/QR checkpoints first, or an available indoor positioning vendor?
13. Parking integration: provider, event format, refresh frequency, and stale-data threshold.
14. Merchant catalog: who enters and maintains menus/products and prices?
15. Discounts: stacking, minimum spend, caps, and refund treatment.
16. Cancellation: at which order states may users/merchants cancel?
17. Ranking: order count, units sold, or sales value? Define time window and low-volume behavior.
18. Sponsored inventory: fixed schedule, auction, package, or manual campaign sales?
19. Mall admin scope: one admin can manage one mall or multiple assigned malls?
20. Support: who handles payment disputes, order complaints, and fraud reports?

## P2 — Scale and experience
21. English and Urdu at launch?
22. Guest checkout or account required for all purchases?
23. Cross-mall points or separate mall reward balances?
24. POS integration standards and first target merchant system?
25. Customer reviews/ratings in MVP or later?
26. Reservation and waitlist requirements?
27. Data retention and account deletion policy?
28. Analytics and campaign attribution definitions?
29. Accessibility requirements and accessible map data availability?
30. Hosting region, data residency, recovery objectives, and expected peak traffic?

## Decision log template
For each decision record:
- Decision ID
- Question
- Options considered
- Selected option
- Rationale
- Owner
- Date
- Impacts on API/schema/UI
- Follow-up action
