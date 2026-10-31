/* eslint-env jest */
import axios from "axios";

import { ApiClient } from "..";

jest.mock("axios", () => {
  const request = jest.fn();
  return {
    create: jest.fn(() => ({ request })),
    __getMockedRequest: () => request,
  };
});

const mockedRequest = axios.__getMockedRequest;

describe("ApiClient envelope helper", () => {
  beforeEach(() => {
    mockedRequest().mockReset();
  });

  it("lifts message/data from a 2xx envelope-shaped body (status stays true)", async () => {
    mockedRequest().mockResolvedValue({
      data: { status: true, message: "server says ok", data: { id: 7 } },
    });
    const response = await ApiClient.get("/thing");
    expect(response).toEqual({ status: true, message: "server says ok", data: { id: 7 } });
  });

  it("still resolves status:true when a 2xx body says status:false (HTTP governs)", async () => {
    mockedRequest().mockResolvedValue({
      data: { status: false, message: "rejected" },
    });
    const response = await ApiClient.get("/thing");
    expect(response.status).toBe(true);
    expect(response.message).toBe("rejected");
    expect(response.data).toBeUndefined();
  });

  it("wraps a plain 2xx body into a success envelope", async () => {
    mockedRequest().mockResolvedValue({ data: { hello: "world" } });
    const response = await ApiClient.get("/thing");
    expect(response.status).toBe(true);
    expect(response.message).toBe("OK");
    expect(response.data).toEqual({ hello: "world" });
  });

  it("unwraps a nested {data} field on success", async () => {
    mockedRequest().mockResolvedValue({ data: { data: [1, 2, 3] } });
    const response = await ApiClient.get("/thing");
    expect(response.status).toBe(true);
    expect(response.data).toEqual([1, 2, 3]);
  });

  it("resolves to a failure envelope on HTTP errors and never throws", async () => {
    mockedRequest().mockRejectedValue({
      response: { data: { status: false, message: "server rejected" } },
    });
    const response = await ApiClient.get("/thing");
    expect(response.status).toBe(false);
    expect(response.message).toBe("server rejected");
  });

  it("falls back to the axios error message when the body has none", async () => {
    mockedRequest().mockRejectedValue(new Error("Network Error"));
    const response = await ApiClient.post("/thing", { a: 1 });
    expect(response.status).toBe(false);
    expect(response.message).toBe("Network Error");
  });

  it("uses the DEFAULT_ERROR_MESSAGE when nothing else is available", async () => {
    mockedRequest().mockRejectedValue({});
    const response = await ApiClient.get("/thing");
    expect(response.status).toBe(false);
    expect(response.message).toBe("Oops! Something went wrong");
  });

  it("posts JSON bodies with the right method and data", async () => {
    mockedRequest().mockResolvedValue({ data: { status: true, message: "ok" } });
    await ApiClient.post("/login", { email: "a@b.c" });
    expect(mockedRequest()).toHaveBeenCalledWith({
      method: "POST",
      url: "/login",
      data: { email: "a@b.c" },
    });
  });

  it("sends GET requests without a body", async () => {
    mockedRequest().mockResolvedValue({ data: {} });
    await ApiClient.get("/malls");
    expect(mockedRequest()).toHaveBeenCalledWith({ method: "GET", url: "/malls" });
  });
});
