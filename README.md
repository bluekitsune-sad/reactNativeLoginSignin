# MallMate (Expo)

**MallMate** is a multi‑mall smart shopping, navigation, dining and loyalty
app (pilot: LuckyOne Mall, Karachi), built with **Expo** and **React
Navigation**. This repository is the mobile client: an auth flow backed by a
REST backend, plus the MallMate app shell — all MallMate screens currently
run on preview data from `src/mock/`.

> Status: **work in progress.** The app signs you in (`Signin`, `Signup`,
> `ForgotPassword`, phone‑OTP `RegisterPhone`/`Verification`) and drops you
> into the MallMate shell: **Home, Explore, Map, Rewards, Profile** tabs with
> their stack screens — mall selector, search + filters, restaurant/outlet
> lists, merchant/menu/offer detail, favorites, food court + seat sessions,
> floor map + destination search/route preview, events, order history,
> settings. See [TODO.md](./TODO.md) for remaining work and known gaps.

---

## Direction: MallMate

This project is becoming **MallMate**, a multi‑mall smart shopping,
navigation, dining and loyalty platform (pilot: LuckyOne Mall, Karachi).

- Full blueprint (PRD, architecture, ERD, API spec, screen inventory, design
  system): [`MallMate_Project_Blueprint/`](./MallMate_Project_Blueprint/README.md)
- Active backlog (what the daily todoAgent works through):
  the **MallMate** section of [TODO.md](./TODO.md)
