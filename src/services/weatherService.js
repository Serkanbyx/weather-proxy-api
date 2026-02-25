const axios = require("axios");
const config = require("../config");
const cache = require("../utils/cache");
const ApiError = require("../utils/ApiError");

const openWeatherClient = axios.create({
  baseURL: config.openWeather.baseUrl,
  timeout: 10000,
  params: {
    appid: config.openWeather.apiKey,
    units: "metric",
  },
});

/**
 * Filters raw OpenWeather response to only expose relevant fields.
 * This prevents leaking internal API structure and reduces payload size.
 */
const filterCurrentWeather = (raw) => ({
  city: raw.name,
  country: raw.sys?.country,
  coordinates: {
    lat: raw.coord?.lat,
    lon: raw.coord?.lon,
  },
  temperature: {
    current: raw.main?.temp,
    feelsLike: raw.main?.feels_like,
    min: raw.main?.temp_min,
    max: raw.main?.temp_max,
  },
  humidity: raw.main?.humidity,
  pressure: raw.main?.pressure,
  wind: {
    speed: raw.wind?.speed,
    degree: raw.wind?.deg,
  },
  weather: {
    main: raw.weather?.[0]?.main,
    description: raw.weather?.[0]?.description,
    icon: raw.weather?.[0]?.icon
      ? `https://openweathermap.org/img/wn/${raw.weather[0].icon}@2x.png`
      : null,
  },
  visibility: raw.visibility,
  clouds: raw.clouds?.all,
  timestamp: raw.dt,
});

const filterForecast = (raw) => ({
  city: raw.city?.name,
  country: raw.city?.country,
  coordinates: {
    lat: raw.city?.coord?.lat,
    lon: raw.city?.coord?.lon,
  },
  forecast: raw.list?.map((item) => ({
    datetime: item.dt_txt,
    timestamp: item.dt,
    temperature: {
      current: item.main?.temp,
      feelsLike: item.main?.feels_like,
      min: item.main?.temp_min,
      max: item.main?.temp_max,
    },
    humidity: item.main?.humidity,
    weather: {
      main: item.weather?.[0]?.main,
      description: item.weather?.[0]?.description,
      icon: item.weather?.[0]?.icon
        ? `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        : null,
    },
    wind: {
      speed: item.wind?.speed,
      degree: item.wind?.deg,
    },
  })),
});

const fetchFromApi = async (endpoint, params, cacheKey, filterFn) => {
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, _cached: true };
  }

  try {
    const { data } = await openWeatherClient.get(endpoint, { params });
    const filtered = filterFn(data);
    cache.set(cacheKey, filtered);
    return { ...filtered, _cached: false };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || "Failed to fetch weather data.";

      if (status === 401) {
        throw new ApiError(500, "Weather service authentication failed.");
      }
      if (status === 404) {
        throw new ApiError(404, `Location not found: ${message}`);
      }
      if (status === 429) {
        throw new ApiError(429, "Weather API rate limit exceeded. Try later.");
      }

      throw new ApiError(status, message);
    }

    throw new ApiError(502, "Unable to reach weather service.");
  }
};

const getCurrentByCity = (city) =>
  fetchFromApi(
    "/weather",
    { q: city },
    `current:city:${city.toLowerCase()}`,
    filterCurrentWeather
  );

const getCurrentByCoords = (lat, lon) =>
  fetchFromApi(
    "/weather",
    { lat, lon },
    `current:coords:${lat}:${lon}`,
    filterCurrentWeather
  );

const getForecastByCity = (city) =>
  fetchFromApi(
    "/forecast",
    { q: city },
    `forecast:city:${city.toLowerCase()}`,
    filterForecast
  );

const getForecastByCoords = (lat, lon) =>
  fetchFromApi(
    "/forecast",
    { lat, lon },
    `forecast:coords:${lat}:${lon}`,
    filterForecast
  );

module.exports = {
  getCurrentByCity,
  getCurrentByCoords,
  getForecastByCity,
  getForecastByCoords,
};
