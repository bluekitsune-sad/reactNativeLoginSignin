import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { ApiContants } from "../constants";
import type { ApiEnvelope, ApiFailureEnvelope, ApiSuccessEnvelope } from "../types";

const DEFAULT_ERROR_MESSAGE = "Oops! Something went wrong";
const DEFAULT_SUCCESS_MESSAGE = "OK";

/**
 * Shared axios instance for MallMate services.
 * Base URL always comes from `ApiContants.BACKEND_API.BASE_API_URL` — never
 * hardcode a host in a calling service.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: ApiContants.BACKEND_API.BASE_API_URL,
});

/**
 * Create an additional client with the same base URL but overridden axios
 * config (e.g. a longer timeout). Prefer the shared `apiClient` unless you
 * have a concrete reason.
 */
const createApiClient = (options: AxiosRequestConfig = {}): AxiosInstance =>
  axios.create({
    baseURL: ApiContants.BACKEND_API.BASE_API_URL,
    ...options,
  });

/** Narrow an unknown payload to a plain record we can read keys from. */
const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value != null && typeof value === "object" ? (value as Record<string, unknown>) : undefined;

const hasEnvelopeShape = (payload: unknown): payload is ApiEnvelope =>
  typeof asRecord(payload)?.status === "boolean";

const pickMessage = (payload: unknown, fallback: string | null): string | null => {
  const record = asRecord(payload);
  const message = record?.message;
  if (typeof message === "string" && message) {
    return message;
  }
  const errorMessage = asRecord(record?.error)?.message;
  if (typeof errorMessage === "string" && errorMessage) {
    return errorMessage;
  }
  return fallback;
};

/**
 * Normalize a successful HTTP response into `{ status, message, data }`.
 * If the server already returns the envelope shape, it is passed through
 * (with a message fallback). Otherwise `data` is the response body (or its
 * nested `data` field when present).
 */
const toSuccessEnvelope = (response?: AxiosResponse): ApiSuccessEnvelope => {
  const payload: unknown = response?.data;
  if (hasEnvelopeShape(payload)) {
    return {
      status: true,
      message: pickMessage(payload, DEFAULT_SUCCESS_MESSAGE) ?? DEFAULT_SUCCESS_MESSAGE,
      data: payload.data,
    };
  }
  const record = asRecord(payload);
  const data = record && "data" in record ? record.data : payload;
  return {
    status: true,
    message: pickMessage(payload, DEFAULT_SUCCESS_MESSAGE) ?? DEFAULT_SUCCESS_MESSAGE,
    data,
  };
};

/**
 * Normalize any axios/network error into `{ status: false, message, data? }`.
 * Never rethrows — services must always resolve to an envelope.
 */
const toFailureEnvelope = (error: unknown): ApiFailureEnvelope => {
  const err = asRecord(error);
  const payload = asRecord(asRecord(err?.response)?.data);
  const message =
    pickMessage(payload, null) ||
    (typeof err?.message === "string" && err.message ? err.message : DEFAULT_ERROR_MESSAGE);
  const data = payload && "data" in payload ? payload.data : undefined;
  return data === undefined ? { status: false, message } : { status: false, message, data };
};

/**
 * Perform an HTTP request and always resolve to the service envelope
 * `{ status: boolean, message: string, data?: any }`. Never throws.
 */
const request = async (config: AxiosRequestConfig): Promise<ApiEnvelope> => {
  try {
    const response = await apiClient.request(config);
    return toSuccessEnvelope(response);
  } catch (error) {
    return toFailureEnvelope(error);
  }
};

/** GET `url` (relative to the ApiContants base URL). Never throws. */
const get = (url: string, config: AxiosRequestConfig = {}) =>
  request({ ...config, method: "GET", url });

/** POST JSON `body` to `url`. Never throws. */
const post = (url: string, body: unknown, config: AxiosRequestConfig = {}) =>
  request({ ...config, method: "POST", url, data: body });

/** PUT JSON `body` to `url`. Never throws. */
const put = (url: string, body: unknown, config: AxiosRequestConfig = {}) =>
  request({ ...config, method: "PUT", url, data: body });

/** PATCH JSON `body` to `url`. Never throws. */
const patch = (url: string, body: unknown, config: AxiosRequestConfig = {}) =>
  request({ ...config, method: "PATCH", url, data: body });

/** DELETE `url`. Never throws. */
const del = (url: string, config: AxiosRequestConfig = {}) =>
  request({ ...config, method: "DELETE", url });

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
