import rateLimit from "express-rate-limit";

// 🔹 Helper function to log blocked requests
const logBlocked = (req, message) => {
  console.warn(
    `🚫 RATE LIMIT BLOCKED — IP: ${req.ip}, Route: ${req.originalUrl}, Reason: ${message}`
  );
};

// 🔹 General API limiter (most routes)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Normal requests
  handler: (req, res) => {
    logBlocked(req, "General limiter exceeded");
    return res.status(429).json({
      success: false,
      error: "Too many requests, please try again later.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔹 Authentication limiter (very strict)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Prevent brute force login
  handler: (req, res) => {
    logBlocked(req, "Auth limiter exceeded");
    return res.status(429).json({
      success: false,
      error: "Too many login attempts. Try again in 15 minutes.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔹 Contact form limiter
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 submissions per hour
  handler: (req, res) => {
    logBlocked(req, "Contact form limiter exceeded");
    return res.status(429).json({
      success: false,
      error: "Too many submissions. Try again later.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔹 API key / heavy request limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Allow high traffic
  handler: (req, res) => {
    logBlocked(req, "API limiter exceeded");
    return res.status(429).json({
      success: false,
      error: "API rate limit exceeded. Try later.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
