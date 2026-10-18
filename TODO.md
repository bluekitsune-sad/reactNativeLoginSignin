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
- [ ] **Menu/product list + item detail** for a mock merchant (sections,
      item cards, price display with tabular numerals). Blueprint:
      SCREEN_INVENTORY 24–25.
- [ ] **Offer detail + terms sheet**: discount types (%, fixed, BOGO) as
      mock offers with dates/eligibility/terms shown; expired offers hidden.
      Blueprint: PRD 5.8, SCREEN_INVENTORY 26.
- [ ] **Favorites tab**: local favorites (AsyncStorage) for mock merchants,
      empty state. Blueprint: SCREEN_INVENTORY 27.
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

- [ ] **Food-court overview**: mock seating map/zone list, "scan to sit"
      entry point (placeholder), capability-gated. Blueprint:
      SCREEN_INVENTORY 28.
- [ ] **Seat session screens (mock flow)**: scan-permission explainer,
      seat confirmation, active session card, ended/expired screen, and
      error states (invalid/occupied/unavailable) driven by mock data.
      Pure presentation — no QR validation, no session rules (open
      decisions #9/#10). Blueprint: SCREEN_INVENTORY 29–33.

### Stage E — maps and events (placeholder assets; no live positioning)

- [ ] **Floor selector + static floor map**: floor list, placeholder map
      image with POI pins, and a clear "map data unavailable" state.
      Blueprint: SCREEN_INVENTORY 43–44, 50; PRD 5.12.
- [ ] **Destination search + route preview (mock)**: search POIs, show
      destination detail, manual start-point picker, static route preview.
      Never claim live positioning. Blueprint: SCREEN_INVENTORY 45–49.
- [ ] **Events list + event detail** on mock events (title, image, time,
      location, registration-link placeholder; expired events hidden).
      Blueprint: PRD 5.14, SCREEN_INVENTORY 54–55.

### Stage F — rewards and orders (display only; logic is blocked)

- [ ] **Rewards dashboard + ledger list (mock)**: points balance card and
      ledger rows (earn/redeem/reverse types) from mock data. No earning,
      redemption, or balance logic (loyalty blocked). Blueprint:
      SCREEN_INVENTORY 57–58, PRD 5.11.
- [ ] **Order history + order detail timeline (mock)**: list of mock orders
      and a status timeline using the PRD state names; clear pending vs
      confirmed states. No checkout or payments (blocked). Blueprint:
      PRD 5.10, SCREEN_INVENTORY 40–41.

### Stage G — quality and polish

- [ ] **Jest setup** (`jest-expo`) + first tests: typed API client envelope
      helper and `MallContext` switching; `npm test` script. Blueprint:
      `07-delivery/ROADMAP_AND_BACKLOG.md` Phase 1.
- [ ] **i18n groundwork**: `expo-localization` + string catalog (English),
      RTL-ready layout audit of new screens (no hardcoded left/right where
      avoidable). Full Urdu translation is a later decision. PRD section 10.
- [ ] **App identity**: rename app (app.json) to MallMate, placeholder
      icon/splash, remove `user_logsignin`.
- [ ] **Accessibility pass on new MallMate screens**: 44–48px targets,
      dynamic-type friendly layouts, no color-only status, accessible
      labels on icon buttons. Blueprint: DESIGN_SYSTEM rules.
- [ ] **Screenshots for new screens**: extend `scripts/capture-screens.mjs`
      to walk the MallMate screens (tabs, merchant, offer) into `output/`
      once the local capture pipeline works (workflow pending).

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
- [ ] `RegisterPhoneScreen` + `VerificationScreen` (still stubbed as comments
      in `src/navigators/index.js` and `src/screens/index.js`).
- [ ] Post‑login main flow: home / restaurants, restaurant detail, food detail,
      cart, bookmarks, profile. Components already exist
      (`RestaurantCard`, `RestaurantMediumCard`, `FoodCard`, `WelcomeCard`,
      `CategoryMenuItem`, `CategoryListItem`) but no screens use them.
      There is also no screen to navigate to after a successful sign‑in yet.
- [ ] Wire social sign‑in buttons (Facebook / Google) or hide them until real
      auth exists.
- [ ] Country code picker screen (`CountryCode.js` + `FlagItem.js` are ready;
      note `countryflags.io` is dead — use emoji flags or a bundled image set).

## P2 — State, storage & auth hardening

- [ ] Replace/upgrade `useUserManagement` (`src/utils/userData.js`) with a
      Context or Redux store so the logged‑in user is shared across screens.
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
- [ ] Decide on a state library (Redux Toolkit vs React Query vs Context) and
      remove the commented‑out `react-redux` / `src/actions` leftovers in
      `FoodCard.js` and `RestaurantCard.js`.

## P3 — API & data cleanup

- [ ] `AuthenticationService.login` performs a **GET with a request body** and
      stringifies `user` into the URL path (`/api/getUser/{json}`). Redesign to a
      proper `POST /login` (requires backend coordination — the bogus second
      argument to `axios.get` was removed, behaviour unchanged).
- [x] Remove the hardcoded `test()` endpoint / dead `ngrok` URLs from
      `AuthenticationService.js`.
- [ ] Consolidate `resdata.js` / `fooddata.js` / `Mock.js` mock data vs the live
      API; decide which is the source of truth.
- [ ] Services ignore auth headers everywhere — add them consistently once token
      storage works.

## P4 — Tooling & quality

- [x] Add ESLint (`eslint-config-universe` or similar) + `npm run lint`.
- [ ] Bring the existing codebase to a clean lint baseline: run
      `npx eslint . --fix` (clears ~260 of the ~275 current warnings) and
      fix the remainder by hand.
- [ ] Add tests (Jest + `@testing-library/react-native`) for services and the
      sign‑in flow; add `npm test`.
- [ ] Consider TypeScript migration for screens/services.
- [ ] Add `react-native-reanimated` / gesture handler setup notes if the stack
      navigator needs them.
- [ ] Review `app.json` (icon/splash/name `user_logsignin`) and rename the
      package to match the product.
- [ ] `expo-doctor` still flags pre‑existing version drift (`expo`,
      `lottie-react-native`, `react-native`, `react-native-safe-area-context`)
      — align them with `npx expo install --check` when convenient.

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
