const { Router } = require("express");
const weatherController = require("../controllers/weatherController");
const {
  validateCityQuery,
  validateCoordQuery,
} = require("../middlewares/validateQuery");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Temperature:
 *       type: object
 *       properties:
 *         current:
 *           type: number
 *           example: 22.5
 *         feelsLike:
 *           type: number
 *           example: 21.8
 *         min:
 *           type: number
 *           example: 20.0
 *         max:
 *           type: number
 *           example: 25.0
 *     Wind:
 *       type: object
 *       properties:
 *         speed:
 *           type: number
 *           example: 3.6
 *         degree:
 *           type: number
 *           example: 180
 *     WeatherCondition:
 *       type: object
 *       properties:
 *         main:
 *           type: string
 *           example: Clear
 *         description:
 *           type: string
 *           example: clear sky
 *         icon:
 *           type: string
 *           example: https://openweathermap.org/img/wn/01d@2x.png
 *     CurrentWeather:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           example: Istanbul
 *         country:
 *           type: string
 *           example: TR
 *         coordinates:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *               example: 41.01
 *             lon:
 *               type: number
 *               example: 28.98
 *         temperature:
 *           $ref: '#/components/schemas/Temperature'
 *         humidity:
 *           type: number
 *           example: 65
 *         pressure:
 *           type: number
 *           example: 1013
 *         wind:
 *           $ref: '#/components/schemas/Wind'
 *         weather:
 *           $ref: '#/components/schemas/WeatherCondition'
 *         visibility:
 *           type: number
 *           example: 10000
 *         clouds:
 *           type: number
 *           example: 0
 *         timestamp:
 *           type: number
 *           example: 1700000000
 *         _cached:
 *           type: boolean
 *           example: false
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: Query parameter 'city' is required.
 */

/**
 * @swagger
 * /weather/current:
 *   get:
 *     summary: Get current weather by city name
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name (e.g. Istanbul, London)
 *     responses:
 *       200:
 *         description: Current weather data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CurrentWeather'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: City not found
 *       429:
 *         description: Rate limit exceeded
 */
router.get("/current", validateCityQuery, weatherController.getCurrentByCity);

/**
 * @swagger
 * /weather/current/coords:
 *   get:
 *     summary: Get current weather by coordinates
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude (-90 to 90)
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude (-180 to 180)
 *     responses:
 *       200:
 *         description: Current weather data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CurrentWeather'
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */
router.get(
  "/current/coords",
  validateCoordQuery,
  weatherController.getCurrentByCoords
);

/**
 * @swagger
 * /weather/forecast:
 *   get:
 *     summary: Get 5-day / 3-hour forecast by city name
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name (e.g. Istanbul, London)
 *     responses:
 *       200:
 *         description: 5-day forecast data
 *       400:
 *         description: Validation error
 *       404:
 *         description: City not found
 *       429:
 *         description: Rate limit exceeded
 */
router.get(
  "/forecast",
  validateCityQuery,
  weatherController.getForecastByCity
);

/**
 * @swagger
 * /weather/forecast/coords:
 *   get:
 *     summary: Get 5-day / 3-hour forecast by coordinates
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude (-90 to 90)
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude (-180 to 180)
 *     responses:
 *       200:
 *         description: 5-day forecast data
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */
router.get(
  "/forecast/coords",
  validateCoordQuery,
  weatherController.getForecastByCoords
);

module.exports = router;
