/**
 * Mock phone-OTP stand-ins for the auth flow decided on issue #9:
 * register -> OTP -> app; login -> OTP only when a suspicious flag is
 * raised. Pure presentation — no SMS is sent, there are no real
 * validation rules, and `ApiContants` has no OTP endpoints yet. Same
 * preview pattern as the seat-session mocks: deterministic demo outcomes
 * a reviewer can walk through.
 */

export const DEMO_OTP_CODE = "123456";

const SIMULATED_LATENCY_MS = 250;

const delay = () => new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

/**
 * Mock stand-in for the backend's login risk check (the "sus" step of
 * the decided flow): usernames containing "sus" (e.g. "suspicious-user")
 * are flagged for the extra OTP step; everything else proceeds straight
 * to the app.
 */
export const isSuspiciousLogin = (username) =>
  typeof username === "string" && username.toLowerCase().includes("sus");

/** Simulate sending an OTP to `destination` (phone or username). */
export const sendMockOtp = async (destination) => {
  await delay();
  if (!destination) {
    return { status: false, message: "A destination is required" };
  }
  if (destination === "!error") {
    return { status: false, message: "Could not send the code. Try again." };
  }
  return {
    status: true,
    message: "Code sent",
    data: { destination, demoCode: DEMO_OTP_CODE },
  };
};

/** Simulate verifying the 6-digit code. Only the demo code passes. */
export const verifyMockOtp = async (code) => {
  await delay();
  const normalized = typeof code === "string" ? code.trim() : "";
  if (normalized.length !== 6) {
    return { status: false, message: "Enter the 6-digit code" };
  }
  if (normalized !== DEMO_OTP_CODE) {
    return { status: false, message: "That code is not valid" };
  }
  return { status: true, message: "Verified", data: { verified: true } };
};

export default { DEMO_OTP_CODE, isSuspiciousLogin, sendMockOtp, verifyMockOtp };
