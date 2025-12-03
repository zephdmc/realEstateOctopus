import cors from "cors";

export const configureCors = (app) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "https://eliteproperties.vercel.app",
    "https://zephdmc.github.io",
    "https://realestateoctopus.onrender.com",
  ].filter(Boolean);

  const corsOptions = {
    origin: (origin, callback) => {
      console.log("🌍 CORS CHECK — Request Origin:", origin);
      if (!origin) return callback(null, true); // Postman / server-to-server
      if (origin.startsWith("https://zephdmc.github.io")) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn("❌ BLOCKED ORIGIN:", origin);
      return callback(null, false); // do NOT throw
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    optionsSuccessStatus: 200, // important for preflight
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  console.log("🚀 CORS FINAL Allowed Origins:", allowedOrigins);
};
