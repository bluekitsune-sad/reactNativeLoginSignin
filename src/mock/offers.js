/**
 * Mock offer catalogue (PRD 5.8, SCREEN_INVENTORY 26). One source of
 * truth for offer detail records: the Home "Active discounts" cards and
 * the merchant detail "Active offers" rows both resolve into this
 * catalogue by id. Supports discount types PERCENTAGE, FIXED_AMOUNT and
 * BOGO with validity windows, eligibility and terms. Expired offers are
 * hidden by every resolver (backend would do the same). Presentation
 * only — no redemption, coupon or checkout logic (blocked).
 */
const farFuture = "2099-12-31T23:59:59Z";

export const OFFER_TYPES = {
  PERCENTAGE: "PERCENTAGE",
  FIXED_AMOUNT: "FIXED_AMOUNT",
  BOGO: "BOGO",
};

export const MOCK_OFFERS = {
  "lucky-discount-1": {
    id: "lucky-discount-1",
    merchantId: "lucky-m-1",
    merchantName: "Spice Route Kitchen",
    type: OFFER_TYPES.PERCENTAGE,
    value: 20,
    label: "20% OFF",
    title: "20% off lunch combos",
    description: "Save on lunch combos at Spice Route Kitchen, weekdays from 12 to 4 PM.",
    validFrom: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    eligibility: [
      "Dine-in and pickup orders",
      "One use per customer per day",
      "Lunch combo items only",
    ],
    terms: [
      "Cannot be combined with other offers or promotions.",
      "Excludes delivery fees and service charges.",
      "The merchant may pause the offer during peak hours.",
    ],
  },
  "lucky-discount-2": {
    id: "lucky-discount-2",
    merchantId: "lucky-m-3",
    merchantName: "Demo Fashion",
    type: OFFER_TYPES.BOGO,
    value: null,
    label: "BOGO",
    title: "Buy 1 get 1 on select footwear",
    description: "Buy one pair of select footwear, get a second pair free (equal or lower price).",
    validFrom: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    eligibility: ["Select footwear only", "Free item of equal or lower price", "In-store only"],
    terms: [
      "Offer applies to the lower-priced item.",
      "Cannot be combined with other footwear promotions.",
      "Subject to stock availability.",
    ],
  },
  "lucky-discount-expired": {
    id: "lucky-discount-expired",
    merchantId: "lucky-m-3",
    merchantName: "Expired Co",
    type: OFFER_TYPES.PERCENTAGE,
    value: 50,
    label: "50% OFF",
    title: "Expired offer (should be hidden)",
    description: "This offer ended in 2020 and must never appear in active lists.",
    validFrom: "2019-01-01T00:00:00Z",
    endsAt: "2020-01-15T00:00:00Z",
    eligibility: [],
    terms: [],
  },
  "lucky-m-2-off-1": {
    id: "lucky-m-2-off-1",
    merchantId: "lucky-m-2",
    merchantName: "Noodle Bar Express",
    type: OFFER_TYPES.BOGO,
    value: null,
    label: "BOGO",
    title: "Buy 1 get 1 on selected bowls",
    description: "Two for the price of one on selected noodle and rice bowls.",
    validFrom: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    eligibility: ["Selected bowls only", "Dine-in"],
    terms: ["Free bowl must be of equal or lower price.", "One redemption per table."],
  },
  "lucky-m-7-off-1": {
    id: "lucky-m-7-off-1",
    merchantId: "lucky-m-7",
    merchantName: "Burger Boulevard",
    type: OFFER_TYPES.FIXED_AMOUNT,
    value: 100,
    label: "PKR 100 OFF",
    title: "PKR 100 off combo meals",
    description: "Flat PKR 100 off any combo meal, all week.",
    validFrom: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    eligibility: ["Combo meals only", "Valid any day of the week"],
    terms: ["Minimum order of one combo meal.", "Not valid with student discounts."],
  },
  "lucky-m-10-off-1": {
    id: "lucky-m-10-off-1",
    merchantId: "lucky-m-10",
    merchantName: "KidZone Toys",
    type: OFFER_TYPES.BOGO,
    value: null,
    label: "BOGO",
    title: "Buy 1 get 1 on board games",
    description: "Buy one board game, get one of equal or lower price free.",
    validFrom: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    eligibility: ["Board games only", "In-store"],
    terms: ["Excludes collectible and limited editions.", "While stocks last."],
  },
  "harbour-discount-1": {
    id: "harbour-discount-1",
    merchantId: "harbour-m-1",
    merchantName: "Harbour Boutique",
    type: OFFER_TYPES.PERCENTAGE,
    value: 15,
    label: "15% OFF",
    title: "15% off summer collection",
    description: "15% off the entire summer collection at Harbour Boutique.",
    validFrom: "2020-01-01T00:00:00Z",
    endsAt: farFuture,
    eligibility: ["Summer collection only", "In-store and pickup"],
    terms: ["Excludes sale racks and gift cards.", "Cannot be combined with loyalty perks."],
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatOfferDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const getOfferValidity = (offer) => {
  const start = offer.validFrom ? formatOfferDate(offer.validFrom) : null;
  const end = offer.endsAt ? formatOfferDate(offer.endsAt) : null;
  if (start && end) {
    return `${start} – ${end}`;
  }
  if (end) {
    return `Until ${end}`;
  }
  if (start) {
    return `From ${start}`;
  }
  return null;
};

export const getOfferHeadline = (offer) => {
  if (offer.type === OFFER_TYPES.PERCENTAGE) {
    return `${offer.value}% off`;
  }
  if (offer.type === OFFER_TYPES.FIXED_AMOUNT) {
    return `PKR ${offer.value} off`;
  }
  if (offer.type === OFFER_TYPES.BOGO) {
    return "Buy 1 get 1";
  }
  return offer.title;
};

/**
 * Resolve a single active offer by id. Expired offers resolve to null so
 * the detail screen can show an "unavailable" state (PRD 5.8: expired
 * offers disappear from active lists).
 */
export const getOfferById = (offerId) => {
  const offer = MOCK_OFFERS[offerId];
  if (!offer) {
    return null;
  }
  const end = offer.endsAt ? Date.parse(offer.endsAt) : null;
  if (end !== null && Number.isFinite(end) && Date.now() > end) {
    return null;
  }
  return offer;
};

/**
 * Active offers for one merchant, as light summaries for list rows.
 */
export const getActiveOffersForMerchant = (merchantId) =>
  Object.values(MOCK_OFFERS)
    .filter((offer) => offer.merchantId === merchantId)
    .map((offer) => getOfferById(offer.id))
    .filter(Boolean)
    .map((offer) => ({ id: offer.id, label: offer.label, title: offer.title }));
