import { CAPABILITY_STATUS } from "../constants";

export const MALLS = [
  {
    id: "mock-mall-luckyone",
    slug: "luckyone",
    name: "LuckyOne Mall",
    address: "Main Rashid Minhas Road, Karachi",
    timezone: "Asia/Karachi",
    currency: "PKR",
    status: "ACTIVE",
    logoUrl: null,
    openingHours: {
      timezone: "Asia/Karachi",
      days: [
        { day: 0, opensAt: "10:00", closesAt: "23:00" },
        { day: 1, opensAt: "10:00", closesAt: "23:00" },
        { day: 2, opensAt: "10:00", closesAt: "23:00" },
        { day: 3, opensAt: "10:00", closesAt: "23:00" },
        { day: 4, opensAt: "10:00", closesAt: "23:00" },
        { day: 5, opensAt: "10:00", closesAt: "23:00" },
        { day: 6, opensAt: "10:00", closesAt: "23:00" },
      ],
    },
    capabilities: {
      food_court: CAPABILITY_STATUS.ENABLED,
      restaurant_discovery: CAPABILITY_STATUS.ENABLED,
      retail_discovery: CAPABILITY_STATUS.ENABLED,
      online_ordering: CAPABILITY_STATUS.DEGRADED,
      online_payment: CAPABILITY_STATUS.DISABLED,
      loyalty: CAPABILITY_STATUS.DISABLED,
      indoor_navigation: CAPABILITY_STATUS.DEGRADED,
      live_parking: CAPABILITY_STATUS.DISABLED,
      events: CAPABILITY_STATUS.ENABLED,
      seat_sessions: CAPABILITY_STATUS.DISABLED,
      reservations: CAPABILITY_STATUS.DISABLED,
      digital_coupons: CAPABILITY_STATUS.ENABLED,
    },
  },
];

export default MALLS;
