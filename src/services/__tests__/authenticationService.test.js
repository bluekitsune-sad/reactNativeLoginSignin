/* eslint-env jest */
import axios from "axios";

import { ApiContants } from "../../constants";
import AuthenicationService from "../AuthenticationService";

jest.mock("axios", () => {
  const get = jest.fn();
  const post = jest.fn();
  return {
    create: jest.fn(() => ({ get, post })),
    __getMockedAuthRequest: () => ({ get, post }),
  };
});

const { get: mockedGet, post: mockedPost } = axios.__getMockedAuthRequest();

describe("AuthenticationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("short-circuits with a validation envelope when fields are missing", async () => {
      const response = await AuthenicationService.register({ username: "alice" });
      expect(response).toEqual({ status: false, message: "Please fill up all fields" });
      expect(mockedPost).not.toHaveBeenCalled();
    });

    it("posts username/email/password and returns the server body", async () => {
      const body = { status: true, message: "registered", data: { id: 1 } };
      mockedPost.mockResolvedValue({ data: body });
      const response = await AuthenicationService.register({
        username: "alice",
        email: "alice@example.com",
        password: "secret",
      });
      expect(mockedPost).toHaveBeenCalledWith(ApiContants.BACKEND_API.REGISTER, {
        username: "alice",
        email: "alice@example.com",
        password: "secret",
      });
      expect(response).toEqual(body);
    });

    it("never throws and returns a failure envelope on errors", async () => {
      mockedPost.mockRejectedValue(new Error("boom"));
      const response = await AuthenicationService.register({
        username: "alice",
        email: "alice@example.com",
        password: "secret",
      });
      expect(response).toEqual({ status: false, message: "Oops! Something went wrong" });
    });
  });

  describe("login", () => {
    it("short-circuits with a validation envelope when fields are missing", async () => {
      const response = await AuthenicationService.login({ username: "alice" });
      expect(response).toEqual({ status: false, message: "Please fill up all fields" });
      expect(mockedGet).not.toHaveBeenCalled();
    });

    it("locks in the current GET-with-credentials-in-path behaviour", async () => {
      // Known legacy quirk (TODO P3): login stringifies the credentials into
      // the URL path. This test documents the CURRENT behaviour so a future
      // redesign to POST /login updates it deliberately.
      const body = { status: true, message: "fetched", data: { username: "alice" } };
      mockedGet.mockResolvedValue({ data: body });
      const response = await AuthenicationService.login({ username: "alice", password: "secret" });
      expect(mockedGet).toHaveBeenCalledWith(
        ApiContants.BACKEND_API.LOGIN + JSON.stringify({ username: "alice", password: "secret" }),
      );
      expect(response).toEqual(body);
    });

    it("never throws and returns a failure envelope on errors", async () => {
      mockedGet.mockRejectedValue(new Error("boom"));
      const response = await AuthenicationService.login({ username: "a", password: "b" });
      expect(response).toEqual({ status: false, message: "Oops! Something went wrong" });
    });
  });

  describe("checkUserExist", () => {
    it("GETs the user-exist endpoint with the lookup as query params", async () => {
      const body = { status: true, message: "exists", data: { exist: true } };
      mockedGet.mockResolvedValue({ data: body });
      const response = await AuthenicationService.checkUserExist("email", "alice@example.com");
      expect(mockedGet).toHaveBeenCalledWith(ApiContants.BACKEND_API.USER_EXIST, {
        params: { email: "alice@example.com" },
      });
      expect(response).toEqual(body);
    });

    it("never throws and returns a failure envelope on errors", async () => {
      mockedGet.mockRejectedValue(new Error("boom"));
      const response = await AuthenicationService.checkUserExist("email", "a@b.c");
      expect(response).toEqual({ status: false, message: "Oops! Something went wrong" });
    });
  });

  describe("refreshToken", () => {
    it("returns the body wrapped in a success envelope on HTTP 200", async () => {
      mockedPost.mockResolvedValue({ status: 200, data: { token: "fresh" } });
      const response = await AuthenicationService.refreshToken();
      expect(mockedPost).toHaveBeenCalledWith(ApiContants.BACKEND_API.REFRESH_TOKEN);
      expect(response).toEqual({ status: true, data: { token: "fresh" } });
    });

    it("returns {status:false} for non-200 responses", async () => {
      mockedPost.mockResolvedValue({ status: 204 });
      const response = await AuthenicationService.refreshToken();
      expect(response).toEqual({ status: false });
    });

    it("never throws and returns a failure envelope on errors", async () => {
      mockedPost.mockRejectedValue(new Error("boom"));
      const response = await AuthenicationService.refreshToken();
      expect(response).toEqual({ status: false, message: "Oops! Something went wrong" });
    });
  });
});
