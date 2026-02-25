const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const config = require("./config");
const swaggerSpec = require("./config/swagger");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const weatherRoutes = require("./routes/weatherRoutes");
const cacheRoutes = require("./routes/cacheRoutes");

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
app.use("/api", rateLimiter);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/cache", cacheRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Weather Proxy API is running.",
    docs: "/api-docs",
  });
});

// Global error handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Swagger docs: http://localhost:${config.port}/api-docs`);
});

module.exports = app;
