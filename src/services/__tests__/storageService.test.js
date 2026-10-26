/* eslint-env jest */
import AsyncStorage from "@react-native-async-storage/async-storage";

import StorageService from "../StorageService";

describe("StorageService user JSON round-trip", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("round-trips a user object through JSON stringify/parse", async () => {
    const user = { username: "alice", email: "alice@example.com", mockSession: true };
    await StorageService.setUser(user);
    await expect(StorageService.getUser()).resolves.toEqual(user);
  });

  it("stores user as a JSON string under the shared 'user' key", async () => {
    await StorageService.setUser({ username: "alice" });
    await expect(AsyncStorage.getItem("user")).resolves.toBe(JSON.stringify({ username: "alice" }));
  });

  it("normalizes a missing user to null", async () => {
    await expect(StorageService.getUser()).resolves.toBeNull();
  });

  it("parses a stored JSON null as null (setUser(undefined))", async () => {
    await StorageService.setUser(undefined);
    await expect(StorageService.getUser()).resolves.toBeNull();
  });

  it("removeUser clears the stored key", async () => {
    await StorageService.setUser({ username: "alice" });
    await StorageService.removeUser();
    await expect(AsyncStorage.getItem("user")).resolves.toBeNull();
    await expect(StorageService.getUser()).resolves.toBeNull();
  });
});

describe("StorageService favorite-ids validation", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("round-trips an array of merchant ids", async () => {
    await StorageService.setFavoriteIds(["lucky-m-1", "harbour-m-3"]);
    await expect(StorageService.getFavoriteIds()).resolves.toEqual(["lucky-m-1", "harbour-m-3"]);
  });

  it("returns [] when nothing is stored", async () => {
    await expect(StorageService.getFavoriteIds()).resolves.toEqual([]);
  });

  it("drops non-string entries from a stored array", async () => {
    await AsyncStorage.setItem("favoriteMerchantIds", JSON.stringify(["lucky-m-1", 42, null, {}]));
    await expect(StorageService.getFavoriteIds()).resolves.toEqual(["lucky-m-1"]);
  });

  it("returns [] when the stored value is not an array", async () => {
    await AsyncStorage.setItem("favoriteMerchantIds", JSON.stringify({ bad: true }));
    await expect(StorageService.getFavoriteIds()).resolves.toEqual([]);
  });

  it("returns [] when the stored value is corrupt JSON", async () => {
    await AsyncStorage.setItem("favoriteMerchantIds", "{not-json");
    await expect(StorageService.getFavoriteIds()).resolves.toEqual([]);
  });

  it("setFavoriteIds(null) stores [] and reads back as []", async () => {
    await StorageService.setFavoriteIds(null);
    await expect(AsyncStorage.getItem("favoriteMerchantIds")).resolves.toBe("[]");
    await expect(StorageService.getFavoriteIds()).resolves.toEqual([]);
  });
});

describe("StorageService remembered username", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("round-trips a remembered username", async () => {
    await StorageService.setRememberedUsername("alice");
    await expect(StorageService.getRememberedUsername()).resolves.toBe("alice");
  });

  it("returns null when nothing is remembered", async () => {
    await expect(StorageService.getRememberedUsername()).resolves.toBeNull();
  });

  it("removeRememberedUsername clears the stored value", async () => {
    await StorageService.setRememberedUsername("alice");
    StorageService.removeRememberedUsername();
    await expect(StorageService.getRememberedUsername()).resolves.toBeNull();
  });
});

describe("StorageService mall slug", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("round-trips the selected mall slug as a plain string", async () => {
    await StorageService.setSelectedMallSlug("harbourwalk");
    await expect(AsyncStorage.getItem("selectedMallSlug")).resolves.toBe("harbourwalk");
    await expect(StorageService.getSelectedMallSlug()).resolves.toBe("harbourwalk");
  });

  it("resolves null when no mall has been selected", async () => {
    await expect(StorageService.getSelectedMallSlug()).resolves.toBeNull();
  });
});
