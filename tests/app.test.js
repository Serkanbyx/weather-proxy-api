const request = require("supertest");
const app = require("../src/app");
const cache = require("../src/utils/cache");

afterAll(() => {
  cache.stopCleanup();
});

describe("GET /health", () => {
  test("returns a healthy JSON status", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, status: "ok" });
    expect(typeof res.body.uptime).toBe("number");
    expect(typeof res.body.timestamp).toBe("string");
  });
});

describe("GET /", () => {
  test("serves the HTML landing page", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toContain("Weather Proxy API");
  });
});

describe("Cache routes", () => {
  test("GET /api/cache/stats returns cache statistics", async () => {
    const res = await request(app).get("/api/cache/stats");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("totalKeys");
  });

  test("DELETE /api/cache/flush clears the cache", async () => {
    const res = await request(app).delete("/api/cache/flush");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true });
  });
});

describe("Weather route validation", () => {
  test("GET /api/weather/current without city returns 400", async () => {
    const res = await request(app).get("/api/weather/current");

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ success: false });
  });

  test("GET /api/weather/current/coords with bad coords returns 400", async () => {
    const res = await request(app).get(
      "/api/weather/current/coords?lat=999&lon=999"
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("Unknown routes", () => {
  test("returns 404 for an unmapped path", async () => {
    const res = await request(app).get("/does-not-exist");

    expect(res.status).toBe(404);
  });
});
