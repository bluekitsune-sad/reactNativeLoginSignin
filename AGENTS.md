# AGENTS.md

Guidance for AI agents (and humans) working on this repository.

## What this project is

An **Expo SDK 50 / React Native 0.73** JavaScript app for food ordering. The
sign‑in flow is implemented; most of the app is scaffolding (components,
services, mock data) waiting to be wired up. There is **no TypeScript, no tests,
no linter** in the repo.

Entry point: `App.js` → loads Poppins fonts → renders `src/navigators/index.js`.

## Commands

```bash
npm install          # install dependencies
npm start            # expo start (dev server)
npm run android      # expo start --android
npm run ios          # expo start --ios
npm run web          # expo start --web
```

There is no `lint`, `typecheck` or `test` script. Do not claim verification you
cannot perform; at minimum re-read the files you changed and keep JSX/imports
consistent.

## Architecture rules

- **Barrel files.** Every folder has an `index.js` aggregator
  (`src/components/index.js`, `src/constants/index.js`, `src/screens/index.js`,
  `src/services/index.js`, `src/utils/index.js`). When you add a module, export it
  from the barrel too, and import via the folder (`../components`,
  `../services`), not deep relative paths.
- **Screens live in `src/screens/`,** registered in `src/navigators/index.js`.
  A screen must be exported from `src/screens/index.js` *and* added to the
  navigator. Several screens are stubbed as comments (`SignupScreen`,
  `ForgotPasswordScreen`, `RegisterPhoneScreen`, `VerificationScreen`) — they do
  not exist yet, and `SigninScreen` already calls `navigation.navigate("Signup")`
  and `navigate("ForgotPassword")`.
- **Network calls only in `src/services/`.** Services return a stable envelope:
  `{ status: boolean, message: string, data?: any }`. Keep that shape.
- **API paths and base URL come from `src/constants/ApiContants.js`.** Never
  hardcode a new host inside a service (the existing hardcoded IPs are legacy
  debt — do not add more).
- **Design tokens** are in `src/constants/Colors.js` and `src/constants/Fonts.js`.
  Use them; don't inline hex colors or font names.
- **Styling** is `StyleSheet.create` at the bottom of each component file, using
  `Display.setWidth/setHeight` for relative sizing.
- **State:** Redux was removed; commented‑out `useDispatch`/`useSelector` and
  `src/actions` imports are leftovers. Current state lives in local `useState`
  plus the `useUserManagement` hook in `src/utils/userData.js`.

## Known landmines (read before editing)

1. **`useUserManagement` is a plain hook, not a context** — each call gets fresh
   state, so it cannot share the logged‑in user across screens yet.
2. **Dead third‑party API:** `countryflags.io` in `ApiContants.COUNTRY_FLAG`.
3. **No `src/actions` directory** even though commented code imports from it
   (`FoodCard.js`, `RestaurantCard.js`).
4. **`AuthenticationService.login`** still does a GET with the credentials
   JSON‑stringified into the URL path (see TODO P3) — do not copy that pattern
   into new services.
5. **Screens still missing:** `SigninScreen` navigates to `"Signup"` and
   `"ForgotPassword"` but neither screen nor route exists yet.

Previously documented and now fixed (do not regress): icons come from
`@expo/vector-icons`; `SigninScreen` calls `useUserManagement` at the top level
with `response?.data`; `ApiContants.js` has unique keys (`ALL_RESTAURANTS`,
`RESTAURANT`, `BOOKMARK`); the backend URL is configurable via
`EXPO_PUBLIC_BACKEND_URL` / `app.json` `extra.backendUrl` (`expo-constants`);
`StorageService` serializes with `JSON.stringify`/`JSON.parse` on the shared
`"user"` key.

## Conventions

- JavaScript only (`.js`, JSX), double quotes in newer files, 2‑space indent.
- Default exports for screens/services/components; named exports for constants
  and utils.
- Service functions are `async` and never throw — they catch and return
  `{ status: false, message }`.
- Comments in the codebase are often commented‑out legacy code; don't assume
  they are intentional documentation.
- Keep `App.js` minimal (font loading + navigator mount).

## When you finish a task

- Update `TODO.md`: move completed items to Done, add any new debt you created.
- Update `README.md` if you changed setup steps, scripts or architecture.
- Do not add dependencies without checking `package.json` first.
