import cors from "cors";

export const configureCors = (app) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "https://eliteproperties.vercel.app",
    "https://zephdmc.github.io",
  ].filter(Boolean);

  const corsOptions = {
    origin: (origin, callback) => {
      console.log("🌍 CORS CHECK — Request Origin:", origin);

      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      // GitHub Pages sub-path
      if (origin.startsWith("https://zephdmc.github.io")) return callback(null, true);

      // Standard allow list
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Block unknown origins — but don't crash
      console.warn("❌ BLOCKED ORIGIN:", origin);
      return callback(null, false); // <--- important change
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    optionsSuccessStatus: 200, // ensures preflight OPTIONS requests succeed
  };

  app.use(cors(corsOptions));

  // Handle preflight requests explicitly
  app.options("*", cors(corsOptions));

  console.log("🚀 CORS FINAL Allowed Origins:", allowedOrigins);
};
