# 🌦️ Weather Proxy API

Weather Proxy API is a secure and production-ready backend service that fetches weather data from OpenWeather while keeping your API key hidden from client-side applications. It includes in-memory caching, request rate limiting, strict input validation, and Swagger-powered API documentation for fast development and safer integrations.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **Secure Proxy Architecture**: Hides the `OPENWEATHER_API_KEY` on the server and prevents direct key exposure in frontend apps.
- **Response Filtering**: Returns only relevant weather fields so client payloads stay clean and predictable.
- **In-Memory Caching**: Serves repeated requests from memory with TTL support to reduce external API calls and latency.
- **Rate Limiting Protection**: Applies request limits on `/api/*` routes to reduce abuse and improve service stability.
- **Input Validation**: Validates `city`, `lat`, and `lon` query parameters before calling external APIs.
- **Interactive Swagger Docs**: Auto-generates and serves API docs at `/api-docs` for easier testing and onboarding.
- **Security Middleware Stack**: Uses Helmet, CORS, and a centralized error handler for safer defaults.

## Live Demo

[🎮 View Live Demo](https://weather-proxy-api-yrc5.onrender.com/)

Also try:

- API docs: [Swagger UI](https://weather-proxy-api-yrc5.onrender.com/api-docs)
- Health endpoint: [Service status](https://weather-proxy-api-yrc5.onrender.com/health)

## Technologies

- **Node.js**: JavaScript runtime for backend services.
- **Express.js**: Web framework for routing and middleware orchestration.
- **Axios**: HTTP client to communicate with OpenWeather endpoints.
- **dotenv**: Environment variable management for secure configuration.
- **helmet**: Secure HTTP headers for better baseline protection.
- **cors**: Controlled cross-origin access for frontend integrations.
- **express-rate-limit**: Request throttling middleware for abuse prevention.
- **swagger-jsdoc**: OpenAPI document generation from JSDoc comments.
- **swagger-ui-express**: Interactive Swagger UI hosting inside Express.
- **nodemon**: Development-time auto-reload for rapid iteration.

## Installation

### Local Development

1. Clone the repository.
2. Install dependencies.
3. Create and configure your `.env` file.
4. Start the development server.

#### Node.js (Recommended)

```bash
git clone https://github.com/Serkanbyx/weather-proxy-api.git
cd weather-proxy-api
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
OPENWEATHER_API_KEY=your_openweather_api_key
CACHE_TTL=600
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

Run the project:

```bash
# Development
npm run dev

# Production
npm start
```

Run the test suite:

```bash
# Run all tests once
npm test

# Re-run tests on file changes
npm run test:watch
```

#### VS Code Workflow (Alternative)

```bash
code .
```

Then use the integrated terminal:

```bash
npm install
npm run dev
```

## Usage

1. Start the API locally with `npm run dev` or use the live Render deployment.
2. Open `/api-docs` to inspect and test all endpoints interactively.
3. Call weather endpoints with either city or coordinate parameters.
4. Monitor cache behavior through `/api/cache/stats`.
5. Clear cache manually when needed with `DELETE /api/cache/flush`.

Example request:

```bash
curl "http://localhost:3000/api/weather/current?city=Istanbul"
```

## How It Works?

> For a full, step-by-step build playbook (from scaffolding to deployment), see [docs/build-guide.md](./docs/build-guide.md).

### Request Flow

1. The client sends a request to `/api/weather/*`.
2. Rate limiter checks quota for the current window.
3. Query validation middleware validates required inputs.
4. Service layer checks cache and returns cached data if available.
5. If cache miss, API calls OpenWeather and filters the response.
6. Filtered response is cached and returned to the client.

### Cache and Rate Limit Parameters

```javascript
const cacheTtlSeconds = Number(process.env.CACHE_TTL || 600);
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 900000);
const rateLimitMaxRequests = Number(process.env.RATE_LIMIT_MAX || 100);
```

### Core Endpoints

```text
GET    /api/weather/current?city={city}
GET    /api/weather/current/coords?lat={lat}&lon={lon}
GET    /api/weather/forecast?city={city}
GET    /api/weather/forecast/coords?lat={lat}&lon={lon}
GET    /api/cache/stats
DELETE /api/cache/flush
GET    /health
GET    /
```

## Customization

### Add Your Own Weather Provider

You can replace or extend OpenWeather integration inside `src/services/weatherService.js` by keeping response shapes stable for controllers.

```javascript
async function fetchCurrentWeatherByCity(cityName) {
  // Replace provider endpoint or add fallback providers here.
  // Keep returned object format consistent with controller expectations.
}
```

### Change Cache and Rate Limit Policies

Adjust values in `.env`:

```env
CACHE_TTL=300
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=30
```

### Extend Validation Rules

Add stricter constraints in `src/middlewares/validateQuery.js` to enforce custom city formats, regional whitelists, or coordinate precision.

## Features in Detail

### Completed Features

- ✅ Secure API key handling with backend proxy design
- ✅ Current and forecast weather by city
- ✅ Current and forecast weather by coordinates
- ✅ In-memory caching with cache stats and flush operations
- ✅ Rate limiting on API routes
- ✅ Swagger documentation with OpenAPI schema generation
- ✅ Centralized error handling and middleware-based architecture
- ✅ JSON health check endpoint for uptime probes
- ✅ Unit and integration test suite (Jest + Supertest)

### Future Features

- [ ] Redis-based distributed cache for multi-instance deployments
- [ ] Request logging and tracing with correlation IDs
- [ ] API key authentication for consumer applications
- [ ] CI quality gates wired to the existing test suite
- [ ] Multi-provider weather fallback strategy

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./.github/CONTRIBUTING.md) and [Code of Conduct](./.github/CODE_OF_CONDUCT.md) before getting started. To report a vulnerability, see our [Security Policy](./.github/SECURITY.md).

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feat/amazing-improvement
```

3. Commit your changes using clear commit prefixes:

```bash
git commit -m "feat: add weather alerts endpoint"
git commit -m "fix: validate negative longitude values"
git commit -m "docs: update usage examples"
```

4. Push your branch:

```bash
git push origin feat/amazing-improvement
```

5. Open a Pull Request and describe:
   - what changed,
   - why it changed,
   - how to test it.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Developer

**Serkanby**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- [OpenWeather API](https://openweathermap.org/api) for weather data services.
- [Render](https://render.com/) for deployment and hosting workflow.
- Express and Swagger community packages powering API infrastructure and documentation.

## Contact

- [Open an Issue](https://github.com/Serkanbyx/weather-proxy-api/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---
⭐ If you like this project, don't forget to give it a star!
