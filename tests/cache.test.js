const { MemoryCache } = require("../src/utils/cache");

describe("MemoryCache", () => {
  let cache;

  afterEach(() => {
    if (cache) cache.stopCleanup();
  });

  test("stores and retrieves a value before it expires", () => {
    cache = new MemoryCache(60, 0);
    cache.set("key", { value: 1 });

    expect(cache.get("key")).toEqual({ value: 1 });
  });

  test("returns null for a missing key", () => {
    cache = new MemoryCache(60, 0);

    expect(cache.get("missing")).toBeNull();
  });

  test("expires entries after the TTL window", () => {
    jest.useFakeTimers();
    cache = new MemoryCache(1, 0);
    cache.set("key", "data");

    jest.advanceTimersByTime(1500);

    expect(cache.get("key")).toBeNull();
    jest.useRealTimers();
  });

  test("flush clears all entries", () => {
    cache = new MemoryCache(60, 0);
    cache.set("a", 1);
    cache.set("b", 2);

    cache.flush();

    expect(cache.getStats().totalKeys).toBe(0);
  });

  test("cleanup removes only expired entries", () => {
    jest.useFakeTimers();
    cache = new MemoryCache(1, 0);
    cache.set("old", "x");

    jest.advanceTimersByTime(1500);
    cache.set("fresh", "y");

    const removed = cache.cleanup();

    expect(removed).toBe(1);
    expect(cache.get("fresh")).toBe("y");
    expect(cache.get("old")).toBeNull();
    jest.useRealTimers();
  });

  test("getStats reports active, expired and total keys", () => {
    jest.useFakeTimers();
    cache = new MemoryCache(1, 0);
    cache.set("old", "x");

    jest.advanceTimersByTime(1500);
    cache.set("fresh", "y");

    expect(cache.getStats()).toEqual({
      activeKeys: 1,
      expiredKeys: 1,
      totalKeys: 2,
    });
    jest.useRealTimers();
  });
});
