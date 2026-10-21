# TODO

Living backlog for this repository. Move items to **Done** when finished.
todoAgent (the daily workflow) picks **one** item from the topmost section
that has actionable work — start with the MallMate section below.

## MallMate — mobile roadmap (top priority)

This repo is becoming the **MallMate** multi-mall app. The full blueprint
lives in [`MallMate_Project_Blueprint/`](./MallMate_Project_Blueprint/README.md)
(PRD, API spec, ERD, screen inventory, design system).

Rules for the factory:

- Work top-down; one item per task, following the blueprint docs linked in
  each item. Keep changes small and verifiable; update this file and the
  README footer when done.
- **All items below are mobile UI on mock data** (mock data lives in
  `src/constants/` or a new `src/mock/`). No backend, no real payments.
- **If the top item needs something blocked or missing (owner decision,
  API keys, mall/map data), leave it unchecked, say why briefly in the PR
  body, and take the next actionable item instead.** The queue must keep
  moving without waiting.

### Stage A — foundation

- [x] **Load the Inter font family** for MallMate typography (bundled TTF
      or `@expo-google-fonts/inter`) in `App.js`, exposed through
      `Fonts.js`. Blueprint: `04-mobile/DESIGN_SYSTEM.md`. (Done via
      `@expo-google-fonts/inter`: Inter 400/500/600/700 added to
      `CustomFonts.js` so `App.js`'s `useFonts` loads them; names exposed in
      `Fonts.js`; `Theme.js` `fontFamily` now maps to the concrete loaded
      font names.)
- [x] **MallMate base component kit** in `src/components/mallmate/`:
      Button (default/pressed/disabled/loading), TextInput, Card,
      SectionHeader, ListRow, Badge ("Sponsored"/"Featured"), StatusChip,
      EmptyState, ErrorState (with retry), LoadingState. Theme theming from
      `Theme.js` only; 44–48px touch targets; export via the barrel.
      Blueprint: `04-mobile/DESIGN_SYSTEM.md` component states. (Done: all
      10 components + `mallmate/index.js` barrel, re-exported from
      `src/components/index.js`; pressed/disabled/loading/focused/invalid
      states implemented per the design system.)
- [x] **Bottom tab navigation**: Home | Explore | Map | Rewards | Profile
      with placeholder screens (`src/screens/home/HomeScreen.js`, etc.),
      keeping the existing auth stack; after successful sign-in navigate to
      the tabs. Blueprint: `04-mobile/SCREEN_INVENTORY.md`, PRD section 4.
      (Done: `MainTabNavigator` with themed tab bar + Ionicons; placeholders
      under `src/screens/{home,explore,map,rewards,profile}/`; stack screen
      `Main`; `SigninScreen` uses `navigation.replace("Main")` on success.)
- [x] **Mall selector screen** with mock data for one mall (LuckyOne:
      name/logo/hours); persist the selection in a small `MallContext`
      readable by other screens. Blueprint: PRD section 5.2. (Done:
      `src/mock/malls.js` (LuckyOne + mock capability map, logo as
      placeholder initial — real branding is blocked pending permission),
      `MallProvider`/`useMallManagement` in `src/utils/mallData.js` with
      AsyncStorage persistence via new `StorageService` mall helpers,
      `MallSelectorScreen` stack route, current-mall bar on Home.)