- New MallMate design tokens: `src/constants/Theme.js` ("Midnight Graphite +
  Emerald"); capability registry: `src/constants/Capabilities.js`

---

## Features

- Sign In screen with username / password, show/hide password, "Remember me"
  toggle, loading state and inline error message.
- Sign Up screen (username / email / password with validation) and a Forgot
  Password screen (email lookup via `user-exist`).
- Shared user state through a React Context (`UserProvider` +
  `useUserManagement`); sign-in/sign-out write the user to `AsyncStorage`
  (restore-on-launch is deferred — the app boots at Signin today; the mall
  and favorites contexts do hydrate from storage).
- Authentication service (`register`, `login`, `checkUserExist`, `refreshToken`)
  built on `axios`.
- Services: `AuthenticationService`, `StorageService` and the typed axios
  `ApiClient` helper (the unused food-ordering services `RestaurantService`,
  `FoodService`, `CartService`, `BookmarkService`, `UserService` and
  `StaticImageService` were removed with the legacy scaffold).
- Local persistence via `AsyncStorage` (`StorageService`).
- Inter font family loaded at boot through `expo-font` (the legacy Poppins
  weights were removed with the food-ordering scaffold).
- Reusable UI kit in `src/components/mallmate/` (`Button`, `TextInput`,
  `Card`, `ListRow`, `Badge`, `StatusChip`, `EmptyState`, `ErrorState`,
  `LoadingState`, `FilterSheet`, …) plus `Separator`, `ToggleButton` and the
  `FlagItem` country-code row (used by the phone-OTP picker).
- English + Urdu string catalogs with a shared `t()` helper (`src/i18n/`).
- MallMate preview data for merchants, menus, offers, events, orders, maps
  and rewards in `src/mock/` (the single source for mock data; the legacy
  `resdata`/`fooddata`/`Mock` constants were removed as dead code).

## Tech stack

| Layer      | Choice |
| ---------- | ------ |
| Framework  | React Native `0.73.6` via Expo SDK `50` |
| Language   | JavaScript (JSX); TypeScript converted file-by-file (`allowJs`, first slice: `apiClient.ts`, `ProfilePlaceholderScreen.tsx`) |
| Navigation | `@react-navigation/native` + `@react-navigation/stack` + `@react-navigation/bottom-tabs` + `react-native-gesture-handler` |
| HTTP       | `axios` |
| Storage    | `@react-native-async-storage/async-storage` |
| i18n       | `expo-localization` (device locale detection for `t()`) |
| Config     | `expo-constants` (backend URL resolution in `ApiContants.js`) |
| Animation  | `Animated` API |
| Fonts      | `expo-font` (Inter via `@expo-google-fonts/inter`) |
| Icons      | `@expo/vector-icons` (Ionicons, Feather)                     |
| Safe area  | `react-native-safe-area-context` |

### Navigation setup notes

- **`react-native-gesture-handler` is required** by
  `@react-navigation/stack` (it is a hard peer dependency). It is imported
  as the first line of `App.js` (`import "react-native-gesture-handler";`)
  so the native gesture driver initializes before any component — do not
  remove or reorder that import.
- **`react-native-reanimated` is intentionally not installed.** No screen
  uses it (animations are the RN `Animated` API),
  and it would need a Babel plugin (`react-native-reanimated/plugin`) in
  `babel.config.js` if it were ever added. Only add it when a screen
  actually needs layout animations or shared-element transitions.

## Getting started

### Prerequisites

- Node.js 18+ and npm
- The Expo Go app on your phone, or an Android/iOS emulator
- A reachable backend API (see [Backend configuration](#backend-configuration))

### Installation

```bash
npm install
```

### Run

```bash
npm start          # Expo dev server (scan the QR code with Expo Go)
npm run android    # start on Android emulator
npm run ios        # start on iOS simulator
npm run web        # start in the browser
```

## Backend configuration

The API base URL is resolved in `src/constants/ApiContants.js` in this order:

1. `EXPO_PUBLIC_BACKEND_URL` environment variable (highest priority).
2. `expo.extra.backendUrl` from `app.json` (via `expo-constants`).
3. Fallback: `http://localhost:3001`.

To point the app at your LAN backend, edit `app.json`:

```json
{
  "expo": {
    "extra": {
      "backendUrl": "http://192.168.0.103:3001"
    }
  }
}
```

or launch with an env var:

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.0.103:3001 npm start
```

All endpoints (e.g. `/api/register`, `/api/getUser/`, `/api/user-exist`,
`/api/refresh-token`) are derived from this base URL.

The expected sign‑in payload shape:

```json
{ "username": "johndoe", "password": "secret" }
```

## Project structure

```
.
├── App.js                     # Entry point: loads fonts, renders navigator
├── app.json                   # Expo app config (name, icons, splash)
├── package.json
├── tsconfig.json              # Incremental TypeScript setup (allowJs)
├── webpack.config.js          # Expo web build config (node crypto shim)
├── assets/                    # Expo icons / splash images
├── scripts/                   # Local tooling (screen-capture pipeline)
├── MallMate_Project_Blueprint/ # PRD, API spec, ERD, screen inventory, design system
├── .github/workflows/         # Software-factory automation (opencode.yml, opencode-cron.yml)
├── TODO.md                    # Living backlog (the factory's task queue)
└── src/
    ├── __tests__/             # Repo-root tests (icon-name glyphmap validation)
    ├── components/            # UI kit: mallmate/ components + Separator/ToggleButton/FlagItem
    ├── constants/             # Colors, ApiContants, Theme, Capabilities, CapabilityMeta, CustomFonts, CountryCode
    ├── i18n/                  # English + Urdu string catalogs + t() helper
    ├── mock/                  # MallMate preview data (merchants, offers, events, ...)
    ├── navigators/            # Root stack + MallMate bottom tabs (Main); composes the context providers
    ├── screens/               # Auth + MallMate screens (home, explore, map, rewards, ...)
    ├── services/              # axios API services + AsyncStorage wrapper (auth, storage, ApiClient)
    ├── types/                 # TypeScript types (entities, API envelope, navigation)
    └── utils/                 # Display helpers + user/mall/favorites context providers
```

### Key modules

| Path | Purpose |
| ---- | ------- |
| `App.js` | Loads custom fonts, then mounts `<Navigators />`. |
| `src/navigators/index.js` | Root `Stack.Navigator`; composes `<UserProvider>`, `<MallProvider>` and `<FavoritesProvider>`. |
| `src/screens/SigninScreen.js` | Sign in form and submit logic. |
| `src/screens/SignupScreen.js` | Registration form and validation. |
| `src/screens/ForgotPasswordScreen.js` | Email lookup for password reset. |
| `src/services/AuthenticationService.js` | Register / login / token refresh. |
| `src/utils/Display.js` | `setWidth(w)` / `setHeight(h)` percentage helpers. |
| `src/utils/userData.js` | `UserProvider` + `useUserManagement` context for the current user. |
| `src/constants/Colors.js` | Legacy palette still used by `ToggleButton` (MallMate screens use `Theme.js`). |

## Available scripts

| Script | Description |
| ------ | ----------- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Start on Android. |
| `npm run ios` | Start on iOS. |
| `npm run web` | Start the web build. |
| `npm run typecheck` | Run `tsc --noEmit` over the incremental TypeScript setup. |
| `npm run lint` | Run ESLint (with Prettier rules via `eslint-config-universe`). |
| `npm test` | Run the Jest test suite (`jest-expo` preset). |
| `npm run capture:screens` | Build the web export and screenshot all MallMate screens into `output/screens/` (needs a local Chrome/Chromium; see `scripts/capture-screens.mjs`). |

`npm run lint` is a clean baseline (0 errors, 0 warnings) — keep it that way.

## Contributing

1. Fork and create a feature branch.
2. Keep changes scoped; follow the existing folder layout and barrel files
   (`src/*/index.js`, or `src/types/index.ts`) when adding modules.
3. Update [TODO.md](./TODO.md) / this README if you change behaviour.
4. Open a pull request.

## Automation — the software factory

This repo runs itself through two GitHub Actions workflows (both heavily
commented, see `.github/workflows/`). **This repo's Actions policy does not
allow workflow-created PRs, so issue-driven runs land on one long-lived
branch: `work`** — runs triggered from a pull request instead push commits
to that PR's branch for you to merge. You merge `work` into `main` manually
whenever you like:

```bash
git checkout main && git merge work && git push
```

| Workflow | Trigger | What it does |
| -------- | ------- | ------------ |
| `opencode.yml` | Issues and `/opencode` comments you open; OWNER pull requests (opened/synchronize/reopened/ready_for_review) and PR review comments | Issue and issue-comment runs implement on an `opencode/*` branch based on `work` and merge it straight into `work` (no PR), commenting the result on your issue. Runs triggered by a PR review comment commit to that PR's branch instead — you merge the PR manually. Blocked? It opens a question issue @-mentioning you instead of guessing. A `review-pr` job also reviews every OWNER PR against its base branch with OpenCode (read-only — it never merges). |
| `opencode-cron.yml` | 09:00 / 13:00 / 17:00 UTC + manual | Burns down **up to 5 TODO items per run** (branch from `work` → implement → mark done → land in `work`, one at a time), always ships a `todoAgent Ran` README footer on `work`, sweeps any stranded branch from earlier runs into `work`. |

**Why isn't it one endless in-run loop?** Three GitHub platform limits:

1. A workflow job is capped at 6 hours (we budget ~70 min), and agent
   quality degrades over very long single sessions.
2. A run authenticated with the built-in `GITHUB_TOKEN` is **not allowed to
   trigger further workflow runs** (GitHub's recursion guard) — the factory
   cannot re-launch itself mid-run. Only the cron clock or you can.
3. `TODO.md` / `AGENTS.md` / `PRD.md` control *what* the agent does per
   iteration (queue, rules, spec) — but they cannot extend a job's lifetime
   or add steps. So the durable loop is split: **cron = when**, **prompt =
   what per run**, **safety net = never leave a branch behind**.

Tune it in `opencode-cron.yml`: the `cron:` line (cadence), the
"LOOP LIMITS" line in the prompt (tasks per run), and `timeout-minutes`.

## License

MIT — see [LICENSE](./LICENSE).

todoAgent Ran (2026-10-15): done — added ESLint + Prettier (eslint-config-universe) with npm run lint
> todoAgent Ran (2026-10-16): done — introduced TypeScript incrementally (tsconfig with allowJs, src/types/mallmate.ts entity types from the ERD, npm run typecheck)

done today:  > todoAgent Ran (2026-10-17 12:58 UTC): done — loaded Inter fonts (@expo-google-fonts/inter); MallMate base component kit; bottom tab navigation with post-login Main flow; Mall selector + MallContext with mock LuckyOne data; capability-driven home skeleton

> todoAgent Ran (2026-10-17 16:30 UTC): done — typed API client helper (apiClient + ApiEnvelope types); re-skin auth screens to MallMate theme; Profile tab with placeholder rows; Settings + notification preference toggles; multi-mall mock data + hardened switching

done today:  > todoAgent Ran (2026-10-17 19:31 UTC): done — home content sections (categories/featured/discounts/events); Explore landing with directories + category grid; Search UI with suggestions and distinct empty/error states; Filter bottom sheet (category/cuisine/open-now/floor/price) on Search; organic top-selling section with mandatory app-orders-only disclosure

done today:  > todoAgent Ran (2026-10-18 13:36 UTC): done — restaurant+outlet lists w/ mock pagination; merchant detail; menu list + item detail; offer detail + terms sheet; local favorites

done today:  > todoAgent Ran (2026-10-18 17:09 UTC): done — food-court overview w/ mock seating zones; seat-session mock flow (scan/confirm/session/end/help); floor selector + static floor map w/ POI pins; events list + event detail; rewards dashboard + ledger

done today:  > todoAgent Ran (2026-10-18 19:58 UTC): done — destination search + route preview (45-49), order history + detail timeline (40-41), jest setup + first tests, app identity rename to MallMate, i18n groundwork + RTL audit

done today:  > todoAgent Ran (2026-10-19 16:42 UTC): done — accessibility pass on MallMate screens (header roles, mall-card selected state, POI-pin hit areas, dynamic-type badge); hid social sign-in buttons until real auth exists; removed react-redux/src/actions leftovers (state = Context); clean ESLint baseline (174 warnings → 0); AuthenticationService + sign-in flow tests (5 suites, 34 passing)

done today:  > todoAgent Ran (2026-10-19 21:54 UTC): done — screenshots capture pipeline + web deep links (26 screens); gesture-handler entry import + navigation setup notes; Expo SDK 50 dependency drift aligned; provisional phone-verification flow reverted pending owner question #9

done today:  > todoAgent Ran (2026-10-20 14:43 UTC): done — removed dead legacy mocks (resdata/fooddata/Mock) + documented the mock source of truth; TypeScript migration first slice (apiClient.ts + ProfilePlaceholderScreen.tsx + RootStackParamList, @types/react added); fixed stale AGENTS.md screens paragraph and README claims/tree; analysis found 3 doc issues (2 fixed in-run, 1 queued gated on the legacy-kit decision)

done today:  > todoAgent Ran (2026-10-21 15:25 UTC): done — unblocked issue #9 decisions: Urdu catalog + auth screens on t() keys (logical RTL margins); removed legacy food-ordering scaffold (~58MB assets, dead components/services/fonts, lottie dep); phone-OTP mock flow (RegisterPhone/CountryPicker/Verification, register→OTP→app, suspicious-login OTP); Profile + Events areas migrated to t() keys (7 suites, 48 tests, lint/typecheck/web-export clean)

done today:  > todoAgent Ran (2026-10-21 21:03 UTC): done — Stage G t() adoption across 5 screen areas (7 suites, 48 tests, lint/typecheck clean): Home + mall selector on home.*/mall.* keys; Explore + merchant list on explore.* (list-end singular/plural, paging footer); Search on extended search.* (filter a11y, open-now tag; kit FilterSheet deferred to kit-defaults pass); Maps, all six screens, on new maps.* group (floor selector, POI pins, route preview; reuses common.goBack/search.*/mall.mapsUnavailable); Food court, all six seat-flow screens, on new foodCourt.* group (interpolated seat counts + demo codes, ended/expired key pairs; mock SEAT_HELP_COPY/zone labels stay in the mock)

done today:  > todoAgent Ran (2026-10-22 14:39 UTC): done — Stage G t() adoption finished (3 tasks): Rewards area on rewards.* keys (balance card, pending/expiring chips, a11y point counts); Orders area on orders.* keys (history + detail timeline, item lines); mallmate kit defaults incl. the previously deferred FilterSheet on common.* keys — en+ur mirrored, t() item checked off; lint 0/0, typecheck clean, 7 suites/48 tests. MallMate queue empty — analysis added 4 new items to TODO.md (stale README intro, RootStackParamList missing OTP routes, capture-script route gaps, 3 dead i18n keys)

done today:  > todoAgent Ran (2026-10-22 20:56 UTC): done — 5 tasks: README intro/status rewritten for MallMate (scaffold description removed); RootStackParamList gains the 3 phone-OTP routes; capture-screens covers all 37 registered routes (verified 37/37 end-to-end); all 8 dead i18n keys resolved (3 wired, 5 dropped — 0 unreferenced of 276); Offer detail + Favorites fully migrated to t() with new en+ur groups (parity + captures byte-identical). lint 0/0, typecheck clean, 7 suites/48 tests each task. Remaining TODO items need backend coordination — 1 new analysis item queued (duplicated README backend-config section)

done today:  > todoAgent Ran (2026-10-23 14:12 UTC): done — 1 task: README "Backend configuration" section deduplicated (kept the fuller version, listed only auth paths still wired). Remaining MallMate TODO items (token/session persistence, login GET→POST redesign, auth headers) all need a live backend contract — skipped. Analysis added 3 new items to TODO.md: missing sign-out wiring (resetUser has zero consumers), dead ApiContants keys (STATIC_IMAGE, CART, FOOD, etc.), dead StorageService first-time-use helpers. lint 0/0, typecheck clean, 7 suites/48 tests.

done today:  > todoAgent Ran (2026-10-23 20:25 UTC): done — 3 tasks: Profile gained a danger-toned Sign-out row wired to resetUser (clears the stored user + resets the whole stack to Signin so back cannot reopen a signed-out session; new kit ListRow titleColor prop; t() keys en+ur); dead ApiContants keys removed (STATIC_IMAGE block + ALL_RESTAURANTS/CART/FOOD/BOOKMARK_LIST/USER/ADDUSER — only auth paths remain, AGENTS note reworded); dead StorageService first-time-use helpers removed. MallMate queue empty at close-out — remaining items (token/session persistence, login GET→POST, auth headers) all need a live backend contract. Analysis added 2 new items to TODO.md: AuthenticationService logs raw errors (failed login prints credentials-in-URL via console.log(error)) + leftover commented test() block; dead removeSelectedMallSlug helper. lint 0/0, typecheck clean, 7 suites/49 tests each task.

analysis only:> todoAgent Ran (2026-10-24 19:34 UTC): no actionable tasks — analysis added 7 new items to TODO.md

done today:  > todoAgent Ran (2026-10-25 13:47 UTC): done — 5 tasks: merchant/menu screens migrated to t() with new en+ur merchant.*\/menu.* key groups (parity tests); AGENTS.md stale claims fixed (phone-OTP trio shipped, TypeScript incremental — not "stubbed"/"JS only"); AuthenicationService barrel typo fixed across all consumers (barrel exports AuthenticationService, three auth screens + tests renamed, zero typo refs left); sign-in Remember me wired (username-only local persistence via new StorageService helpers, controlled ToggleButton with switch role/state + 44px hitSlop, 4 new tests); README tech-stack icons row corrected to Ionicons + Feather. lint 0/0, typecheck clean, 54/54 tests. 2 items remain in the 2026-10-24 analysis queue (dead code/dependency sweep, coverage-gap tests) for the next run.

done today:  > todoAgent Ran (2026-10-26 16:11 UTC): done — 2 tasks: (1) dead code/dependency sweep — src/utils/Generator.js (unused authHeader helper) deleted, expo-status-bar dropped from package.json (zero imports; RN StatusBar used), isRTL() + its lone test assertion removed (logical margin props already handle RTL), isTerminalOrderState removed from mock/orders + barrel (detail screen keys off order.nextState); (2) coverage gap closed — 3 new suites (storageService JSON round-trip + favorite-array validation, applyMerchantFilters 5-dimension/AND/no-mutation + fetchMerchantListPage fail-first state machine/pagination/clamps/capability gating, FavoritesProvider hydration/toggle/persistence/out-of-provider throw); lint 0/0, typecheck clean, 94/94 tests, expo export:web still compiles. Remaining TODO items (token/session restore, login GET→POST, auth headers) all need a live backend contract. Analysis added 2 new items to TODO.md: no CI runs lint/typecheck/test on PRs; module-private mock helpers exported unnecessarily (isCampaignActive/isOfferActive/MOCK_MERCHANTS/SEARCH_SUGGESTIONS).

analysis only:> todoAgent Ran (2026-10-27 21:32 UTC): no actionable tasks — CI workflow item re-probed and still blocked by the workflows-token restriction (issue #11 commented); i18n audit clean (0 unused of 341 keys, en/ur parity); analysis added 2 new items to TODO.md (AGENTS.md stale hardcoded-IPs claim, README automation-table/tree gaps)

done today:  > todoAgent Ran (2026-10-28 15:49 UTC): done — 3 tasks: (1) AGENTS.md API-paths bullet no longer claims "existing hardcoded IPs are legacy debt" (zero 192.168/10.0.* addresses remain in src/, App.js, scripts/ — wording now guards against regression only); (2) README automation table documents opencode.yml real triggers (issues, /opencode comments, OWNER pull_request events, PR review comments) + its review-pr job, and the project-structure constants/ line adds the barrel-exported CapabilityMeta.js; (3) synced main into work — picked up the owner direct-to-main .gitignore fix (5aab533: .env/.env.* ignored, !.env.example kept) that work lacked after diverging, closing a real secret-commit risk on the factory landing branch. Analysis: i18n audit clean (0 unreferenced of 341 keys), no console.log in src/, no dead modules found, navigator/capture-script/routes consistent, no tracked .env files; CI item re-probed and still blocked (issue #11 OPEN — GITHUB_TOKEN still lacks workflows permission, no ci.yml landed); remaining unchecked TODO items (CI, token/session restore, login GET-to-POST, auth headers) all need owner/backend action. No new TODO items.

analysis only:> todoAgent Ran (2026-10-28 21:38 UTC): no actionable tasks — analysis added 2 new items to TODO.md

done today:  > todoAgent Ran (2026-10-29 16:00 UTC): done — 2 tasks: (1) fixed blank Route Preview hero icon (Ionicons `route-outline` does not exist in the packaged glyphmap → swapped to glyphmap-verified `navigate-outline`; new `src/__tests__/iconNames.test.js` validates every Ionicons/Feather name literal in the codebase against the glyphmaps, sanity-checked to fail on the old name); (2) trimmed dead Colors.js palette (20 unconsumed tokens removed, only ToggleButton's DEFAULT_GREEN/GREY/WHITE kept; zero references to removed tokens). Analysis: i18n audit clean (0 unreferenced of 341), navigator/paramlist/capture-script in sync, no console logging in src/, no dead deps. Added 2 new TODO items (20 unused mock-barrel exports incl. 19 module-private names; useUserManagement/UserProvider barrel re-exports bypassed by 4 deep imports). Remaining unchecked items all blocked on owner/backend (issue #11 CI token; token/session, login POST, auth headers).

done today:  > todoAgent Ran (2026-10-29 21:41 UTC): done — 2 tasks: (1) shrunk the mock barrel surface — removed 20 unused named exports from src/mock/index.js (EVENT_ICONS/FOOD_COURTS/MOCK_EVENTS/POI_ICONS/HOME_CONTENT/getContentForMall/toEventSummary/LEDGER_TYPES/MOCK_REWARDS/LIST_PAGE_SIZE/MERCHANT_DETAILS/MOCK_MENUS/MOCK_OFFERS/DESTINATION_SUGGESTIONS/OFFER_TYPES/formatOfferDate/getMerchantInitials/MOCK_ORDERS/ORDER_STATES/MOCK_SESSION_PREVIEW_MINUTES; screens consume the resolvers, not the raw data) and dropped the export keyword from the 19 module-private names across 11 mock modules — LIST_PAGE_SIZE stays exported from merchants.js for its deep-importing test; (2) wired useUserManagement/UserProvider through the utils barrel — the three screens (Signin/Verification/Profile) switched from default deep imports to named barrel imports, the navigator's UserProvider import moved to "../utils", and the two test wrappers the item count missed were switched too; zero utils/userData references remain outside the module. Verified: lint 0/0, typecheck clean, 95/95 tests. Analysis: navigator still deep-imports FavoritesProvider/MallProvider (same class, queued as a new TODO item); Images (FACEBOOK/GOOGLE) intentionally parked for a future social re-wire — not dead; routes/RootStackParamList in sync (33/33); no console.log in src/; i18n untouched this run. Remaining unchecked items all blocked on owner/backend (issue #11 CI token; token/session restore, login GET-to-POST, auth headers).

done today:  > todoAgent Ran (2026-10-30 15:55 UTC): done — 1 task: navigators/index.js now imports FavoritesProvider, MallProvider and UserProvider via a single "../utils" barrel import (was the last app-code consumer bypassing the utils barrel with deep ../utils/favorites and ../utils/mallData paths); TODO item marked done. Verified: lint 0/0, typecheck clean, 95/95 tests across 11 suites (one earlier suite failure was flaky — a clean re-run passed). Analysis added 4 new items to TODO.md (3 barrel-bypass deep imports incl. MALLS x2 + MallMateTheme; 2 unreferenced mock-barrel re-exports FLOORS/getActiveOffersForMerchant; stale AGENTS.md/README claims re Colors.js, Display sizing, navigator providers; fire-and-forget StorageService writes can reject unhandled). CI item still blocked (issue #11 token 403 on workflow pushes); remaining unchecked items blocked on owner/backend (token/session restore, login GET-to-POST, auth headers).

analysis only:> todoAgent Ran (2026-10-31 15:23 UTC): no actionable tasks — analysis added 4 new items to TODO.md

done today:  > todoAgent Ran (2026-10-31 20:34 UTC): done — 5 tasks: (1) fixed the AGENTS.md "Envelope passthrough" bullet to match apiClient.ts (message/data are lifted from 2xx envelope-shaped bodies but status always follows the HTTP outcome — a 2xx resolves true even when the body says false) + renamed the misleading test and added a pinning case for 200+status:false; (2) re-scoped three stale AGENTS.md claims (envelope contract now scoped to network services, with StorageService's safe-default behaviour noted; screens register as stack routes in navigators/index.js OR the five tabs in MainTabNavigator.js; barrel rule lists every src/ folder's aggregator incl. src/types/index.ts and states test/asset folders have none); (3) synced the README project tree (added the missing src/__tests__/ line) and the Contributing barrel note (src/*/index.js, or src/types/index.ts); (4) removed the dead `export default t` from the i18n barrel (zero default-import consumers; all 41 sites use the named import); (5) removed the dead `export default en`/`export default ur` from the i18n catalog files (same class, found in the close-out analysis and fixed in-run). Verified each task: lint 0/0, typecheck clean, 107/107 tests across 11 suites (was 106/106; +1 new pinning test). Analysis: no console.log in src/; barrel discipline clean except one test deep-import of MALLS (new TODO item); issue #11 still OPEN (CI blocked — GITHUB_TOKEN lacks workflows permission); remaining unchecked items all blocked on owner/backend (token/session restore, login GET-to-POST, auth headers).

done today:  > todoAgent Ran (2026-11-10 16:54 UTC): done — 1 task: fixed the last barrel-bypass deep import — src/utils/__tests__/mallData.test.js now imports MALLS from "../../mock" instead of "../../mock/malls" (MALLS was already re-exported by src/mock/index.js; the 2026-10-30 sweep fixed the two app-code sites, this test was the remainder); TODO item marked [x]. Verified: npm run lint (0/0), npm run typecheck (clean), npm test — 107/107 across 11 suites. Analysis: no new problems found — no console.log/debug in src/, no deep folder imports outside tests/barrels, i18n 0 unreferenced of 341 keys, routes/RootStackParamList/capture-script/screens-barrel all in sync (33/33/33/36), no dead dependencies, no stray TODO/FIXME markers; no new TODO items added. Remaining unchecked items all blocked on owner/backend (issue #11 CI token 403 on workflow files; token/session restore needs owner direction; login GET-to-POST needs backend coordination; auth headers depend on token storage).

analysis only:> todoAgent Ran (2026-11-10 22:20 UTC): no actionable tasks — analysis added 1 new item to TODO.md (MallMate kit: 12 components, zero direct test coverage — grep-verified across all 11 suites; only Button/ListRow run indirectly via Signin/Profile renders). Verified baseline: lint 0/0, typecheck clean, tests 107/107, expo export:web compiles (documented reanimated warning only), i18n 0 unreferenced of 341 keys, no deep folder imports outside tests, routes/RootStackParamList/capture-script/screens-barrel in sync, no dead deps/secrets/broken doc links. Remaining unchecked items all blocked (issue #11 CI token; token/session restore, login GET-to-POST, auth headers need owner/backend).

done today:  > todoAgent Ran (2026-11-11 17:13 UTC): done — 1 task: added the first direct MallMate kit test coverage — 5 new suites / 31 tests under src/components/__tests__/ (Button: label, 44-48px target, pressed dim+restore driven by synthetic responder events, disabled/loading blocking with a11y state, unknown-variant fallback; TextInput: a11y label, changeText, focus/blur border swap, invalid colour + message, disabled rejects input; FilterSheet: hidden/visible, group per non-empty option set, option select + Any clear + open-now toggle through onChange, Show N/Apply + Clear all footer, both close targets — backdrop needs includeHiddenElements because the sheet's accessibilityViewIsModal hides it; StatusChip: all five tones + default/unknown muted fallbacks; CapabilityCard: degraded warning-toned Limited chip + non-pressable card). Mutation-checked: breaking the Pressable disabled wiring, the focus style, the tone map or the pressed style each fails its matching test. TODO item marked [x]. Verified: npm run lint (0/0), npm run typecheck (clean), npm test -- --ci — 138/138 across 16 suites (was 107/107 across 11). Analysis: routes/RootStackParamList/capture-script/screens-barrel in sync (33/33/33 + 5 tabs, 36 exports all registered), i18n 0 unreferenced of 341 keys, no console.log in src/, no deep folder imports, no tracked secrets/build artifacts, no dead deps (react-dom/react-native-web are the expo web build, react-native-screens the stack peer), README scripts/tree/key-modules claims verified. 1 new TODO item queued: ApiContants' deprecated Constants.manifest fallback (dev warning on every jest run; redundant on SDK 50). Remaining unchecked items all blocked (issue #11 CI token; token/session restore, login GET-to-POST, auth headers need owner/backend).

done today:  > todoAgent Ran (2026-11-11 23:46 UTC): done — 3 tasks: (1) dropped the deprecated `Constants.manifest` fallback from ApiContants (SDK 50 getter logged a deprecation warning on every jest run; env var -> expoConfig -> localhost precedence unchanged, README backend-config wording still matches); (2) bumped axios 1.6.7 -> 1.21.1 in the lockfile (2 high advisories cleared — SSRF + absolute-URL credential leakage; package.json untouched, no other package moved; blanket npm audit fix NOT used — it fails on the react-test-renderer/react@18.2.0 peer pin); (3) direct tests for the remaining 7 mallmate kit components (Badge, Card, SectionHeader, ListRow, EmptyState, ErrorState, LoadingState — 7 suites / 31 tests incl. pressed-state responder events and t() default wiring; mutation-checked all four gating branches). Verified per task: lint 0/0, typecheck clean, npm test — 169/169 across 23 suites (was 138/138), expo export:web compiles. Analysis: queued 1 new TODO item (remaining npm audit debt is Expo SDK 50 major-bound — 87 advisories need an owner decision on an SDK upgrade; no majors hand-bumped); i18n 0 unreferenced of 341 keys, barrels/deps/links/secrets/routes all clean. Remaining unchecked items all blocked (issue #11 CI token 403 on workflow files — re-verified OPEN; token/session restore, login GET-to-POST, auth headers need owner/backend).

analysis only:> todoAgent Ran (2026-11-12 17:39 UTC): no actionable tasks — analysis added 2 new items to TODO.md

done today:  > todoAgent Ran (2026-11-13 22:35 UTC): done — 2 tasks: (1) dropped the dead `Images` re-export from the constants barrel (zero `import { Images }` consumers; `src/constants/Images.js` + the FACEBOOK/GOOGLE PNGs kept parked for a future social re-wire); (2) deleted the byte-identical duplicate blueprint PRD (`MallMate_Project_Blueprint/docs/PRD.md` was a file-identical copy of the root `PRD.md` with zero references anywhere — root copy verified intact). Verified per task: lint 0/0, typecheck clean, npm test — 169/169 across 23 suites; `npx expo export:web` compiles (exit 0, documented reanimated warning only). Analysis: no new problems found — routes/RootStackParamList/navigation targets/capture script (37/37)/screens barrel in sync, i18n 0 unreferenced of 341 keys + 0 placeholder mismatches, no deep folder imports outside tests, no dead deps/secrets/console.log in src/, blueprint + README/AGENTS doc links resolve. Remaining unchecked items all blocked (issue #11 CI token 403 on workflow files; npm audit majors, token/session restore, login GET-to-POST, auth headers need owner/backend).

analysis only:> todoAgent Ran (2026-11-14 15:42 UTC): no actionable tasks — analysis added 3 new items to TODO.md

done today:  > todoAgent Ran (2026-11-14 21:36 UTC): done — 3 tasks: (1) fixed the invalid Ionicons name `door-outline` on the floor-map "Main entrance" pin (swapped to glyphmap-verified `enter-outline`) and extended `iconNames.test.js` to validate data-driven icon strings (`icon:` props, `POI_ICONS`/`EVENT_ICONS`/tab `icons` maps, `ICONS[…]` fallbacks) — the extended test was sanity-checked to fail on exactly `floors.js:88 door-outline` before the fix; (2) added `accessibilityRole="header"` to the three auth screens' top-bar titles (Signin/Signup/ForgotPassword) and RoutePreview's "Directions" section title — one role per screen, matching the 10/10 `headerTitle` convention; (3) resolved the two dead Theme tokens per token — `primaryPressed` WIRED into the kit Button's primary pressed state (the hex is documented in DESIGN_SYSTEM.md + PRD §8 so it was unimplemented spec; secondary/ghost keep the opacity dim, Card deliberately stays surfaceElevated — accent applies to accent controls) with mutation-checked tests, `fontFamily.fallback` dropped (zero consumers, no spec row). Verified per task: lint 0/0, typecheck clean, npm test — 171/171 across 23 suites (was 169/169); `npx expo export:web` compiles (exit 0, documented reanimated warning only). Analysis: 1 new item queued — section/sheet titles missing header roles on OrderDetail (Timeline/Items), the FilterSheet (title + group titles) and the OfferDetail terms sheet; everything else checked clean (i18n 341/341 en↔ur parity + 0 unreferenced keys + all literal and data-driven keys resolve + placeholder-arg parity, routes/RootStackParamList/capture script 37/37/screens barrel in sync, no dead theme tokens/deps/physical RTL props/hardcoded hex or font names/console.log in src/, storage keys and mock ids unique, no tracked secrets/build artifacts, README/AGENTS/blueprint links resolve). Remaining unchecked items all blocked (issue #11 CI token 403 on workflow files; npm audit majors, token/session restore, login GET-to-POST, auth headers need owner/backend).

done today:  > todoAgent Ran (2026-11-15 16:15 UTC): done — 1 task: added accessibilityRole="header" to the six section/sheet titles the 2026-11-14 analysis item named — OrderDetail Timeline/Items, FilterSheet title + both groupTitle sites (all five filter group titles), OfferDetail terms-sheet title; decided EmptyState/ErrorState titles stay unmarked (transient state messages, not structural headings — documented in TODO); new FilterSheet test asserts the roles. Verified: lint 0/0, typecheck clean, npm test — 172/172 across 23 suites; grep confirms every named site carries the role. Analysis: no new problems found — i18n 0 unreferenced of 341 keys (all 23 apparent misses are data-driven refs) + en/ur parity tests pass, routes/RootStackParamList/capture/screens-barrel in sync (33/33, barrel 36/36), no deep folder imports outside tests, no console.log or stray TODO/FIXME markers in src/, no hardcoded hex outside Theme/Colors/mock, no physical RTL margins, storage single-sourced (4 unique keys), doc relative links resolve, no tracked secrets/build artifacts, dead-dep flags all explained (webpack.config/@expo/webpack-config, App.js side-effect gesture-handler, navigator peers screens/web). Remaining unchecked items all blocked (issue #11 CI token 403 on workflow files — ci.yml still absent; npm audit majors, token/session restore need owner decision; login GET-to-POST, auth headers need backend/token storage).
done today:  > todoAgent Ran (2026-11-15 22:20 UTC): done — 1 task: cleared the non-major npm audit debt — the TODO item premise was stale (it claimed npm audit fix cannot resolve without breaking the react peer pin; the real blocker was the devDep range react-test-renderer "^18.2.0" re-resolving to 18.3.1, whose peer react@^18.3.1 clashes with Expo SDK 50 pinned react@18.2.0). Pinning react-test-renderer to exact 18.2.0 (already the lockfile version — zero actual package change) unblocks plain npm audit fix (NO --force): production tree 84 → 46 advisories (critical 4 → 1, high 41 → 20), full tree 97 → 61; package.json diff is the one pin, lockfile churn (187 entries) stays within existing semver ranges (the 3 majors are nested transitive copies whose parents already allowed them; direct deps moved only in-range — @react-navigation/* 6.x, @babel/core 7.x; expo/react/react-native/axios untouched). Original TODO item marked [x] with the correction; re-queued a narrowed owner-decision item for the remaining 46 (all major-bound: expo/@expo/* → SDK 58 line, @react-navigation/* → v7, react-native → 0.88, image-size fix outside metro ^1.0.2). Verified: npm ci from the new lockfile, npm run lint (0/0), npm run typecheck (clean), npm test -- --ci — 172/172 across 23 suites, npx expo export:web compiles (exit 0, documented reanimated warning only), npx expo install --check — up to date. Analysis: no new problems — i18n 341/341 en↔ur parity + placeholder tests pass, routes/RootStackParamList/capture (22 unique paths all resolve)/screens barrel 36/36 in sync, no console.log/.only/.skip or stray TODO/FIXME markers in src/, no deep folder imports outside tests, no hardcoded hex outside Theme/Colors/mock, no physical RTL margins, storage single-sourced (4 keys in StorageService), doc relative links resolve, no tracked secrets/build artifacts, no dead barrel exports (ApiClient test-only by design awaiting token storage; CustomFonts loaded by App.js), npm ls clean. Remaining unchecked items all blocked (issue #11 CI token 403 on workflow files; narrowed npm audit majors, token/session restore need owner decision; login GET-to-POST, auth headers need backend/token storage).
analysis only:> todoAgent Ran (2026-11-16 20:03 UTC): no actionable tasks — all 5 remaining unchecked TODO items re-verified blocked (CI workflow: workflow-file push still refused with the same GITHUB_TOKEN workflows-permission error — commented on issue #11; npm audit majors + token/session restore need owner decision; login GET-to-POST + auth headers need backend/token storage); analysis added 2 new items to TODO.md (FlagItem a11y gap + stale "parked" wording while it is live in CountryPickerScreen; Search ?q= deep-link param ignored by SearchScreen)
done today:  > todoAgent Ran (2026-11-17 18:15 UTC): done — 2 tasks: (1) FlagItem country-row a11y — added accessibilityRole="button" + accessibilityLabel "{name} {dial_code}" and minHeight: 44 (was ~30px, under the 44–48px rule) and dropped the stale "parked" wording (component doc comment, README kit bullet, RegisterPhoneScreen comment; CountryPickerScreen's "parked scaffold revived" kept as accurate history); new FlagItem suite (4 tests — labelled role, ≥44px target, rendering, onPress payload — mutation-checked: 3/4 fail pre-fix). (2) Search deep-link q param — SearchScreen seeds its query from route.params.q so the search runs on mount (RootStackParamList.Search typed { q?: string } | undefined) and the capture path moved q=pizza → q=spice (pizza matches no mock merchant — recaptured end-to-end: output/screens/search.png shows the seeded input + "1 result — Spice Route Kitchen"); new SearchScreen suite (3 tests — mutation-checked: 2/3 fail pre-wiring). Verified per task: npm run lint (0/0), npm run typecheck (clean), npm test — 179/179 across 25 suites (was 172/172 across 23). Analysis: 1 new item queued — 11 of 13 src/mock modules have zero test coverage (folder 26.2% stmts / 16.31% branch from its own suites; only otp.js 100% + merchants.js 57% have suites; the pure resolvers — capability gating + expiry filtering, floor/POI resolution, zone status, order next-state hints, scan outcomes, static route steps — are untested and no screen test imports them); everything else checked clean (routes/RootStackParamList/capture/screens barrel in sync 33/33/37/36, i18n 0 unreferenced + 0 duplicate keys, no deep folder imports outside tests, no console.log/.only/.skip/TODO/FIXME in src/, barrel exports all consumed — ApiClient + i18n en/ur/CATALOGS/getLocale are test+internal consumers by design, every dependency imported or wired via webpack.config/App.js/jest, README tree/scripts/automation table match reality, doc relative links resolve, no tracked secrets/generated artifacts). CI re-probed: the owner-reviewed ci.yml from issue #11 was committed on a branch and pushed — same GITHUB_TOKEN workflows-permission refusal; re-verification commented on issue #11. Remaining unchecked items all blocked (issue #11 CI; npm audit majors + token/session restore need owner decision; login GET-to-POST + auth headers need backend/token storage).

done today:  > todoAgent Ran (2026-11-18 18:12 UTC): done — 1 task: closed the 2026-11-17 mock-coverage item — 11 new focused suites under src/mock/__tests__/ covering every previously-uncovered resolver module (floors, foodCourt, events, homeContent, offers, navigation, orders, rewards, seatSessions, menus, malls) in the merchants.test.js style: capability gating ENABLED/DEGRADED/DISABLED, expired-campaign/offer/event filtering with injected `now`, zone Open/Busy/Full/Unknown incl. the exact 20% bound, order next-state hints vs terminal states + all 11 PRD state metas, scan outcome mapping + 2-hour session window, same-floor vs cross-floor route steps, formatPrice edge cases, mall capability-map invariants; no production code changed. Verified: lint 0/0, typecheck clean, npm test — 293/293 across 36 suites (baseline stash-checked 179/179 across 25); src/mock/ coverage 26.2% → 89.31% stmts / 16.31% → 80.14% branch. Analysis: no new problems found — i18n 341/341 en↔ur parity + 0 unreferenced keys, routes/RootStackParamList/capture (37 paths)/screens barrel in sync (33 stack + 5 tabs), no deep folder imports outside tests, no console.log/.only/.skip/TODO/FIXME in src/, no hardcoded hex outside Theme/Colors/mock, no physical RTL margins, storage single-sourced (4 keys), all 19 deps wired, doc links resolve, no tracked secrets/artifacts, expo install --check up to date; npm audit drifted to 44 prod (from 46 — registry drift, still all semver-major). Remaining unchecked items all blocked (CI re-probed 2026-11-18: same workflows-permission refusal, commented on issue #11; npm audit majors + token/session restore need owner decision; login GET-to-POST + auth headers need backend/token storage).
analysis only:> todoAgent Ran (2026-11-19 18:32 UTC): no actionable tasks — analysis added 4 new items to TODO.md

done today:  > todoAgent Ran (2026-11-20 17:43 UTC): done — 4 tasks, all doc-only, from the 2026-11-19 analysis queue: (1) README "persisted to AsyncStorage" user-state claim corrected — UserProvider is write-only (setUser/removeUser; no hydration, StorageService.getUser has zero production callers), bullet now says sign-in/sign-out WRITE the user, restore-on-launch deferred (app boots at Signin), mall/favorites contexts do hydrate; (2) README project tree — navigators/ line no longer claims "context providers" (they are defined in src/utils/, merely composed by navigators/index.js; utils/ line labelled accordingly) and the six README-linked top-level entries the tree omitted (scripts/, .github/workflows/, MallMate_Project_Blueprint/, TODO.md, webpack.config.js, tsconfig.json) added; (3) README tech-stack table — @react-navigation/bottom-tabs added to Navigation (powers MainTabNavigator), new i18n row (expo-localization) and Config row (expo-constants), all verified installed + imported at the named sites; (4) AGENTS.md export-convention bullet rewritten — constants files mostly default-export and utils are mixed (providers named, hooks default), consumers see named imports via folder barrels re-exporting defaults under names. Verified per task: re-read/grep of the claims against source (userData.js, navigators/index.js, package.json imports, constants/utils export shapes); npm run lint (0/0) + npm run typecheck clean each time; final npm test — 293/293 across 36 suites. Analysis: no new problems found — i18n 0 unreferenced of 341 keys, routes/RootStackParamList/capture (37 paths)/screens barrel in sync (33 stack + 5 tabs), no console.log/.only/.skip in src/, no deep folder imports outside tests, no physical RTL margins or stray hardcoded hex, no tracked secrets/build artifacts, doc relative links resolve, README scripts table matches package.json, dead-dep flags all documented (react-dom/react-native-web = expo web, react-native-screens = stack peer). No new TODO items. Remaining 5 unchecked items all blocked/owner-decision (issue #11 CI token 403 on workflow files; npm audit majors + token/session restore need owner decision; login GET-to-POST + auth headers need backend/token storage).
analysis only:> todoAgent Ran (2026-11-22 17:10 UTC): no actionable tasks — analysis added 1 new item to TODO.md

analysis only:> todoAgent Ran (2026-11-24 20:17 UTC): no actionable tasks — analysis added 3 new items to TODO.md (README automation row overstates issue-path merge for PR triggers; 4 stale file references in TODO.md; 3 dead code leftovers: orphaned Images.js + dead isCapabilityOn/createApiClient exports)
