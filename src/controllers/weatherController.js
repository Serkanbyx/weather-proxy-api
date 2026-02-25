const weatherService = require("../services/weatherService");

const getCurrentByCity = async (req, res, next) => {
  try {
    const { city } = req.query;
    const data = await weatherService.getCurrentByCity(city);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getCurrentByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const data = await weatherService.getCurrentByCoords(lat, lon);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getForecastByCity = async (req, res, next) => {
  try {
    const { city } = req.query;
    const data = await weatherService.getForecastByCity(city);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getForecastByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const data = await weatherService.getForecastByCoords(lat, lon);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentByCity,
  getCurrentByCoords,
  getForecastByCity,
  getForecastByCoords,
};