- [x] **Capability-driven home skeleton**: render only ENABLED capability
      cards for the selected mall (use `src/constants/Capabilities.js` and
      mock config); hide DISABLED, label DEGRADED. Blueprint: PRD 5.3.
      (Done: `CapabilityMeta` title/description/icon registry +
      `CapabilityCard` kit component with "Limited" StatusChip for
      DEGRADED; Home grids ENABLED/DEGRADED cards from the selected
      mall's mock capability map, hides DISABLED, empty fallback.)
- [x] **Typed API client helper**: axios wrapper using `ApiContants` base
      URL and the services error envelope `{status, message, data}`;
      document it in AGENTS.md. Blueprint: `03-api/API_SPEC.md`. (Done:
      `src/services/apiClient.js` — shared axios instance + `get`/`post`/
      `put`/`patch`/`del` that never throw and always resolve to the
      envelope; typed as `ApiEnvelope` in `src/types/api.ts`; barrel
      export; usage documented in AGENTS.md "API client helper".)

### Stage B — identity and profile

- [x] **Re-skin the auth screens** (Signin, Signup, ForgotPassword) to the
      MallMate theme + Inter (replace Colors.js usage with `Theme.js` on
      those screens only; behaviour unchanged). Blueprint: DESIGN_SYSTEM.
      (Done: all three screens use `MallMateTheme` tokens + Inter via
      `Theme.fontFamily`; dark Midnight Graphite background, emerald
      primary CTAs via the kit `Button` (loading state kept), 44–48px
      back targets; validation, service calls and navigation unchanged.)
- [x] **Profile tab**: profile header (mock user), rows for Orders,
      Favorites, Settings, Help, Privacy — placeholders that navigate.
      Blueprint: SCREEN_INVENTORY 60–64. (Done: profile header shows the
      signed-in user (or a mock guest) with avatar initial; ListRow
      entries for Orders/Favorites/Settings/Help/Privacy navigate to a
      shared `ProfilePlaceholderScreen` stack route.)
- [x] **Settings + notification preferences**: static toggles with marketing
      consent wording; local state only. Blueprint: PRD 5.15. (Done:
      `SettingsScreen` with local `useState` toggles for order/payment
      updates, loyalty activity, event reminders, merchant alerts, plus an
      optional marketing-offers consent row; Profile → Settings navigates
      there. No persistence or backend sync yet.)

### Stage C — home and discovery

- [x] **Multi-mall mock data + switching**: add a second mock mall with a
      different capability map; switching refreshes mall-scoped screens,
      shows the new mall identity, and never leaks previous-mall content.
      Blueprint: PRD 5.2, SCREEN_INVENTORY flow "Switch mall". (Done:
      second mock mall `Harbour Walk Plaza` with a retail/events-only
      capability map; `selectMall` always re-resolves from `MALLS` by
      slug; Home remounts its content via `key={slug}` and shows the new
      name/address/hours.)
- [x] **Home content sections (mock)**: category shortcuts,
      featured/sponsored carousel with visible "Sponsored" badge, active
      discounts section, events section — all driven by mock data and
      capability flags. Blueprint: SCREEN_INVENTORY 11–16, PRD 5.5.
      (Done: `src/mock/homeContent.js` holds per-mall mock categories,
      sponsored/featured campaigns, discounts and events; each entry is
      capability-gated and expired campaigns/offers are filtered by date;
      HomeScreen renders Browse chips, a Featured carousel with mandatory
      Sponsored/Featured badges, Active discounts and Events sections —
      tapping any of them routes to the Explore tab placeholder for now.)
- [x] **Explore landing**: categories grid/list + entries to restaurant and
      outlet lists. Blueprint: SCREEN_INVENTORY 18. (Done: ExploreScreen
      shows a mall-scoped search entry point, capability-gated directory
      ListRows — Restaurants, Outlets, Food court, Offers, Events — and a
      category grid; entries route to the existing placeholder stack screen
      until list screens land. Mock explore directories/categories added per
      mall in `src/mock/homeContent.js` via `getExploreContent`.)
- [x] **Search UI**: search bar, suggestion rows, results list (mock),
      distinct empty-results vs error states. Blueprint: PRD 5.7,
      SCREEN_INVENTORY 10, 19. (Done: `SearchScreen` stack route with kit
      TextInput, debounced mock search over per-mall merchants
      (`src/mock/merchants.js` — name/category/cuisine/tags/offer keywords,
      capability-gated), suggestion rows when idle, Loading/Error/Empty
      states; query `!error` simulates a recoverable failure so the error +
      retry path is reachable. Explore's search bar now opens Search.)
- [x] **Filter bottom sheet**: category, cuisine, open-now, floor, price —
      mock filtering applied client-side; "clear filters" affordance.
      Blueprint: SCREEN_INVENTORY 20. (Done: kit `FilterSheet` Modal
      bottom sheet with pill option groups + Clear all/Show N footer;
      Search results gained a Filters button with active-count badge and a
      Clear-filters text action. Options are derived from the current mock
      result set; filtering is pure client-side via
      `applyMerchantFilters`. Filtered-empty is a distinct state from
      unfiltered empty.)
- [x] **Restaurant list + outlet list screens** with pagination pattern and
      loading/empty/error states (mock pages). Blueprint: SCREEN_INVENTORY
      21–22. (Done: shared `MerchantListScreen` registered as
      `RestaurantList`/`OutletList` stack routes; Explore directories for
      restaurants/outlets now navigate there. Mock
      `fetchMerchantListPage` paginates capability-gated merchants
      (page size 4, simulated latency, first attempt per mall+kind fails
      once so error+retry is reachable); infinite scroll with inline
      load-more retry, pull-to-refresh, capability-unavailable and
      empty-list states. Extra mock merchants added so lists span
      multiple pages.)
- [x] **Merchant detail page**: name, logo, category, floor/location,
      hours + open-now status, active offers, tags, contact placeholder,
      map-destination link placeholder. Blueprint: PRD 5.4, SCREEN_INVENTORY
      23. (Done: `MerchantDetailScreen` registered as `MerchantDetail`,
      mall-scoped via `getMerchantDetail` mock resolver — initials logo
      placeholder (branding blocked), open-now StatusChip + hours card,
      tags, active offers with expired ones filtered upstream, placeholder
      contact rows with an approval note, map-destination and menu
      placeholder rows. Entry points rewired: merchant lists and search
      results now open the detail page.)
- [x] **Menu/product list + item detail** for a mock merchant (sections,
      item cards, price display with tabular numerals). Blueprint:
      SCREEN_INVENTORY 24–25. (Done: `MenuScreen` + `MenuItemScreen`
      registered as `Menu`/`MenuItem`; mock menus with sections/items for
      four LuckyOne merchants (`src/mock/menus.js`), `formatPrice`
      (PKR grouping) with `fontVariant: tabular-nums`, sold-out chip and
      availability status, browse-only notes (ordering blocked). Merchant
      detail "View menu" row now opens the menu.)
- [x] **Offer detail + terms sheet**: discount types (%, fixed, BOGO) as
      mock offers with dates/eligibility/terms shown; expired offers hidden.
      Blueprint: PRD 5.8, SCREEN_INVENTORY 26. (Done: shared offer
      catalogue `src/mock/offers.js` (PERCENTAGE/FIXED_AMOUNT/BOGO with
      validity, eligibility, terms; expired hidden by every resolver —
      Home discounts and merchant offers now resolve into it, removing
      the earlier duplicated offer summaries). `OfferDetailScreen`
      registered as `OfferDetail`: headline by type, merchant link,
      validity dates, eligibility list, terms bottom sheet; expired id
      shows an unavailable state. No redemption logic.)
- [x] **Favorites tab**: local favorites (AsyncStorage) for mock merchants,
      empty state. Blueprint: SCREEN_INVENTORY 27. (Done: it's a stack
      screen, not a new bottom tab — the tab bar order is fixed by the
      blueprint. `FavoritesProvider` context persists merchant ids via
      `StorageService` ("favoriteMerchantIds"); merchant detail header
      heart toggles a favorite; Profile → Favorites opens the list
      (mall-scoped rows, remove via trailing heart, empty state explains
      how to save).)
- [x] **Organic top-selling section** on Home using MOCK numbers with the
      mandatory disclosure ("based on app orders only"), separated
      restaurant vs retail. Presentation only — no ranking logic (blocked).
      Blueprint: PRD 5.6, SCREEN_INVENTORY 13. (Done: `topSelling` mock
      block per mall in `src/mock/homeContent.js` (disclosure + separate
      restaurant/retail lists), capability-gated via `getHomeSections`;
      HomeScreen "Popular now" section renders ranked mock rows with the
      mandatory "Based on completed app orders only… Not total mall sales"
      disclosure. No ranking computation.)

### Stage D — food court (presentation only; session logic is blocked)

- [x] **Food-court overview**: mock seating map/zone list, "scan to sit"
      entry point (placeholder), capability-gated. Blueprint:
      SCREEN_INVENTORY 28. (Done: `src/mock/foodCourt.js` (LuckyOne venue +
      zones with static seat counts, `getFoodCourtOverview` capability-gated
      on `food_court`, `getZoneStatus` Open/Busy/Full from mock counts);
      `FoodCourtScreen` stack route with venue summary, mock-data
      disclosure, zone cards with accessible-seating badges, and a
      "scan to sit" card reflecting the `seat_sessions` capability —
      disabled/unavailable state when either capability is off. Explore's
      Food court directory entry now opens it.)
- [x] **Seat session screens (mock flow)**: scan-permission explainer,
      seat confirmation, active session card, ended/expired screen, and
      error states (invalid/occupied/unavailable) driven by mock data.
      Pure presentation — no QR validation, no session rules (open
      decisions #9/#10). Blueprint: SCREEN_INVENTORY 29–33. (Done:
      `src/mock/seatSessions.js` demo scan targets + `resolveMockScan`
      standing in for the backend and `createMockSession` for a
      display-only session; five stack routes — SeatScan (camera-permission
      explainer + demo codes), SeatConfirm, SeatSession (active card with
      end/expiry actions), SeatSessionEnd (ended vs expired), SeatHelp
      (invalid/occupied/unavailable/stale copy). Food-court "scan to sit"
      opens the flow; LuckyOne's `seat_sessions` mock capability flipped to
      ENABLED so the preview is reachable (Harbour Walk stays DISABLED to
      show gating). No session rules enforced.)

### Stage E — maps and events (placeholder assets; no live positioning)

- [x] **Floor selector + static floor map**: floor list, placeholder map
      image with POI pins, and a clear "map data unavailable" state.
      Blueprint: SCREEN_INVENTORY 43–44, 50; PRD 5.12. (Done:
      `src/mock/floors.js` (LuckyOne floors G/1/2/3 with
      percentage-positioned POI pins, Terrace unpublished; Harbour Walk
      floors all unpublished); `FloorMapScreen` stack route — floor chips,
      dashed placeholder plan with tappable POI pins + detail card,
      "map data unavailable" card for unpublished floors, "Limited" chip
      when indoor_navigation is DEGRADED, unavailable state when DISABLED,
      and an explicit no-live-positioning disclaimer. Map tab is now a
      capability-gated landing that opens the floor map.)
- [x] **Destination search + route preview (mock)**: search POIs, show
      destination detail, manual start-point picker, static route preview.
      Never claim live positioning. Blueprint: SCREEN_INVENTORY 45–49.
      (Done: `src/mock/navigation.js` (published-POI destinations, curated
      start points, deterministic static route steps; "!error" query
      simulates a recoverable search failure; capability-gated on
      indoor_navigation). Four stack routes — DestinationSearch (idle
      suggestions + debounced search + empty/error states),
      DestinationDetail (category/floor card + "Get directions"),
      StartPointSelect (manual start picker, explainer that live
      positioning is off), RoutePreview (from/to summary card + numbered
      directions + preview-build note). Map tab gained a "Find a
      destination" entry. No pathfinding, no live positioning.)
- [x] **Events list + event detail** on mock events (title, image, time,
      location, registration-link placeholder; expired events hidden).
      Blueprint: PRD 5.14, SCREEN_INVENTORY 54–55. (Done:
      `src/mock/events.js` shared catalogue (LuckyOne market/workshop +
      Harbour Walk art walk + one expired fixture; `getEventList`
      capability-gated with expired filtered, `getEventById` resolves
      active-only). `EventsScreen` + `EventDetailScreen` stack routes —
      placeholder banners (icon + tone, no real creative assets),
      detail with time/location/organizer/capacity card, About section
      and a Register/tickets placeholder row (handoff not wired — 56).
      Home Events section and Explore's Events directory now open the
      real screens; Home events resolve from the catalogue, removing the
      duplicated light summaries.)

### Stage F — rewards and orders (display only; logic is blocked)

- [x] **Rewards dashboard + ledger list (mock)**: points balance card and
      ledger rows (earn/redeem/reverse types) from mock data. No earning,
      redemption, or balance logic (loyalty blocked). Blueprint:
      SCREEN_INVENTORY 57–58, PRD 5.11. (Done: `src/mock/rewards.js`
      (LuckyOne balance/pending/expiring + EARN/REDEEM/REVERSE ledger
      incl. a pending entry and a reversal; Harbour Walk empty);
      Rewards tab rebuilt as the dashboard — balance card with tabular
      numerals and mock-data disclosure, Activity ledger rows with
      per-type icons/points signs and a Pending chip, empty-ledger state.
      Capability-gated on loyalty: unavailable state when DISABLED;
      LuckyOne's mock loyalty flipped to ENABLED so the preview is
      reachable, Harbour Walk stays DISABLED to show gating. No
      earn/redeem logic.)
- [x] **Order history + order detail timeline (mock)**: list of mock orders
      and a status timeline using the PRD state names; clear pending vs
      confirmed states. No checkout or payments (blocked). Blueprint:
      PRD 5.10, SCREEN_INVENTORY 40–41. (Done: `src/mock/orders.js` (four
      LuckyOne mock orders covering in-progress PREPARING, completed,
      cancelled and payment-failed flows; states/timeline use the PRD 5.10
      names with `ORDER_STATE_META` labels/tones and an "expected next
      step" hint for active orders; capability-gated on online_ordering —
      Harbour Walk DISABLED shows the unavailable state).
      `OrderHistoryScreen` + `OrderDetailScreen` stack routes — history
      rows with current-state StatusChip, detail with status timeline
      (current step chip + pending next step), items with tabular-nums
      totals, preview-build notes. Profile → Orders now opens the real
      history screen. No checkout, payment or transition logic.)

### Stage G — quality and polish

- [x] **Jest setup** (`jest-expo`) + first tests: typed API client envelope
      helper and `MallContext` switching; `npm test` script. Blueprint:
      `07-delivery/ROADMAP_AND_BACKLOG.md` Phase 1. (Done: `jest-expo@~50`
      preset + `jest`, `react-test-renderer`, `@testing-library/react-native`
      devDependencies; `npm test` script; AsyncStorage mapped to its jest
      mock via `moduleNameMapper`. First suites: `src/services/__tests__/
      apiClient.test.js` (envelope passthrough/wrapping, never-throws
      failure paths, method/data wiring — axios mocked) and
      `src/utils/__tests__/mallData.test.js` (default mall, slug switch,
      unknown-slug ignored, object re-resolution). 12 tests, all passing.)
- [x] **i18n groundwork**: `expo-localization` + string catalog (English),
      RTL-ready layout audit of new screens (no hardcoded left/right where
      avoidable). Full Urdu translation is a later decision. PRD section 10.
      (Done: `expo-localization` installed (config plugin added to
      app.json); `src/i18n/` with the English catalog `en.js` (grouped
      common/mall/search/orders/rewards keys with `{placeholder}`
      interpolation) and a `t()` helper that detects the device locale,
      falls back to English, returns the key for unknown strings and never
      throws; `isRTL()` for known RTL language codes. RTL audit: all
      marginLeft/Right + paddingLeft/Right in the MallMate kit and new
      screens converted to logical marginStart/End + paddingStart/End (32
      files); two absolute left/right offsets (Signin logo, search filter
      badge) converted to start/end. Map POI pin coordinates stay physical
      (data positions). `t()` covered by unit tests. Screens still render
      English literals directly — adopting `t()` screen-by-screen is
      follow-up work when translations land.)
- [ ] **Adopt `t()` across MallMate screens**: the i18n groundwork ships
      the catalog + helper but screens still render English literals;
      migrate them to `t()` keys (one area per task). (Decision made:
      owner answered "sure add language translations" on issue #9, so
      English + Urdu is scheduled per PRD 10. Progress: the Urdu catalog
      `src/i18n/ur.js` now ships — mirrors `en.js` key-for-key with
      placeholder parity enforced by tests, registered in `CATALOGS`, and
      `t()` accepts an optional locale override. The auth area (Signin,
      Signup, ForgotPassword) is fully migrated to `t()` keys, including
      validation strings and accessibility labels — plus their remaining
      physical marginRight/Left margins
      converted to marginEnd/Start for RTL. The phone-OTP screens
      (RegisterPhone/Verification/CountryPicker) also shipped on t() keys
      (      `otp.*`), and the Profile area (Profile, Settings,
      ProfilePlaceholder) is migrated on `profile.*` keys (rows use
      title/subtitle key pairs translated at render), followed by the
      Events area (Events + EventDetail) on `events.*` keys (interpolated
      mall/organizer/capacity strings), then the Home area (HomeScreen +
      MallSelectorScreen) on `home.*` keys plus new `mall.*` hours/choose
      strings (section headers, badge/scope labels, mall-bar a11y
      interpolation, empty states; mock data strings stay in the mock
      catalogues), then the Explore area (ExploreScreen +
      MerchantListScreen) on `explore.*` keys (search entry, directory/
      category placeholders, open/closed chip, paging footer with
      singular/plural list-end, loading/error interpolations; mock
      directory titles and LIST_KIND_META copy stay in the mock).
      Remaining areas:
      Search, Maps, Food court, Rewards, Orders, and the
      mallmate kit defaults.)
- [x] **App identity**: rename app (app.json) to MallMate, placeholder
      icon/splash, remove `user_logsignin`. (Done: app.json `name` →
      "MallMate", `slug` → "mallmate", `userInterfaceStyle` → dark;
      splash + adaptive-icon background retinted to Midnight Graphite
      `#101418` to match Theme.js. Existing placeholder icon/splash images
      kept — real branding is blocked pending owner permission.
      package.json `name` → "mallmate".)
- [x] **Accessibility pass on new MallMate screens**: 44–48px targets,
      dynamic-type friendly layouts, no color-only status, accessible
      labels on icon buttons. Blueprint: DESIGN_SYSTEM rules. (Done: full
      audit of the mallmate kit + 30 MallMate screens against the
      DESIGN_SYSTEM rules. Already compliant: icon-only controls all have
      labels/roles, no color-only status, the Settings `Switch` is
      labelled, no `allowFontScaling={false}`. Fixed: `accessibilityRole
      ="header"` on every screen/section title (~25 Texts incl. the kit
      `SectionHeader`), mall-selector cards now expose
      `accessibilityState.selected` (via a new `Card` prop passthrough;
      the decorative checkmark is hidden from screen readers), floor-map
      POI pins got `hitSlop` (30px → ≥44px touch area), modal backdrops
      (filters, offer terms) got `accessibilityRole="button"`, and the
      search filter-count badge uses `minHeight` + padding so it can't
      clip at large font scales. Verified: `npm run lint` (0 errors;
      changed files clean), `npm run typecheck`, `npm test` — 18/18.)
- [x] **Screenshots for new screens**: create the capture script
      (`scripts/capture-screens.mjs` does NOT exist yet — earlier wording
      assumed it did) to walk the MallMate screens (tabs, merchant, offer)
      into `output/` once the local capture pipeline works (workflow
      pending; needs a device/emulator or Expo web runner). (Done:
      `npm run capture:screens` runs the local pipeline with zero new npm
      dependencies — `expo export:web` (webpack) → tiny static SPA server
      → headless Chrome/Chromium (`$CHROME_PATH` or a detected system
      binary) with `--screenshot` per screen. The navigator gained a
      web-only `linking` config so deep-link URLs (`/Main/Home`,
      `/MerchantDetail?merchantId=…`) restore navigation state; native
      behaviour unchanged. Walks 26 screens (tabs, merchant/menu, offer,
      events, food court, maps/route preview, orders, settings) into
      `output/screens/` (gitignored), with `--skip-export`/`--only`/
      `--out` flags and non-zero exit on any failed/tiny capture.
      Verified end-to-end here: 26/26 PNGs captured and spot-checked as
      real rendered UI. No CI workflow added — that's still pending a
      runner decision.)

### Docs debt (found in the 2026-10-20 analysis pass)

- [x] **AGENTS.md stale "stubbed screens" paragraph**: it listed
      `SignupScreen`/`ForgotPasswordScreen` as non-existent stubs — both exist
      and are registered; only the phone-verification pair is parked (issue
      #9). (Found + fixed in the same run.)
- [x] **README stale claims**: the features list still advertised "Facebook /
      Google social sign‑in buttons (UI only, not wired up)" (removed from
      `SigninScreen` in `7db84a0`), the tech-stack row said React Native
      `0.73.4` (package.json: `0.73.6`), and the project-structure tree omitted
      `src/mock/`, `src/i18n/` and the `src/components/mallmate/` kit while
      labelling `constants/` as "mock data". (Found + fixed the same run:
      dead bullet dropped, version row corrected to `0.73.6`, tree refreshed
      against the current `src/` layout.)
- [x] **Boot font loading carries legacy weight (gated on the P1 legacy-kit
      direction)**: `CustomFonts.js` still preloads eight Poppins weights that
      only unused legacy components (`FoodCard`, `FlagItem`, …) reference — no
      screen renders them, and MallMate screens use Inter. Trim once the P1
      "post‑login main flow / retire unused components" question is answered.
      (Done 2026-10-21, same run as the legacy-scaffold removal below: the
      owner answered "remove the legacy stuff" on issue #9, so `CustomFonts.js`
      now loads only the four Inter weights, the nine Poppins TTFs are
      deleted, `Fonts.js` (Poppins/Inter name constants) had no remaining
      consumers and was removed, and the parked `FlagItem` was restyled onto
      `MallMateTheme` fonts so nothing references Poppins anymore.)

### Blocked — do NOT implement until the owner decides

P0 business decisions from
[`08-decisions/OPEN_DECISIONS.md`](./MallMate_Project_Blueprint/08-decisions/OPEN_DECISIONS.md):
payment model, merchant settlement, payment provider choice, LuckyOne data
and branding permissions, ordering scope, loyalty funding, ranking data
coverage, merchant onboarding verification. Additionally: **no cart /
checkout / payment UI logic, no loyalty earn-redeem logic, no real ranking
computation, no QR validation or seat-session rules, no parking, and no
live map routing** — those need the decisions above or real integration
data (keys, floor plans, merchant catalogs). Presentation-only screens on
mock data (Stages D–F) are allowed.

## Legacy backlog — food-ordering scaffold

P0 — App is broken / blocking

- [x] **Install a vector icon package.** Migrated all icon imports
      (`SigninScreen`, `FoodCard`, `RestaurantCard`, `RestaurantMediumCard`)
      from the uninstalled `react-native-vector-icons` to `@expo/vector-icons`
      (bundled with Expo).
- [x] **Fix hook misuse in `SigninScreen.signIn()`** (`src/screens/SigninScreen.js`):
  - `useUserManagement()` is now called at the top level of the component.
  - The response is referenced as `response` (was the undefined
    `loginResponse`).
- [x] **Fix duplicate keys in `src/constants/ApiContants.js`.** Renamed to
      `ALL_RESTAURANTS` (`"/getAllRestaurants"`) and `BOOKMARK_LIST`
      (`"/bookmark"`); consumers (`RestaurantService`, `BookmarkService`)
      updated. Note `RestaurantService` previously read a non‑existent
      `RESTAURANT` key, so its URLs contained `undefined`.
- [x] **Make the backend URL configurable.** `ApiContants` resolves the base
      URL from `EXPO_PUBLIC_BACKEND_URL`, then `expo.extra.backendUrl`
      (`app.json` via `expo-constants`), then falls back to
      `http://localhost:3001`. No hardcoded IPs remain.

## P1 — Missing screens & flow

- [x] `SignupScreen` — created (validation + `AuthenticationService.register`)
      and registered in the navigator.
- [x] `ForgotPasswordScreen` — created (email lookup via `checkUserExist`)
      and registered in the navigator.
- [x] `RegisterPhoneScreen` + `VerificationScreen` (still stubbed as comments
      in `src/navigators/index.js` and `src/screens/index.js`). (Skipped
      2026-10-19: no phone/OTP endpoints exist in `ApiContants`/
      `AuthenticationService` and nothing in the signup flow references a
      phone step — building it would mean inventing the verification flow
      and hook points. Needs owner input on the intended flow first.)
      (2026-10-19 later run: a provisional implementation was briefly
      committed to `work` by mistake and reverted in the next commit —
      nothing ships until the flow question in issue #9 is answered.)
      (2026-10-21: the owner ANSWERED the flow on issue #9 — "register →
      otp → app, login → check if not sus proceed without otp / if sus ask
      for otp → app". Build as a presentation-only mock flow on the seat
      session precedent: OTP send/verify stand-ins in `src/mock/`, no real
      validation rules, country picker via `CountryCode.js` + `FlagItem`.)
      (Done 2026-10-21: `src/mock/otp.js` stand-ins — `sendMockOtp`
      (demo code `123456`, `!error` destination fails recoverably),
      `verifyMockOtp` (6-digit demo code only), `isSuspiciousLogin`
      (usernames containing "sus" stand in for the backend risk check).
      Three stack routes — `RegisterPhone` (country row via `CountryPicker`,
      phone entry, mock send), `CountryPicker` (searchable bundled
      `CountryCode` list rendered with `FlagItem`, selection merged back
      into RegisterPhone), `Verification` (6-digit entry, resend, on-screen
      demo-code note, review-note for the login flow). Signup success now
      navigates RegisterPhone → Verification → Main with a mock session;
      Signin routes suspicious usernames through Verification and everyone
      else straight to Main. New screens use `t()` (`otp.*` keys, en+ur).
      No SMS, no real validation, no backend endpoints.)
- [x] Post‑login main flow: home / restaurants, restaurant detail, food detail,
      cart, bookmarks, profile. Components already exist
      (`RestaurantCard`, `RestaurantMediumCard`, `FoodCard`, `WelcomeCard`,
      `CategoryMenuItem`, `CategoryListItem`) but no screens use them.
      (Item text corrected 2026-10-19: sign‑in DOES navigate now —
      `SigninScreen` replaces into the MallMate `Main` tab navigator. What's
      missing is a legacy restaurant/cart flow that consumes those scaffold
      components. Needs owner direction: build the legacy flow, or retire
      this item and the unused components now that MallMate covers
      discovery.) (Retired 2026-10-21: the owner answered "remove the legacy
      stuff" on issue #9 — MallMate covers discovery, so the legacy flow is
      not built. Removed in the same pass: the six unused components
      (`FoodCard`, `RestaurantCard`, `RestaurantMediumCard`, `WelcomeCard`,
      `CategoryMenuItem`, `CategoryListItem`), the dead services
      (`RestaurantService`, `FoodService`, `CartService`, `BookmarkService`,
      `UserService`, `StaticImageService`), `General.js` (onboarding copy),
      the unused Poppins/image assets including the ~58MB
      gallery/logo/poster trees, and the unused `lottie-react-native`
      dependency. Kept: `Separator` + `ToggleButton` (in use), `FlagItem`
      (parked for the OTP flow), `Images.FACEBOOK`/`GOOGLE` (future social
      re-wire), `Colors.js` (ToggleButton).)
- [x] Wire social sign‑in buttons (Facebook / Google) or hide them until real
      auth exists. (Done via the "hide" option: no social auth provider is
      integrated, so the "OR / Connect with Facebook / Connect with Google"
      block and its dead styles/imports were removed from `SigninScreen`.
      `Images.FACEBOOK`/`Images.GOOGLE` assets and constants are kept for a
      future re-wire.)
- [x] Country code picker screen (`CountryCode.js` + `FlagItem.js` are ready;
      note `countryflags.io` is dead — use emoji flags or a bundled image set).
      (Parked with the phone‑verification flow — issue #9: a provisional
      CountryCode screen was reverted in commit `22ac53c` because its only
      entry point is the also‑parked `RegisterPhoneScreen`. 2026-10-21: the
      flow is now decided (register → OTP → app; login → OTP only when the
      backend flags a suspicious attempt) — build the picker together with
      the OTP screens. `FlagItem` was kept and restyled to MallMate theme
      fonts/logical margins during the legacy removal.) (Done 2026-10-21
      with the OTP flow: `CountryPickerScreen` stack route — searchable
      filter over the bundled `CountryCode` list (emoji flags, no remote
      flag service), rows rendered with `FlagItem`, selection merged back
      into `RegisterPhone`. Entry point: the country row on RegisterPhone.)

## P2 — State, storage & auth hardening

- [x] Replace/upgrade `useUserManagement` (`src/utils/userData.js`) with a
      Context or Redux store so the logged‑in user is shared across screens.
      (Stale duplicate — already done via the React Context entry below.)
- [x] **Fix `StorageService`:**
  - `setUser` now `JSON.stringify`s before writing.
  - `getUser` reads the same `"user"` key and `JSON.parse`s the result.
- [x] Replace/upgrade `useUserManagement` (`src/utils/userData.js`) with a
      React Context (`UserProvider` + `useUserManagement`), mounted in
      `src/navigators/index.js`, so the logged‑in user is shared across
      screens and persisted.
- [x] Fix `StorageService`:
  - `setUser` now `JSON.stringify`s before writing to `AsyncStorage`.
  - `getUser` reads the same `"user"` key that `setUser` writes and parses it.
  - Added `removeUser()`; fixed the `AsyncSorage` typo.
- [ ] Persist the token and restore session on app launch; wire
      `refreshToken()` and auth headers (`utils/Generator.js#authHeader`) into
      the services (currently commented out).
- [x] Decide on a state library (Redux Toolkit vs React Query vs Context) and
      remove the commented‑out `react-redux` / `src/actions` leftovers in
      `FoodCard.js` and `RestaurantCard.js`. (Done: Context is the decision —
      `UserProvider`/`MallProvider`/`FavoritesProvider` are mounted in
      `src/navigators/index.js` and `react-redux` is not installed (AGENTS.md:
      "Redux was removed"). Dead `useDispatch`/`useSelector`/`../actions`
      imports and their commented dispatch/selector bodies were removed from
      `FoodCard.js` and `RestaurantCard.js`; the local console-stub cart/
      bookmark handlers they guarded are unchanged.)

## P3 — API & data cleanup

- [ ] `AuthenticationService.login` performs a **GET with a request body** and
      stringifies `user` into the URL path (`/api/getUser/{json}`). Redesign to a
      proper `POST /login` (requires backend coordination — the bogus second
      argument to `axios.get` was removed, behaviour unchanged).
- [x] Remove the hardcoded `test()` endpoint / dead `ngrok` URLs from
      `AuthenticationService.js`.
- [x] Consolidate `resdata.js` / `fooddata.js` / `Mock.js` mock data vs the live
      API; decide which is the source of truth. (Done: decision documented in
      AGENTS.md architecture rules — services are the live‑API path and
      `src/mock/` is the single mock‑data source. The three legacy scaffold
      files were provably dead — exported from the constants barrel but
      imported by no screen, component, service, test or script — so they were
      deleted along with their barrel exports; README's mock‑data bullet now
      points at `src/mock/`.)
- [ ] Services ignore auth headers everywhere — add them consistently once token
      storage works.

## P4 — Tooling & quality

- [x] Add ESLint (`eslint-config-universe` or similar) + `npm run lint`.
- [x] Bring the existing codebase to a clean lint baseline: run
      `npx eslint . --fix` (clears ~260 of the ~275 current warnings) and
      fix the remainder by hand. (Done: baseline was 174 warnings / 0
      errors; `npx eslint . --fix` cleared 159; the 15 leftovers were
      fixed by hand — unused imports removed from `FoodCard`,
      `RestaurantCard`, `RestaurantMediumCard`, `WelcomeCard`,
      `ToggleButton`; unused `setAnimatedValue` setter dropped in
      `ToggleButton`; unused catch args renamed to `_error` in
      `Bookmark`/`Cart`/`Food`/`Restaurant` services. `npm run lint` now
      reports 0 errors and 0 warnings; AGENTS.md verification note
      updated to match.)
- [x] Add tests (Jest + `@testing-library/react-native`) for services and the
      sign‑in flow; add `npm test`. (Done incrementally: `npm test` +
      jest-expo landed earlier; this pass added
      `src/services/__tests__/authenticationService.test.js` —
      register/login/checkUserExist/refreshToken cover validation
      short-circuits, URL/body/params wiring (including a test that locks
      the current GET-with-credentials quirk from P3 so a redesign
      updates it deliberately) and never-throws failure envelopes, axios
      mocked — plus `src/screens/__tests__/SigninScreen.test.js`: form
      renders with no social buttons, error message on failed login,
      submit → `replace("Main")` on success, forgot-password/signup
      navigation, password-visibility toggle (services mocked, screen
      wrapped in `UserProvider`). New global `jest.setup.js` mocks
      `react-native-safe-area-context` (wired via `setupFiles`).
      5 suites / 34 tests, all passing.)
- [x] Consider TypeScript migration for screens/services. (Done: decision =
      migrate file-by-file under `strict`; the first slice lands the pattern —
      `src/services/apiClient.js` → `apiClient.ts` (typed envelope helpers,
      `unknown` payload/catch narrowing via type guards) and
      `ProfilePlaceholderScreen` → `.tsx` typed with
      `RootStackScreenProps<"ProfilePlaceholder">` from the new
      `src/types/navigation.ts` (`RootStackParamList` mirroring the root
      stack routes + params). Added the missing `@types/react` devDependency
      (required for any `.tsx`) and a JSDoc optional-props signature on the
      kit `EmptyState` so its inferred props match real usage. Barrels and
      the navigator are untouched — extensionless imports resolve `.ts`/`.tsx`
      in tsc/jest/Metro. Remaining screens/services stay JS until touched;
      future slices follow the AGENTS.md note. Verified: lint 0/0 (ESLint
      covers `.ts`/`.tsx`), typecheck clean, 34/34 tests.)
- [x] Add `react-native-reanimated` / gesture handler setup notes if the stack
      navigator needs them. (Done: audited the need — `@react-navigation/stack`
      hard-requires `react-native-gesture-handler` (already a dependency) but
      nothing imported it at the app entry, which is the documented setup;
      `App.js` now imports it first. Reanimated is not installed and not
      needed (animations use `Animated` + lottie) — README "Navigation setup
      notes" documents both, including the Babel-plugin caveat if reanimated
      is ever added. Verified: lint/typecheck/tests clean and the web export
      still compiles and renders.)
- [x] Review `app.json` (icon/splash/name `user_logsignin`) and rename the
      package to match the product. (Done via the MallMate "App identity"
      item above — app.json + package.json renamed, splash/adaptive
      backgrounds themed.)
- [x] `expo-doctor` still flags pre‑existing version drift (`expo`,
      `lottie-react-native`, `react-native`, `react-native-safe-area-context`)
      — align them with `npx expo install --check` when convenient. (Done:
      `npx expo install --check` → `--fix` aligned all four to the Expo
      SDK 50 expected versions — `expo@~50.0.20`, `lottie-react-native@6.5.1`,
      `react-native@0.73.6`, `react-native-safe-area-context@4.8.2`; a
      follow-up `--check` reports "Dependencies are up to date". Verified:
      lint 0/0, typecheck clean, 34/34 tests, web export compiles and the
      home screenshot still renders.)

---

## Done

- [x] **Software-factory automation.** Issue runs now auto-open *and*
      auto-merge PRs via a before/after branch-list diff (works even when
      the agent forgets `gh pr create`); comment runs merge issue-driven
      branches and PR-driven commits; the scheduled worker loops up to 3
      tasks per run (every 2h), ships a README `todoAgent Ran` footer each
      run, and stops to open a question issue mentioning the owner whenever
      it is blocked.

- [x] Project scaffolded with Expo SDK 50, Poppins fonts, navigation skeleton.
- [x] Sign In screen with validation, loading animation and error display.
- [x] Service layer (`AuthenticationService`, `RestaurantService`, `FoodService`,
      `CartService`, `BookmarkService`, `UserService`, `StorageService`,
      `StaticImageService`).
- [x] Design tokens (`Colors`, `Fonts`, `Images`) and responsive helpers
      (`Display`).
- [x] README.md and AGENTS.md written.
- [x] Vector icons migrated to `@expo/vector-icons` (Expo SDK 50 bundling fixed).
- [x] `SigninScreen` hook misuse fixed — `useUserManagement` called at component
      top level; `loginResponse` → `response`.
- [x] `ApiContants.js` duplicate keys resolved (`ALL_RESTAURANTS` / `RESTAURANT`;
      `BOOKMARK` no longer shadowed by `"/test"`). `RestaurantService` updated.
- [x] Backend base URL is configurable via `EXPO_PUBLIC_BACKEND_URL` /
      `app.json` `extra.backendUrl` (`expo-constants`), replacing the
      hardcoded IP in `ApiContants.js` and `AuthenticationService.test()`.
- [x] `StorageService.setUser`/`getUser` key and serialization mismatch fixed.
- [x] P0 hardening: icon package migration, `SigninScreen` hook fix, duplicate
      API constant keys, configurable backend URL.
- [x] `SignupScreen` and `ForgotPasswordScreen` implemented and wired into the
      navigator.
- [x] User state moved to a shared `UserProvider` context; `StorageService`
      fixed (key mismatch, missing `JSON.stringify`).
- [x] Removed dead `test()` endpoint / `ngrok` leftovers from
      `AuthenticationService`.
- [x] Added missing `react-native-screens` peer dependency (required by
      `@react-navigation/stack` outside Expo Go) plus explicit
      `@expo/vector-icons`, `expo-constants`, `expo-font` dependencies.
- [x] GitHub Actions automation hardened: issue-triggered OpenCode runs now
      auto-open **and auto-merge** a PR (deterministic `opencode/issue-<n>`
      branch + merge step); daily 09:00 UTC TODO agent does one task or
      analyzes the repo, always appends a `todoAgent Ran` footer to README,
      and auto-merges; triggers restricted to OWNER with documented
      customization comments in both workflows.
- [x] **TypeScript introduced incrementally**: `tsconfig.json` with
      `allowJs: true` (existing JS stays JS, `checkJs` off), `typescript`
      devDependency and `npm run typecheck` (`tsc --noEmit`);
      `src/types/mallmate.ts` (+ `src/types/index.ts` barrel) defines core
      entity types `Mall`, `Capability`, `Merchant`, `OpeningHours` derived
      from `02-data/ERD.md`. No existing screens converted.
- [x] ESLint + Prettier introduced (`eslint-config-universe` `universe/native`,
      `.eslintrc.js` + `.prettierrc`) with `npm run lint`; existing style
      debt left as warnings pending a follow-up `--fix` pass.
- [x] Legacy food-ordering scaffold removed per the owner decision on issue
      #9 ("remove the legacy stuff"): six unused components, six dead
      services, `General.js`, `Fonts.js`, Poppins TTFs, unused images
      (incl. the ~58MB gallery/logo/poster trees) and the unused
      `lottie-react-native` dependency; barrels, README and AGENTS updated.
- [x] Phone-OTP auth flow (presentation-only) built on the owner's decided
      flow from issue #9: `src/mock/otp.js` stand-ins, `RegisterPhone` +
      `CountryPicker` + `Verification` stack routes, Signup rewired to
      register → OTP → app, Signin routes suspicious usernames through the
      OTP step. No SMS, no real validation, no backend endpoints.
