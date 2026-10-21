# React Native Login / Sign In (Expo)

A food‑ordering style mobile app built with **Expo** and **React Navigation**. The
shipped flow today is a Sign In screen backed by a REST backend, with a full set of
reusable components, services and constants already in place for the rest of the
food‑ordering experience (restaurants, food, cart, bookmarks).

> Status: **work in progress.** The `Signin`, `Signup` and `ForgotPassword`
> screens are registered in the navigator — see [TODO.md](./TODO.md) for the
> remaining screens and known gaps.

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
  `useUserManagement`), persisted to `AsyncStorage`.
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
  parked `FlagItem` country-code row.
- English + Urdu string catalogs with a shared `t()` helper (`src/i18n/`).
- MallMate preview data for merchants, menus, offers, events, orders, maps
  and rewards in `src/mock/` (the single source for mock data; the legacy
  `resdata`/`fooddata`/`Mock` constants were removed as dead code).

## Tech stack

| Layer      | Choice |
| ---------- | ------ |
| Framework  | React Native `0.73.6` via Expo SDK `50` |
| Language   | JavaScript (JSX); TypeScript converted file-by-file (`allowJs`, first slice: `apiClient.ts`, `ProfilePlaceholderScreen.tsx`) |
| Navigation | `@react-navigation/native` + `@react-navigation/stack` + `react-native-gesture-handler` |
| HTTP       | `axios` |
| Storage    | `@react-native-async-storage/async-storage` |
| Animation  | `Animated` API |
| Fonts      | `expo-font` (Inter via `@expo-google-fonts/inter`) |
| Icons      | `@expo/vector-icons` (Ionicons, Feather, AntDesign, FontAwesome) |
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

The API base URL is resolved in `src/constants/ApiContants.js` with the
following precedence:

1. `EXPO_PUBLIC_BACKEND_URL` environment variable (e.g.
   `EXPO_PUBLIC_BACKEND_URL=http://192.168.1.10:3001 npm start`)
2. `extra.backendUrl` in `app.json`
3. Fallback: `http://localhost:3001`

To point the app at your machine, edit `app.json`:

```json
"extra": {
  "backendUrl": "http://192.168.0.103:3001"
}
```

All endpoints (`/api/register`, `/api/getUser/`, `/api/cart`, `/api/bookmark`,
`/api/getfood`, …) are derived from this constant.
The API base URL is no longer hardcoded. It is resolved in
`src/constants/ApiContants.js` in this order:

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

All endpoints (`/api/register`, `/api/getUser/`, `/api/cart`, `/api/bookmark`,
`/api/getfood`, …) are derived from this base URL.

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
├── assets/                    # Expo icons / splash images
└── src/
    ├── assets/                # Retained image assets (social-auth placeholders)
    ├── components/            # UI kit: mallmate/ components + Separator/ToggleButton/FlagItem
    ├── constants/             # Colors, Images, ApiContants, Theme, Capabilities, CustomFonts, CountryCode
    ├── i18n/                  # English + Urdu string catalogs + t() helper
    ├── mock/                  # MallMate preview data (merchants, offers, events, ...)
    ├── navigators/            # Root stack + MallMate bottom tabs (Main), context providers
    ├── screens/               # Auth + MallMate screens (home, explore, map, rewards, ...)
    ├── services/              # axios API services + AsyncStorage wrapper (auth, storage, ApiClient)
    ├── types/                 # TypeScript types (entities, API envelope, navigation)
    └── utils/                 # Display helpers, user/mall/favorites contexts
```

### Key modules

| Path | Purpose |
| ---- | ------- |
| `App.js` | Loads custom fonts, then mounts `<Navigators />`. |
| `src/navigators/index.js` | Root `Stack.Navigator`; wraps the app in `<UserProvider>`. |
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
   (`src/*/index.js`) when adding modules.
3. Update [TODO.md](./TODO.md) / this README if you change behaviour.
4. Open a pull request.

## Automation — the software factory

This repo runs itself through two GitHub Actions workflows (both heavily
commented, see `.github/workflows/`). **This repo's Actions policy does not
allow workflow-created PRs, so the factory lands everything on one
long-lived branch: `work`.** You merge `work` into `main` manually whenever
you like:

```bash
git checkout main && git merge work && git push
```

| Workflow | Trigger | What it does |
| -------- | ------- | ------------ |
| `opencode.yml` | Issues and `/opencode` comments you open | Implements on an `opencode/*` branch based on `work`, merges it straight into `work` (no PR), comments the result on your issue. Blocked? It opens a question issue @-mentioning you instead of guessing. |
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
