import { CAPABILITIES } from "./Capabilities";

export const CAPABILITY_META = {
  [CAPABILITIES.FOOD_COURT]: {
    title: "Food court",
    description: "Browse food-court options and seating.",
    icon: "restaurant-outline",
  },
  [CAPABILITIES.RESTAURANT_DISCOVERY]: {
    title: "Restaurants",
    description: "Find restaurants and offers in the mall.",
    icon: "fast-food-outline",
  },
  [CAPABILITIES.RETAIL_DISCOVERY]: {
    title: "Shops",
    description: "Explore retail stores and brands.",
    icon: "bag-handle-outline",
  },
  [CAPABILITIES.ONLINE_ORDERING]: {
    title: "Order online",
    description: "Order from participating merchants.",
    icon: "cart-outline",
  },
  [CAPABILITIES.ONLINE_PAYMENT]: {
    title: "Pay online",
    description: "Pay securely in the app.",
    icon: "card-outline",
  },
  [CAPABILITIES.LOYALTY]: {
    title: "Rewards",
    description: "Earn and redeem mall rewards.",
    icon: "gift-outline",
  },
  [CAPABILITIES.INDOOR_NAVIGATION]: {
    title: "Wayfinding",
    description: "Find your way around the mall.",
    icon: "navigate-outline",
  },
  [CAPABILITIES.LIVE_PARKING]: {
    title: "Parking",
    description: "Check live parking availability.",
    icon: "car-outline",
  },
  [CAPABILITIES.EVENTS]: {
    title: "Events",
    description: "See what's on at the mall.",
    icon: "calendar-outline",
  },
  [CAPABILITIES.SEAT_SESSIONS]: {
    title: "Food-court seats",
    description: "Reserve a food-court seat session.",
    icon: "grid-outline",
  },
  [CAPABILITIES.RESERVATIONS]: {
    title: "Reservations",
    description: "Book a table at participating places.",
    icon: "book-outline",
  },
  [CAPABILITIES.DIGITAL_COUPONS]: {
    title: "Coupons",
    description: "Collect and use digital coupons.",
    icon: "pricetags-outline",
  },
};

export default CAPABILITY_META;
