# Mobile Screen Inventory and Navigation Flows

## Global navigation
Bottom tabs: Home, Explore, Map, Rewards, Profile. Tabs may be capability-aware, but avoid changing their order unexpectedly. If a capability is unavailable, show a useful disabled state or omit the specific feature entry according to the product decision.

## Screen inventory

### Onboarding and identity
1. Splash/loading.
2. Optional onboarding slides.
3. Sign in.
4. Create account.
5. Verification.
6. Forgot/reset password.
7. Permission explanations (location/notifications only when relevant).

### Home
8. Home with mall selector.
9. Mall picker/search.
10. Search suggestions.
11. Category shortcuts.
12. Featured/sponsored carousel.
13. Organic top-selling section.
14. Active discounts section.
15. Events section.
16. Facility cards based on capabilities.
17. Empty/error/loading states.

### Explore
18. Explore landing/categories.
19. Search results.
20. Filter bottom sheet.
21. Full restaurant list.
22. Full outlet list.
23. Merchant detail.
24. Menu/product list.
25. Product/item detail, if needed.
26. Offer detail and terms.
27. Favorites.

### Food court
28. Food-court overview.
29. QR scanner permission/scan.
30. Seat confirmation.
31. Active seat session.
32. Seat session ended/expired.
33. Seat help/error (invalid QR, occupied, stale).

### Commerce
34. Cart.
35. Checkout review.
36. Fulfillment selection.
37. Payment provider handoff/return.
38. Payment pending/result.
39. Order confirmation.
40. Order details/tracking.
41. Order history.
42. Cancellation/refund status.

### Maps
43. Mall floor selector.
44. Interactive floor map.
45. Destination search.
46. Destination detail.
47. Route preview.
48. Navigation instructions.
49. Manual start-point selection.
50. Map data unavailable state.

### Parking and events
51. Parking overview (only if capability enabled).
52. Parking zone detail.
53. Parking stale/unavailable state.
54. Event list.
55. Event detail.
56. Event registration handoff, if supported.

### Rewards and profile
57. Rewards dashboard.
58. Loyalty ledger.
59. Reward detail/redemption.
60. Profile.
61. Settings/preferences.
62. Notification preferences.
63. Help/support.
64. Privacy/account deletion.

## Primary user flows

### Discover a restaurant
Home → search/category → results → merchant detail → menu → item → cart.

### Purchase
Cart → server quote → checkout → payment provider → server-confirmed status → merchant acceptance → order tracking → completion → loyalty award according to policy.

### Switch mall
Mall selector → select mall → load new configuration → refresh mall-scoped screens → clear/revalidate incompatible cart and facility state.

### QR seat session
Food Court → scan QR → server resolves seat → display state → confirm/start session → active session → end/expire.

### Navigate
Map → search destination → choose destination → choose current/manual start point → route preview → follow directions. Live location is optional and only enabled when supported.

### Redeem reward
Rewards → choose reward → review terms → server validates eligibility/balance → idempotent redemption → show confirmation.

## Screen-state requirements
Every network-backed screen should define loading, content, empty, recoverable error, and unavailable states. Financial screens also need pending and confirmed states. Never display a payment as successful solely because the app returned from a provider screen.
