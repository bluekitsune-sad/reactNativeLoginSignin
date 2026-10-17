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
  toggle, loading state (Lottie animation) and inline error message.
- Sign Up screen (username / email / password with validation) and a Forgot
  Password screen (email lookup via `user-exist`).
- Shared user state through a React Context (`UserProvider` +
  `useUserManagement`), persisted to `AsyncStorage`.
- Facebook / Google social sign‑in buttons (UI only, not wired up).
- Authentication service (`register`, `login`, `checkUserExist`, `refreshToken`)
  built on `axios`.
- Additional services ready to use: `RestaurantService`, `FoodService`,
  `CartService`, `BookmarkService`, `UserService`, `StorageService`,
  `StaticImageService`.
- Local persistence via `AsyncStorage` (`StorageService`).
- Poppins font family loaded at boot through `expo-font`.
- Reusable UI kit: `Separator`, `ToggleButton`, `WelcomeCard`, `FoodCard`,
  `RestaurantCard`, `RestaurantMediumCard`, `CategoryMenuItem`,
  `CategoryListItem`, `FlagItem`.
- Mock / seed data for restaurants and food (`src/constants/resdata.js`,
  `src/constants/fooddata.js`) plus a large local image gallery.

## Tech stack

| Layer      | Choice |
| ---------- | ------ |
| Framework  | React Native `0.73.4` via Expo SDK `50` |
| Language   | JavaScript (JSX); TypeScript types added incrementally (`allowJs`) |
| Navigation | `@react-navigation/native` + `@react-navigation/stack` |
| HTTP       | `axios` |
| Storage    | `@react-native-async-storage/async-storage` |
| Animation  | `lottie-react-native`, `Animated` API |
| Fonts      | `expo-font` (Poppins) |
| Icons      | `@expo/vector-icons` (Ionicons, Feather, AntDesign, FontAwesome) |
| Safe area  | `react-native-safe-area-context` |

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
    ├── assets/                # Fonts (Poppins), images, gallery, posters, logos
    ├── components/            # Reusable UI (FoodCard, RestaurantCard, ...)
    ├── constants/             # Colors, Fonts, Images, ApiContants, mock data
    ├── navigators/            # React Navigation stack (Signin, Signup, ForgotPassword)
    ├── screens/               # App screens (SigninScreen, SignupScreen, ...)
    ├── services/              # axios API services + AsyncStorage wrapper
    ├── types/                 # Incremental TypeScript entity types (MallMate)
    └── utils/                 # Display helpers, auth header, user state context
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
| `src/constants/Colors.js` | Design tokens (green primary `#0A8791`, etc.). |

## Available scripts

| Script | Description |
| ------ | ----------- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Start on Android. |
| `npm run ios` | Start on iOS. |
| `npm run web` | Start the web build. |
| `npm run typecheck` | Run `tsc --noEmit` over the incremental TypeScript setup. |
| `npm run lint` | Run ESLint (with Prettier rules via `eslint-config-universe`). |

There is currently **no** test script — see [TODO.md](./TODO.md).
`npm run lint` reports pre-existing style warnings on legacy files; they are
non-blocking (warning level) pending a repo-wide `--fix` pass.

## Contributing

1. Fork and create a feature branch.
2. Keep changes scoped; follow the existing folder layout and barrel files
   (`src/*/index.js`) when adding modules.
3. Update [TODO.md](./TODO.md) / this README if you change behaviour.
4. Open a pull request.

## License

MIT — see [LICENSE](./LICENSE).

todoAgent Ran (2026-10-15): done — added ESLint + Prettier (eslint-config-universe) with npm run lint
> todoAgent Ran (2026-10-16): done — introduced TypeScript incrementally (tsconfig with allowJs, src/types/mallmate.ts entity types from the ERD, npm run typecheck)
