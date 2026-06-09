const config = require("../config");

class MemoryCache {
  /**
   * @param {number} ttl - Time-to-live in seconds for each entry.
   * @param {number} [cleanupIntervalMs] - How often expired keys are swept.
   *   Defaults to the TTL window (min 60s). Pass 0 to disable the sweeper.
   */
  constructor(ttl = config.cache.ttl, cleanupIntervalMs) {
    this.store = new Map();
    this.ttl = ttl * 1000;

    const interval =
      cleanupIntervalMs === undefined
        ? Math.max(this.ttl, 60 * 1000)
        : cleanupIntervalMs;

    if (interval > 0) {
      this.cleanupTimer = setInterval(() => this.cleanup(), interval);
      // Do not keep the event loop (or test runner) alive for the sweeper.
      if (typeof this.cleanupTimer.unref === "function") {
        this.cleanupTimer.unref();
      }
    }
  }

  get(key) {
    const entry = this.store.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key, data) {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + this.ttl,
    });
  }

  flush() {
    this.store.clear();
  }

  /**
   * Proactively removes expired entries so unread keys do not linger in memory.
   * @returns {number} Number of entries removed.
   */
  cleanup() {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        removed++;
      }
    }

    return removed;
  }

  getStats() {
    let activeKeys = 0;
    let expiredKeys = 0;
    const now = Date.now();

    for (const [, entry] of this.store) {
      if (now > entry.expiresAt) {
        expiredKeys++;
      } else {
        activeKeys++;
      }
    }

    return { activeKeys, expiredKeys, totalKeys: this.store.size };
  }

  /** Stops the background sweeper. Mainly useful for tests and shutdown. */
  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

module.exports = new MemoryCache();
module.exports.MemoryCache = MemoryCache;
