import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { loadMuted, saveMuted } from "./storage.ts";

afterEach(() => {
  localStorage.clear();
});

describe("mute preference", () => {
  test("defaults to sound on", () => {
    expect(loadMuted()).toBe(false);
  });

  test("round-trips through local storage", () => {
    saveMuted(true);

    expect(loadMuted()).toBe(true);

    saveMuted(false);

    expect(loadMuted()).toBe(false);
  });

  test("falls back to sound on when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });

    expect(() => {
      saveMuted(true);
    }).not.toThrow();
    expect(loadMuted()).toBe(false);
  });
});
