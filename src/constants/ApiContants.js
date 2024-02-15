// const BACKEND_BASE_URL = "http://localhost:3001";
const BACKEND_BASE_URL = "http://192.168.0.103:3001";

const COUNTRY_FLAG = {
  BASE_URL: `https://www.countryflags.io`,
  SIZE: { 16: "16", 24: "24", 32: "32", 48: "48", 64: "64" },
  STYLE: { FLAT: "flat", SHINY: "shiny" },
};

const STATIC_IMAGE = {
  BASE_URL: `${BACKEND_BASE_URL}/images`,
  TYPE: { POSTER: "poster", LOGO: "logo", GALLERY: "gallery" },
  SIZE: { SQUARE: "square", LANDSCAPE: "landscape", PORTRAIT: "portrait" },
  QUALITY: { SD: "sd", HD: "hd" },
};

const BACKEND_API = {
  BASE_API_URL: `${BACKEND_BASE_URL}/api`,
  REGISTER: "/register",
  LOGIN: "/getUser/",
  USER_EXIST: "/user-exist",
  USER: "/getUser",
  ADDUSER: "/addUser",
  REFRESH_TOKEN: "/refresh-token",
  ALLRESTAURANT: "/getAllRestaurants",
  ALLRESTAURANT: "/getRestaurant",
  CART: "/cart",
  FOOD: "/getfood",
  BOOKMARK: "/bookmark",
  BOOKMARK: "/test",
};

export default { COUNTRY_FLAG, BACKEND_API, STATIC_IMAGE };
