# React Native Login / Sign In (Expo)

A food‑ordering style mobile app built with **Expo** and **React Navigation**. The
shipped flow today is a Sign In screen backed by a REST backend, with a full set of
reusable components, services and constants already in place for the rest of the
food‑ordering experience (restaurants, food, cart, bookmarks).

> Status: **work in progress.** Only the `Signin` screen is registered in the
> navigator — see [TODO.md](./TODO.md) for the missing screens and known bugs.

---

## Features

- Sign In screen with username / password, show/hide password, "Remember me"
  toggle, loading state (Lottie animation) and inline error message.
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
| Language   | JavaScript (JSX) |
| Navigation | `@react-navigation/native` + `@react-navigation/stack` |
| HTTP       | `axios` |
| Storage    | `@react-native-async-storage/async-storage` |
| Animation  | `lottie-react-native`, `Animated` API |
| Fonts      | `expo-font` (Poppins) |
| Safe area  | `react-native-safe-area-context` |

> **Note:** `react-native-vector-icons` (`Ionicons`, `Feather`, `AntDesign`,
> `FontAwesome`) is imported by several files but is **not** listed in
> `package.json`. Install it (or switch to `@expo/vector-icons`) before running —
> see [TODO.md](./TODO.md).

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

The API base URL is hardcoded in `src/constants/ApiContants.js`:

```js
const BACKEND_BASE_URL = "http://192.168.0.103:3001";
```

Change it to your machine's LAN IP (or `http://localhost:3001` for a simulator)
so the device can reach the server. All endpoints (`/api/register`, `/api/getUser/`,
`/api/cart`, `/api/bookmark`, `/api/getfood`, …) are derived from this constant.

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
    ├── navigators/            # React Navigation stack (currently: Signin only)
    ├── screens/               # App screens (currently: SigninScreen)
    ├── services/              # axios API services + AsyncStorage wrapper
    └── utils/                 # Display helpers, auth header, user state hook
```

### Key modules

| Path | Purpose |
| ---- | ------- |
| `App.js` | Loads custom fonts, then mounts `<Navigators />`. |
| `src/navigators/index.js` | Root `Stack.Navigator`; header hidden on all screens. |
| `src/screens/SigninScreen.js` | Sign in form and submit logic. |
| `src/services/AuthenticationService.js` | Register / login / token refresh. |
| `src/utils/Display.js` | `setWidth(w)` / `setHeight(h)` percentage helpers. |
| `src/utils/userData.js` | `useUserManagement` hook for the current user. |
| `src/constants/Colors.js` | Design tokens (green primary `#0A8791`, etc.). |

## Available scripts

| Script | Description |
| ------ | ----------- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Start on Android. |
| `npm run ios` | Start on iOS. |
| `npm run web` | Start the web build. |

There is currently **no** lint, typecheck or test script — see [TODO.md](./TODO.md).

## Contributing

1. Fork and create a feature branch.
2. Keep changes scoped; follow the existing folder layout and barrel files
   (`src/*/index.js`) when adding modules.
3. Update [TODO.md](./TODO.md) / this README if you change behaviour.
4. Open a pull request.

## License

This project is private (`"private": true` in `package.json`); no license file is
currently attached.
