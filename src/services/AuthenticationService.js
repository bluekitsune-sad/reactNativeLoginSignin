import axios from "axios";

import { ApiContants } from "../constants";

const AuthRequest = axios.create({
  baseURL: ApiContants.BACKEND_API.BASE_API_URL,
});

// Log only a safe digest of the error. Never log the raw error object —
// on a failed login the axios error carries config.url, which embeds the
// JSON-stringified credentials (the known GET-in-URL quirk, TODO P3).
const logAuthError = (error) => {
  console.warn("AuthenticationService request failed:", error?.message ?? "unknown error");
};

const register = async (user) => {
  if (!user?.username || !user?.email || !user?.password) {
    return { status: false, message: "Please fill up all fields" };
  }
  try {
    const requestBody = {
      username: user?.username,
      email: user?.email,
      password: user?.password,
    };
    const registerResponse = await AuthRequest.post(ApiContants.BACKEND_API.REGISTER, requestBody);
    return registerResponse?.data;
  } catch (error) {
    logAuthError(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

const login = async (user) => {
  if (!user?.username || !user?.password) {
    return { status: false, message: "Please fill up all fields" };
  }
  try {
    const requestBody = JSON.stringify({
      username: user?.username,
      password: user?.password,
    });

    const loginResponse = await AuthRequest.get(ApiContants.BACKEND_API.LOGIN + requestBody);

    return loginResponse?.data;
  } catch (error) {
    logAuthError(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

const checkUserExist = async (type, value) => {
  try {
    const params = { [type]: value };
    const userCheckResponse = await AuthRequest.get(ApiContants.BACKEND_API.USER_EXIST, { params });
    return userCheckResponse?.data;
  } catch (error) {
    logAuthError(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

const refreshToken = async () => {
  try {
    const tokenResponse = await AuthRequest.post(ApiContants.BACKEND_API.REFRESH_TOKEN);
    if (tokenResponse?.status === 200) {
      return { status: true, data: tokenResponse?.data };
    } else {
      return { status: false };
    }
  } catch (error) {
    logAuthError(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

export default { register, login, checkUserExist, refreshToken };
