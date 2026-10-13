# TODO

Living backlog for the React Native login / food‑ordering app. Move items to
**Done** when finished.

## P0 — App is broken / blocking

- [x] **Install a vector icon package.** Migrated all imports
      (`SigninScreen.js`, `FoodCard.js`, `RestaurantCard.js`,
      `RestaurantMediumCard.js`) from `react-native-vector-icons` to
      `@expo/vector-icons` (bundled with Expo — no new package needed).
      Also gave `RestaurantMediumCard`'s empty `<FontAwesome />` a
      `name="star"` so the rating row renders.
- [x] **Fix hook misuse in `SigninScreen.signIn()`** (`src/screens/SigninScreen.js`):
  - `useUserManagement()` is now called at the top level of the component.
  - The response is correctly referenced as `response?.data` (was the
    undefined `loginResponse`).
- [x] **Fix duplicate keys in `src/constants/ApiContants.js`.** Renamed to
      `ALL_RESTAURANTS` (`/getAllRestaurants`) and `RESTAURANT`
      (`/getRestaurant`); removed the `"/test"` shadow of `BOOKMARK` so
      `BookmarkService` hits `/bookmark` again. Updated `RestaurantService`
      (it previously referenced a non‑existent `RESTAURANT` key, producing
      `.../apiundefined`).
- [x] **Make the backend URL configurable.** `ApiContants.js` now resolves the
      base URL from `EXPO_PUBLIC_BACKEND_URL` env var → `app.json`
      `extra.backendUrl` → `http://localhost:3001` fallback. The hardcoded
      IP in `AuthenticationService.test()` was replaced with the shared
      `BACKEND_BASE_URL`.

## P1 — Missing screens & flow

- [ ] `SignupScreen` (referenced by `navigation.navigate("Signup")` in
      `SigninScreen` — currently crashes navigation).
- [ ] `ForgotPasswordScreen` (referenced by `navigation.navigate("ForgotPassword")`).
- [ ] `RegisterPhoneScreen` + `VerificationScreen` (stubbed as comments in
      `src/navigators/index.js` and `src/screens/index.js`).
- [ ] Post‑login main flow: home / restaurants, restaurant detail, food detail,
      cart, bookmarks, profile. Components already exist
      (`RestaurantCard`, `RestaurantMediumCard`, `FoodCard`, `WelcomeCard`,
      `CategoryMenuItem`, `CategoryListItem`) but no screens use them.
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
- [ ] Persist the token and restore session on app launch; wire
      `refreshToken()` and auth headers (`utils/Generator.js#authHeader`) into
      the services (currently commented out).
- [ ] Decide on a state library (Redux Toolkit vs React Query vs Context) and
      remove the commented‑out `react-redux` / `src/actions` leftovers in
      `FoodCard.js` and `RestaurantCard.js`.

## P3 — API & data cleanup

- [ ] `AuthenticationService.login` performs a **GET with a request body** and
      stringifies `user` into the URL path (`/api/getUser/{json}`). Redesign to a
      proper `POST /login`.
- [ ] Remove the hardcoded `test()` endpoint / dead `ngrok` URLs from
      `AuthenticationService.js`.
- [ ] Consolidate `resdata.js` / `fooddata.js` / `Mock.js` mock data vs the live
      API; decide which is the source of truth.
- [ ] Services ignore auth headers everywhere — add them consistently once token
      storage works.

## P4 — Tooling & quality

- [ ] Add ESLint (`eslint-config-universe` or similar) + `npm run lint`.
- [ ] Add tests (Jest + `@testing-library/react-native`) for services and the
      sign‑in flow; add `npm test`.
- [ ] Consider TypeScript migration for screens/services.
- [ ] Add `react-native-reanimated` / gesture handler setup notes if the stack
      navigator needs them.
- [ ] Review `app.json` (icon/splash/name `user_logsignin`) and rename the
      package to match the product.

---

## Done

- [x] Project scaffolded with Expo SDK 50, Poppins fonts, navigation skeleton.
- [x] Sign In screen with validation, loading animation and error display.
- [x] Service layer (`AuthenticationService`, `RestaurantService`, `FoodService`,
      `CartService`, `BookmarkService`, `UserService`, `StaticImageService`,
      `StorageService`).
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
