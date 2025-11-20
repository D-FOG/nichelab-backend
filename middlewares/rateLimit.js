import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 80,
  message: "Too many requests, try again later.",
});

export default limiter;
