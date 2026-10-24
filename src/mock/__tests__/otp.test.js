/* eslint-env jest */
import { DEMO_OTP_CODE, isSuspiciousLogin, sendMockOtp, verifyMockOtp } from "../otp";

describe("mock OTP (decided auth flow, issue #9)", () => {
  it("flags usernames containing sus for the extra OTP step", () => {
    expect(isSuspiciousLogin("suspicious-user")).toBe(true);
    expect(isSuspiciousLogin("Sus")).toBe(true);
    expect(isSuspiciousLogin("alice")).toBe(false);
    expect(isSuspiciousLogin(undefined)).toBe(false);
  });

  it("sends a demo code to any non-empty destination", async () => {
    const response = await sendMockOtp("+923001234567");
    expect(response.status).toBe(true);
    expect(response.data).toEqual({ destination: "+923001234567", demoCode: DEMO_OTP_CODE });
  });

  it("fails recoverably for the !error destination and for empty input", async () => {
    expect((await sendMockOtp("!error")).status).toBe(false);
    expect((await sendMockOtp("")).status).toBe(false);
    expect((await sendMockOtp(undefined)).status).toBe(false);
  });

  it("accepts only the 6-digit demo code", async () => {
    expect((await verifyMockOtp(DEMO_OTP_CODE)).status).toBe(true);
    expect((await verifyMockOtp("000000")).status).toBe(false);
    expect((await verifyMockOtp("123")).status).toBe(false);
    expect((await verifyMockOtp(undefined)).status).toBe(false);
  });
});
