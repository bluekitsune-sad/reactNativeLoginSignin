import axios from "axios";

import { ApiContants } from "../constants";

const DEFAULT_ERROR_MESSAGE = "Oops! Something went wrong";
const DEFAULT_SUCCESS_MESSAGE = "OK";

/**
 * Shared axios instance for MallMate services.
 * Base URL always comes from `ApiContants.BACKEND_API.BASE_API_URL` — never
 * hardcode a host in a calling service.
 */
const apiClient = axios.create({
  baseURL: ApiContants.BACKEND_API.BASE_API_URL,
});

/**
 * Create an additional client with the same base URL but overridden axios
 * config (e.g. a longer timeout). Prefer the shared `apiClient` unless you
 * have a concrete reason.
 *
 * @param {import("axios").AxiosRequestConfig} [options]
 * @returns {import("axios").AxiosInstance}
 */
const createApiClient = (options = {}) =>
  axios.create({
    baseURL: ApiContants.BACKEND_API.BASE_API_URL,
    ...options,
  });

const hasEnvelopeShape = (payload) =>
  payload != null && typeof payload === "object" && typeof payload.status === "boolean";

const pickMessage = (payload, fallback) => {
  if (typeof payload?.message === "string" && payload.message) {
    return payload.message;
  }
  if (typeof payload?.error?.message === "string" && payload.error.message) {
    return payload.error.message;
  }
  return fallback;
};

/**
 * Normalize a successful HTTP response into `{ status, message, data }`.
 * If the server already returns the envelope shape, it is passed through
 * (with a message fallback). Otherwise `data` is the response body (or its
 * nested `data` field when present).
 */
const toSuccessEnvelope = (response) => {
  const payload = response?.data;
  if (hasEnvelopeShape(payload)) {
    return {
      status: true,
      message: pickMessage(payload, DEFAULT_SUCCESS_MESSAGE),
      data: payload.data,
    };
  }
  const data =
    payload != null && typeof payload === "object" && "data" in payload ? payload.data : payload;
  return {
    status: true,
    message: pickMessage(payload, DEFAULT_SUCCESS_MESSAGE),
    data,
  };
};

/**
 * Normalize any axios/network error into `{ status: false, message, data? }`.
 * Never rethrows — services must always resolve to an envelope.
 */
const toFailureEnvelope = (error) => {
  const payload = error?.response?.data;
  const message =
    pickMessage(payload, null) || (error?.message ? String(error.message) : DEFAULT_ERROR_MESSAGE);
  const data =
    payload != null && typeof payload === "object" && "data" in payload ? payload.data : undefined;
  return data === undefined ? { status: false, message } : { status: false, message, data };
};

/**
 * Perform an HTTP request and always resolve to the service envelope
 * `{ status: boolean, message: string, data?: any }`. Never throws.
 *
 * @param {import("axios").AxiosRequestConfig} config
 * @returns {Promise<import("../types").ApiEnvelope>}
 */
const request = async (config) => {
  try {
    const response = await apiClient.request(config);
    return toSuccessEnvelope(response);
  } catch (error) {
    return toFailureEnvelope(error);
  }
};

/** GET `url` (relative to the ApiContants base URL). Never throws. */
const get = (url, config = {}) => request({ ...config, method: "GET", url });

/** POST JSON `body` to `url`. Never throws. */
const post = (url, body, config = {}) => request({ ...config, method: "POST", url, data: body });

/** PUT JSON `body` to `url`. Never throws. */
const put = (url, body, config = {}) => request({ ...config, method: "PUT", url, data: body });

/** PATCH JSON `body` to `url`. Never throws. */
const patch = (url, body, config = {}) => request({ ...config, method: "PATCH", url, data: body });

/** DELETE `url`. Never throws. */
const del = (url, config = {}) => request({ ...config, method: "DELETE", url });

export { apiClient, createApiClient, request, get, post, put, patch, del, DEFAULT_ERROR_MESSAGE };

export default {
  apiClient,
  createApiClient,
  request,
  get,
  post,
  put,
  patch,
  del,
};
