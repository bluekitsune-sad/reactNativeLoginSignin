# AGENTS.md

Guidance for AI agents (and humans) working on this repository.

## What this project is

An **Expo SDK 50 / React Native 0.73** JavaScript app. Historically a food
ordering scaffold (sign‑in flow implemented); **it is now becoming the
MallMate multi‑mall app** (see below). TypeScript is introduced incrementally
(`tsconfig.json` with `allowJs`); new type files live in `src/types/`.
`npm run lint` (ESLint) and `npm run typecheck` (`tsc --noEmit`) exist; there
is a `test` script (`npm test`, `jest-expo`) with first suites under
`src/*/__tests__/`.

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

There is now a `lint` script (ESLint + Prettier via `eslint-config-universe`,
`npm run lint`), `npm run typecheck` (`tsc --noEmit`) and a `test` script
(`jest-expo` preset, `npm test`; AsyncStorage is mapped to its jest mock via
`moduleNameMapper` in `package.json`). Do not claim verification you cannot
perform; at minimum re-read the files you changed and keep JSX/imports
consistent, and run `npm run lint` (legacy files emit warnings — only
introduce no new errors) plus `npm test` when you touch covered code.

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
- **New MallMate network calls go through the shared API client helper**
  (`src/services/apiClient.js`) — see "API client helper" below.
- **Design tokens** are in `src/constants/Colors.js` and `src/constants/Fonts.js`.
  Use them; don't inline hex colors or font names. New MallMate code uses
  `src/constants/Theme.js` instead (see the MallMate section).
- **Styling** is `StyleSheet.create` at the bottom of each component file, using
  `Display.setWidth/setHeight` for relative sizing.
- **State:** Redux was removed (and the old commented‑out
  `useDispatch`/`useSelector`/`src/actions` leftovers have been cleaned up).
  Current state lives in local `useState` plus React Context providers
  (`useUserManagement` in `src/utils/userData.js`, plus the mall and
  favorites contexts).

### API client helper (`src/services/apiClient.js`)

New MallMate network code should use the shared typed axios wrapper instead of
calling `axios` directly:

```js
import { ApiClient } from "../services";
// or: import ApiClient from "../services/apiClient";

const res = await ApiClient.get("/malls");
if (res.status) {
  // res.data is the payload
} else {
  // res.message is a user-safe string; the call never threw
}
```

- **Base URL** is always `ApiContants.BACKEND_API.BASE_API_URL` (resolved in
  `ApiContants.js` from `EXPO_PUBLIC_BACKEND_URL` / `app.json`
  `extra.backendUrl`). Do not pass a different host unless you have a
  documented reason.
- **Never throws.** `get`/`post`/`put`/`patch`/`del` and `request` always
  resolve to `{ status: boolean, message: string, data?: any }` — the same
  envelope legacy services already return. HTTP/network failures become
  `{ status: false, message }`.
- **Envelope passthrough.** If the response body already looks like
  `{ status: boolean, ... }` it is passed through; otherwise success
  (`2xx`) yields `{ status: true, message, data }` where `data` is the body
  (or its nested `data` field).
- **Types** live in `src/types/api.ts` (`ApiEnvelope<T>`,
  `ApiSuccessEnvelope`, `ApiFailureEnvelope`) and are re-exported from
  `src/types`. Prefer the helper over hand-rolling envelope shaping.
- **Auth headers are not wired yet** (token restore is still on the legacy
  backlog). When session restore lands, attach the bearer token here once —
  not in each service.
- Prefer migrating a legacy service onto the helper only when you touch that
  service; do not mass-rewrite existing endpoints as a drive-by.

## Known landmines (read before editing)

1. **Dead third‑party API:** `countryflags.io` in `ApiContants.COUNTRY_FLAG`.
2. **`AuthenticationService.login`** still does a GET with the credentials
   JSON‑stringified into the URL path (see TODO P3) — do not copy that pattern
   into new services.
3. **Web build:** `webpack.config.js` maps node's `crypto` to `false` so
   Expo web compiles (`expo-modules-core/uuid`). Do not delete it.

Previously documented and now fixed (do not regress): icons come from
`@expo/vector-icons`; `SigninScreen` calls `useUserManagement` at the top level
with `response?.data` and declares it only once; `ApiContants.js` has unique
keys (`ALL_RESTAURANTS`, `RESTAURANT`, `BOOKMARK`); the backend URL is
configurable via `EXPO_PUBLIC_BACKEND_URL` / `app.json` `extra.backendUrl`
(`expo-constants`); `StorageService` serializes with `JSON.stringify`/
`JSON.parse` on the shared `"user"` key; `useUserManagement` is a React
Context (`UserProvider`) shared across screens; `SignupScreen` and
`ForgotPasswordScreen` exist and are registered in the navigator; the
commented‑out `react-redux`/`src/actions` leftovers in `FoodCard.js` and
`RestaurantCard.js` are removed (state is Context + local `useState`).

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
