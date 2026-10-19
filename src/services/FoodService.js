import axios from "axios";

import { ApiContants } from "../constants";
// import { authHeader } from "../utils/Generator";
// import { getToken } from "../Store";

const getOneFoodById = async (foodId) => {
  console.log(`FoodService | getOneFoodById`);
  try {
    const foodResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.FOOD}/${foodId}`,
      {
        // headers: authHeader(getToken()),
      },
    );
    if (foodResponse?.status === 200) {
      return {
        status: true,
        message: `Food data fetched`,
        data: foodResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Food data not found`,
      };
    }
  } catch (_error) {
    return {
      status: false,
      message: `Food data not found`,
    };
  }
};

export default { getOneFoodById };
