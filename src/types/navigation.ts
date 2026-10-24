import type { StackScreenProps } from "@react-navigation/stack";

/**
 * Root stack route → params map (mirrors `src/navigators/index.js`).
 *
 * Incremental TypeScript migration (TODO "Consider TypeScript migration for
 * screens/services"): converted `.tsx` screens type their props as
 * `RootStackScreenProps<"RouteName">`. JS screens keep working unchanged
 * (`checkJs` is off) — when one is converted, keep this map in sync: every
 * route it navigates to must be listed here with the params its callers
 * pass (string ids typed as `string`, opaque mock objects as `unknown`).
 */
export type RootStackParamList = {
  // Auth
  Signin: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  // Phone-OTP flow (all fields optional — screens default every one)
  RegisterPhone: { flow?: "register" | "login"; username?: string; country?: unknown } | undefined;
  CountryPicker: undefined;
  Verification:
    { flow?: "register" | "login"; destination?: string; username?: string } | undefined;
  // Shell
  Main: undefined;
  MallSelector: undefined;
  Search: undefined;
  RestaurantList: { kind?: "restaurants" | "outlets" } | undefined;
  OutletList: { kind?: "restaurants" | "outlets" } | undefined;
  // Discovery
  MerchantDetail: { merchantId: string };
  Menu: { merchantId: string };
  MenuItem: { merchantId: string; itemId: string };
  OfferDetail: { offerId: string };
  Favorites: undefined;
  Events: undefined;
  EventDetail: { eventId: string };
  // Profile
  ProfilePlaceholder: { title?: string; message?: string } | undefined;
  Settings: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  // Food court (seat-session payloads stay opaque — session logic is blocked)
  FoodCourt: undefined;
  SeatScan: undefined;
  SeatConfirm: { seat: unknown };
  SeatSession: { session: unknown };
  SeatSessionEnd: { session?: unknown; reason?: string };
  SeatHelp: { outcome: string; seat?: unknown };
  // Maps
  FloorMap: undefined;
  DestinationSearch: undefined;
  DestinationDetail: { destinationId: string };
  StartPointSelect: { destinationId: string };
  RoutePreview: { destinationId: string; startId: string };
};

/** `StackScreenProps` bound to the root stack, e.g. for a converted screen. */
export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;
