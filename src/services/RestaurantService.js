import axios from "axios";

import { ApiContants } from "../constants";

const getRestaurants = async () => {
  console.log(`RestaurantsService | getRestaurants`);
  try {
    const restaurantResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ALL_RESTAURANTS}`,
    );
    if (restaurantResponse?.status === 200) {
      return {
        status: true,
        message: `Restaurant data fetched`,
        data: restaurantResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Restaurant data not found`,
      };
    }
  } catch (_error) {
    return {
      status: false,
      message: `Restaurant data not found`,
    };
  }
};

const getOneRestaurantById = async (restaurantId) => {
  console.log(`RestaurantsService | getOneRestaurantById`);
  try {
    const restaurantResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ALL_RESTAURANTS}/${restaurantId}`,
    );
    if (restaurantResponse?.status === 200) {
      return {
        status: true,
        message: `Restaurant data fetched`,
        data: restaurantResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Restaurant data not found`,
      };
    }
  } catch (_error) {
    return {
      status: false,
      message: `Restaurant data not found`,
    };
  }
};

export default { getRestaurants, getOneRestaurantById };
