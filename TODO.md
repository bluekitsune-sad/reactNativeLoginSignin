# TODO

Living backlog for this repository. Move items to **Done** when finished.
todoAgent (the daily workflow) picks **one** item from the topmost section
that has actionable work — start with the MallMate section below.

## MallMate — Phase 1 mobile foundation (top priority)

This repo is becoming the **MallMate** multi-mall app. The full blueprint
lives in [`MallMate_Project_Blueprint/`](./MallMate_Project_Blueprint/README.md)
(PRD, API spec, ERD, screen inventory, design system). Implement one item
per run, following the blueprint docs linked in each item. Keep changes
small and verifiable; update this file and the README when done.

- [ ] **Load the Inter font family** for MallMate typography (bundled TTF
      or `@expo-google-fonts/inter`) in `App.js`, exposed through
      `Fonts.js`. Blueprint: `04-mobile/DESIGN_SYSTEM.md`.
- [ ] **Bottom tab navigation**: Home | Explore | Map | Rewards | Profile
      with placeholder screens (`src/screens/home/HomeScreen.js`, etc.),
      keeping the existing auth stack; after successful sign-in navigate to
      the tabs. Blueprint: `04-mobile/SCREEN_INVENTORY.md`, PRD section 4.
- [ ] **Mall selector screen** with mock data for one mall (LuckyOne:
      name/logo/hours); persist the selection in a small `MallContext`
      readable by other screens. Blueprint: PRD section 5.2.
- [ ] **Capability-driven home skeleton**: render only ENABLED capability
      cards for the selected mall (use `src/constants/Capabilities.js` and
      mock config); hide DISABLED, label DEGRADED. Blueprint: PRD 5.3.
- [ ] **Typed API client helper**: axios wrapper using `ApiContants` base
      URL and the services error envelope `{status, message, data}`;
      document it in AGENTS.md. Blueprint: `03-api/API_SPEC.md`.
- [ ] **Screenshots for new screens**: once the local capture pipeline is
      working, extend `scripts/capture-screens.mjs` to include the
      MallMate screens in `output/` (workflow pending).

### Blocked — do NOT implement until the owner decides

P0 business decisions from
[`08-decisions/OPEN_DECISIONS.md`](./MallMate_Project_Blueprint/08-decisions/OPEN_DECISIONS.md):
payment model, merchant settlement, payment provider choice, LuckyOne data
and branding permissions, ordering scope, loyalty funding, ranking data
coverage, merchant onboarding verification. **No backend, payments, loyalty
ledger, or ranking code until these are resolved.**

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
