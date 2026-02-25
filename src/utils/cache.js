const config = require("../config");

class MemoryCache {
  constructor(ttl = config.cache.ttl) {
    this.store = new Map();
    this.ttl = ttl * 1000;
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
}

module.exports = new MemoryCache();
