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

1. **`react-native-vector-icons` is not installed.** `SigninScreen.js`,
   `FoodCard.js`, `RestaurantCard.js`, `RestaurantMediumCard.js` import
   `Ionicons`/`Feather`/`AntDesign`/`FontAwesome` from it, but it is absent from
   `package.json`. Either add it (or `@expo/vector-icons`) or leave a note in
   `TODO.md`; do not silently break bundling.
2. **Hook misuse in `src/screens/SigninScreen.js` (`signIn`).**
   `useUserManagement()` is called *inside* the async callback and the result is
   referenced as `loginResponse` (undefined variable). This throws at runtime.
   Hooks must be called at the top level of the component body.
3. **Duplicate keys in `src/constants/ApiContants.js`:** `ALLRESTAURANT` and
   `BOOKMARK` are declared twice; the second wins, so `BOOKMARK` resolves to
   `"/test"` and breaks `BookmarkService`. Fixing means renaming the keys and
   updating consumers.
4. **`StorageService`:** `setUser` stores an object (AsyncStorage requires a
   string) and `getUser` reads the `"token"` key while `setUser` writes `"user"`.
5. **`useUserManagement` is a plain hook, not a context** — each call gets fresh
   state, so it cannot share the logged‑in user across screens yet.
6. **Hardcoded backend** `http://192.168.0.103:3001` in `ApiContants.js` and in
   `AuthenticationService.test()`.
7. **Dead third‑party API:** `countryflags.io` in `ApiContants.COUNTRY_FLAG`.
8. **No `src/actions` directory** even though commented code imports from it.

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
