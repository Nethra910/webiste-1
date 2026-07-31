const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

const requestStore = new Map();

const authRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();
  const current = requestStore.get(ip);

  if (!current || now > current.resetAt) {
    requestStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  }

  current.count += 1;
  requestStore.set(ip, current);
  return next();
};

module.exports = authRateLimit;
