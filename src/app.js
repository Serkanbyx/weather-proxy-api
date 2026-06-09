const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const weatherRoutes = require("./routes/weatherRoutes");
const cacheRoutes = require("./routes/cacheRoutes");
const renderWelcomePage = require("./views/welcomePage");

const { version } = require("../package.json");

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
app.use("/api", rateLimiter);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check (machine-readable, suitable for uptime probes)
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/cache", cacheRoutes);

// Welcome page
app.get("/", (_req, res) => {
  res.send(renderWelcomePage(version));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
