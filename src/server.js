const app = require("./app");
const config = require("./config");

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Swagger docs: http://localhost:${config.port}/api-docs`);
});

module.exports = server;
