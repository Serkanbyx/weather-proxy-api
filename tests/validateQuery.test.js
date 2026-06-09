const {
  validateCityQuery,
  validateCoordQuery,
} = require("../src/middlewares/validateQuery");
const ApiError = require("../src/utils/ApiError");

const runMiddleware = (middleware, query) => {
  const req = { query };
  const next = jest.fn();
  middleware(req, {}, next);
  return { req, next };
};

describe("validateCityQuery", () => {
  test("passes and trims a valid city", () => {
    const { req, next } = runMiddleware(validateCityQuery, {
      city: "  Istanbul  ",
    });

    expect(req.query.city).toBe("Istanbul");
    expect(next).toHaveBeenCalledWith();
  });

  test("rejects a missing city", () => {
    const { next } = runMiddleware(validateCityQuery, {});

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("rejects a blank city", () => {
    const { next } = runMiddleware(validateCityQuery, { city: "   " });

    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });
});

describe("validateCoordQuery", () => {
  test("passes and parses valid coordinates", () => {
    const { req, next } = runMiddleware(validateCoordQuery, {
      lat: "41.01",
      lon: "28.98",
    });

    expect(req.query.lat).toBe(41.01);
    expect(req.query.lon).toBe(28.98);
    expect(next).toHaveBeenCalledWith();
  });

  test("rejects missing coordinates", () => {
    const { next } = runMiddleware(validateCoordQuery, { lat: "41" });

    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("rejects out-of-range coordinates", () => {
    const { next } = runMiddleware(validateCoordQuery, {
      lat: "120",
      lon: "200",
    });

    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test("rejects non-numeric coordinates", () => {
    const { next } = runMiddleware(validateCoordQuery, {
      lat: "abc",
      lon: "28.98",
    });

    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });
});
