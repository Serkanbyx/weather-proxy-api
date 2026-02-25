const cache = require("../utils/cache");

const getCacheStats = (_req, res) => {
  const stats = cache.getStats();
  res.json({ success: true, data: stats });
};

const flushCache = (_req, res) => {
  cache.flush();
  res.json({ success: true, message: "Cache cleared successfully." });
};

module.exports = { getCacheStats, flushCache };
