jest.mock("axios");

const axios = require("axios");

const mockGet = jest.fn();
axios.create.mockReturnValue({ get: mockGet });

const weatherService = require("../src/services/weatherService");
const cache = require("../src/utils/cache");
const ApiError = require("../src/utils/ApiError");

const rawCurrent = {
  name: "Istanbul",
  sys: { country: "TR" },
  coord: { lat: 41.01, lon: 28.98 },
  main: {
    temp: 22.5,
    feels_like: 21.8,
    temp_min: 20,
    temp_max: 25,
    humidity: 65,
    pressure: 1013,
  },
  wind: { speed: 3.6, deg: 180 },
  weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
  visibility: 10000,
  clouds: { all: 0 },
  dt: 1700000000,
};

beforeEach(() => {
  cache.flush();
  mockGet.mockReset();
});

afterAll(() => {
  cache.stopCleanup();
});

describe("weatherService.getCurrentByCity", () => {
  test("maps the raw response to the filtered shape", async () => {
    mockGet.mockResolvedValueOnce({ data: rawCurrent });

    const result = await weatherService.getCurrentByCity("Istanbul");

    expect(result).toMatchObject({
      city: "Istanbul",
      country: "TR",
      temperature: { current: 22.5, feelsLike: 21.8, min: 20, max: 25 },
      wind: { speed: 3.6, degree: 180 },
      weather: {
        main: "Clear",
        description: "clear sky",
        icon: "https://openweathermap.org/img/wn/01d@2x.png",
      },
      _cached: false,
    });
  });

  test("serves the second identical request from cache", async () => {
    mockGet.mockResolvedValueOnce({ data: rawCurrent });

    const first = await weatherService.getCurrentByCity("Istanbul");
    const second = await weatherService.getCurrentByCity("Istanbul");

    expect(first._cached).toBe(false);
    expect(second._cached).toBe(true);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("is case-insensitive for the cache key", async () => {
    mockGet.mockResolvedValueOnce({ data: rawCurrent });

    await weatherService.getCurrentByCity("Istanbul");
    const second = await weatherService.getCurrentByCity("istanbul");

    expect(second._cached).toBe(true);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});

describe("weatherService.getCurrentByCoords cache key", () => {
  test("treats equivalent coordinates as the same cache entry", async () => {
    mockGet.mockResolvedValueOnce({ data: rawCurrent });

    await weatherService.getCurrentByCoords(41.0, 28.98);
    const second = await weatherService.getCurrentByCoords(41, 28.98);

    expect(second._cached).toBe(true);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});

describe("weatherService error mapping", () => {
  test("maps a 404 upstream error to a 404 ApiError", async () => {
    mockGet.mockRejectedValue({
      response: { status: 404, data: { message: "city not found" } },
    });

    const error = await weatherService
      .getCurrentByCity("Nowhere")
      .catch((err) => err);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(404);
  });

  test("hides upstream 401 behind a generic 500", async () => {
    mockGet.mockRejectedValue({
      response: { status: 401, data: { message: "invalid key" } },
    });

    await expect(
      weatherService.getCurrentByCity("Istanbul")
    ).rejects.toMatchObject({ statusCode: 500 });
  });

  test("maps a network failure to a 502 ApiError", async () => {
    mockGet.mockRejectedValue(new Error("network down"));

    await expect(
      weatherService.getCurrentByCity("Istanbul")
    ).rejects.toMatchObject({ statusCode: 502 });
  });
});
