# Weather Proxy API

A secure backend proxy that fetches weather data from the [OpenWeather API](https://openweathermap.org/api), hiding your API key from clients while providing **in-memory caching**, **rate limiting**, **input validation**, and **response filtering**.

## Features

- **Proxy Pattern** – Clients never see the OpenWeather API key.
- **In-Memory Cache** – Repeated requests are served from cache (configurable TTL).
- **Rate Limiting** – Prevents abuse with configurable request limits.
- **Response Filtering** – Only essential weather fields are returned.
- **Input Validation** – City names and coordinates are validated before forwarding.
- **Swagger Docs** – Interactive API documentation at `/api-docs`.
- **Security Hardened** – Helmet for HTTP headers, CORS enabled.

## Tech Stack

| Tool              | Purpose                          |
| ----------------- | -------------------------------- |
| Express.js        | Web framework                    |
| Axios             | HTTP client for OpenWeather API  |
| swagger-jsdoc     | Generate OpenAPI spec from JSDoc |
| swagger-ui-express| Serve interactive docs           |
| express-rate-limit| Rate limiting middleware          |
| Helmet            | Security headers                 |
| dotenv            | Environment variable management  |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- An [OpenWeather API key](https://home.openweathermap.org/api_keys) (free tier works)

### Installation

```bash
git clone <your-repo-url>
cd weather-proxy-api
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
PORT=3000
OPENWEATHER_API_KEY=your_api_key_here
CACHE_TTL=600
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to explore the Swagger documentation.

## API Endpoints

### Weather

| Method | Endpoint                      | Description                          |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/api/weather/current?city=`  | Current weather by city name         |
| GET    | `/api/weather/current/coords?lat=&lon=` | Current weather by coordinates |
| GET    | `/api/weather/forecast?city=` | 5-day / 3-hour forecast by city      |
| GET    | `/api/weather/forecast/coords?lat=&lon=` | 5-day forecast by coordinates |

### Cache Management

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/cache/stats`  | View cache statistics  |
| DELETE | `/api/cache/flush`  | Clear all cached data  |

### Health Check

| Method | Endpoint | Description        |
| ------ | -------- | ------------------ |
| GET    | `/`      | API status & links |

## Example Request

```bash
curl "http://localhost:3000/api/weather/current?city=Istanbul"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "city": "Istanbul",
    "country": "TR",
    "coordinates": { "lat": 41.01, "lon": 28.98 },
    "temperature": { "current": 22.5, "feelsLike": 21.8, "min": 20.0, "max": 25.0 },
    "humidity": 65,
    "pressure": 1013,
    "wind": { "speed": 3.6, "degree": 180 },
    "weather": { "main": "Clear", "description": "clear sky", "icon": "https://openweathermap.org/img/wn/01d@2x.png" },
    "visibility": 10000,
    "clouds": 0,
    "timestamp": 1700000000,
    "_cached": false
  }
}
```

## Deployment (Render)

1. Push to a GitHub repository.
2. Create a new **Web Service** on [Render](https://render.com/).
3. Connect the repository.
4. Set the environment variable `OPENWEATHER_API_KEY` in the Render dashboard.
5. Render will use the `render.yaml` blueprint automatically.

## Project Structure

```
src/
├── config/
│   ├── index.js          # Environment config
│   └── swagger.js        # Swagger/OpenAPI setup
├── controllers/
│   ├── weatherController.js
│   └── cacheController.js
├── middlewares/
│   ├── rateLimiter.js    # Rate limiting
│   ├── errorHandler.js   # Global error handler
│   └── validateQuery.js  # Input validation
├── routes/
│   ├── weatherRoutes.js  # Weather endpoints + Swagger docs
│   └── cacheRoutes.js    # Cache management endpoints
├── services/
│   └── weatherService.js # OpenWeather API integration + filtering
├── utils/
│   ├── cache.js          # In-memory cache implementation
│   └── ApiError.js       # Custom error class
└── server.js             # Express app entry point
```

## What I Learned

- **Rate Limiting** – Protecting APIs from abuse with token bucket algorithms.
- **API Security** – Hiding third-party API keys behind a proxy server.
- **Proxy Pattern** – Backend-for-frontend approach to manage external APIs.
- **Caching Strategies** – TTL-based in-memory caching to reduce external API calls.
- **Response Filtering** – Transforming and trimming API responses for clients.

## License

MIT
