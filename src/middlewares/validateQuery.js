const ApiError = require("../utils/ApiError");

const validateCityQuery = (req, _res, next) => {
  const { city } = req.query;

  if (!city || typeof city !== "string" || city.trim().length === 0) {
    return next(new ApiError(400, "Query parameter 'city' is required."));
  }

  req.query.city = city.trim();
  next();
};

const validateCoordQuery = (req, _res, next) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return next(
      new ApiError(400, "Query parameters 'lat' and 'lon' are required.")
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return next(
      new ApiError(400, "Invalid coordinates. lat: -90~90, lon: -180~180.")
    );
  }

  req.query.lat = latitude;
  req.query.lon = longitude;
  next();
};

module.exports = { validateCityQuery, validateCoordQuery };
