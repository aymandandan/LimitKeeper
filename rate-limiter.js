const { RateLimiterMemory } = require("rate-limiter-flexible");

const LeakyConsume = require("./rate-limiter-algos/leaky-bucket").consumeIP;
const TokenConsume = require("./rate-limiter-algos/tokenBucketOOP").consumeIP;

// defualt options
const defualtOptions = {
  "sliding-window": {
    points: 100,
    duration: 60,
    blockDuration: 120,
  },
  "leaky-bucket": {
    capacity: 10,
    interval: 1,
  },
  "token-bucket": {
    capacity: 100,
    refillRate: 1,
    refillInterval: 1,
  },
};

// Function to create a rate limiter based on user input
function createRateLimiter(options) {
  const { technique, points, duration, blockDuration } = options;

  let rateLimiter;
  try {
    switch (technique) {
      case "sliding-window":
        rateLimiter = new RateLimiterMemory({
          points: points || defualtOptions["sliding-window"].points, // Number of requests
          duration: duration || defualtOptions["sliding-window"].duration, // Per second(s)
          blockDuration, // Block for the duration if points are consumed
        });
        break;
      case "leaky-bucket":
      case "token-bucket":
        rateLimiter = {};
        break;

      default:
        throw new Error("Invalid rate limiting technique specified");
    }

    return rateLimiter;
  } catch (err) {
    console.error(err);
  }
}

// a function that returns a middleware to create a request limiter and consume a request
function limitRequests(options = defualtOptions["sliding-window"]) {
  const rateLimiter = createRateLimiter(options);

  return async (req, res, next) => {
    try {
      const key = req.ip; // You can use req.ip, user ID, or any unique identifier

      // Attempt to consume a point (request)
      switch (options.technique) {
        case "sliding-window":
          await rateLimiter.consume(key);
          break;
        case "leaky-bucket":
          await LeakyConsume(
            key,
            options.capacity || defualtOptions["leaky-bucket"].capacity,
            options.interval || defualtOptions["leaky-bucket"].interval
          );
          break;
        case "token-bucket":
          TokenConsume(
            key,
            options.capacity || defualtOptions["token-bucket"].capacity,
            options.refillRate || defualtOptions["token-bucket"].refillRate,
            options.refillInterval ||
              defualtOptions["token-bucket"].refillInterval
          );
          break;
      }

      next();
    } catch (err) {
      res.status(429).json({
        message: `Too many requests, please try again after ${
          options.technique === "leaky-bucket"
            ? "a couple of"
            : options.technique === "token-bucket"
            ? parseInt(err.timeRemaining / 1000)
            : parseInt(err.msBeforeNext / 1000)
        } sec`,
      });
    }
  };
}

module.exports = limitRequests;
