# AGENTS.md

Guidance for AI agents (and humans) working on this repository.

## What this project is

An **Expo SDK 50 / React Native 0.73** JavaScript app. Historically a food
ordering scaffold (sign‑in flow implemented); **it is now becoming the
MallMate multi‑mall app** (see below). TypeScript is introduced incrementally
(`tsconfig.json` with `allowJs`); new type files live in `src/types/`. There
are still no tests and no linter — those are on the backlog.

Entry point: `App.js` → loads fonts → renders `src/navigators/index.js`.

## MallMate — the direction

The product blueprint lives in
[`MallMate_Project_Blueprint/`](./MallMate_Project_Blueprint/README.md)
(source of truth for features, design and API shape). Read, in order:

1. `MallMate_Project_Blueprint/PRD.md`
2. `MallMate_Project_Blueprint/08-decisions/OPEN_DECISIONS.md`
3. Then whichever blueprint doc your task links to.

Rules for agents working toward MallMate:

- **The actionable queue is the "MallMate" section of `TODO.md`.** Pick one
  small item, implement it, verify it, mark it done. Never attempt a whole
  phase.
- **Respect the "Blocked" list in `TODO.md`.** Payments, loyalty ledger,
  rankings and backend work are blocked on business decisions — do not
  implement them, even partially.
- **New MallMate code uses `src/constants/Theme.js`** (Midnight Graphite +
  Emerald tokens) and `src/constants/Capabilities.js` (capability keys /
  statuses). Legacy screens still use `Colors.js` — do not rewrite them
  just to swap tokens.
- **TypeScript is introduced incrementally** (`allowJs`): new type files are
  `.ts`, existing `.js` files stay as they are unless a TODO item says to
  convert them.
- The blueprint recommends a feature‑folder layout long term
  (`01-architecture/PROJECT_STRUCTURE.md`); keep new screens organized under
  `src/screens/<area>/` so a later restructure is cheap.

## Commands

```bash
npm install          # install dependencies
npm start            # expo start (dev server)
npm run android      # expo start --android
npm run ios          # expo start --ios
npm run web          # expo start --web
```

There is no `lint` or `test` script; `npm run typecheck` runs `tsc --noEmit`.
Do not claim verification you cannot perform; at minimum re-read the files you
changed and keep JSX/imports consistent.

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
  Use them; don't inline hex colors or font names. New MallMate code uses
  `src/constants/Theme.js` instead (see the MallMate section).
- **Styling** is `StyleSheet.create` at the bottom of each component file, using
  `Display.setWidth/setHeight` for relative sizing.
- **State:** Redux was removed; commented‑out `useDispatch`/`useSelector` and
  `src/actions` imports are leftovers. Current state lives in local `useState`
  plus the `useUserManagement` hook in `src/utils/userData.js`.

## Known landmines (read before editing)

1. **Dead third‑party API:** `countryflags.io` in `ApiContants.COUNTRY_FLAG`.
2. **No `src/actions` directory** even though commented code imports from it
   (`FoodCard.js`, `RestaurantCard.js`).
3. **`AuthenticationService.login`** still does a GET with the credentials
   JSON‑stringified into the URL path (see TODO P3) — do not copy that pattern
   into new services.
4. **Web build:** `webpack.config.js` maps node's `crypto` to `false` so
   Expo web compiles (`expo-modules-core/uuid`). Do not delete it.

Previously documented and now fixed (do not regress): icons come from
`@expo/vector-icons`; `SigninScreen` calls `useUserManagement` at the top level
with `response?.data` and declares it only once; `ApiContants.js` has unique
keys (`ALL_RESTAURANTS`, `RESTAURANT`, `BOOKMARK`); the backend URL is
configurable via `EXPO_PUBLIC_BACKEND_URL` / `app.json` `extra.backendUrl`
(`expo-constants`); `StorageService` serializes with `JSON.stringify`/
`JSON.parse` on the shared `"user"` key; `useUserManagement` is a React
Context (`UserProvider`) shared across screens; `SignupScreen` and
`ForgotPasswordScreen` exist and are registered in the navigator.

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
