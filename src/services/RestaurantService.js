import { ApiContants } from "../constants";
import axios from "axios";

const getRestaurants = async () => {
  console.log(`RestaurantsService | getRestaurants`);
  try {
    let restaurantResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.RESTAURANT}`
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
  } catch (error) {
    return {
      status: false,
      message: `Restaurant data not found`,
    };
  }
};

const getOneRestaurantById = async (restaurantId) => {
  console.log(`RestaurantsService | getOneRestaurantById`);
  try {
    let restaurantResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.RESTAURANT}/${restaurantId}`
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
  } catch (error) {
    return {
      status: false,
      message: `Restaurant data not found`,
    };
  }
};

export default { getRestaurants, getOneRestaurantById };
