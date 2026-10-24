/**
 * Typed service envelope for MallMate.
 *
 * Every network helper in `src/services/` resolves to this shape instead of
 * throwing (see AGENTS.md "Network calls only in `src/services/`"). The same
 * contract is produced by `src/services/apiClient.ts` and consumed by screens.
 */

/** Successful service response. */
export interface ApiSuccessEnvelope<T = unknown> {
  status: true;
  message: string;
  data?: T;
}

/** Failed service response — never throws; always returned on error. */
export interface ApiFailureEnvelope<T = unknown> {
  status: false;
  message: string;
  data?: T;
}

/**
 * Stable envelope returned by every service function.
 * `status` is the app-level success flag (not an HTTP status code).
 */
export type ApiEnvelope<T = unknown> = ApiSuccessEnvelope<T> | ApiFailureEnvelope<T>;

/** Optional structured error payload some backends include under `data`. */
export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
}
