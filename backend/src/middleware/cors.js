import cors from "cors";

export const configureCors = (app) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,                // For production deployments
    "http://localhost:5173",                 // Vite dev
    "http://localhost:3000",                 // React dev
    "https://eliteproperties.vercel.app",    // Vercel hosted frontend
    "https://zephdmc.github.io",             // GitHub Pages main
  ].filter(Boolean); // remove undefined values

  const corsOptions = {
    origin: (origin, callback) => {
      console.log("🌍 CORS CHECK — Request Origin:", origin);

      // Allow non-browser tools (Postman, server-to-server)
      if (!origin) {
        console.log("✔ Allowed — No origin (Postman or backend request)");
        return callback(null, true);
      }

      // Special rule: allow any GitHub Pages sub-path under your username
      if (origin.startsWith("https://zephdmc.github.io")) {
        console.log("✔ Allowed — GitHub Pages sub-path detected");
        return callback(null, true);
      }

      // Standard allow list checking
      if (allowedOrigins.includes(origin)) {
        console.log("✔ Allowed — Origin matched allowedOrigins");
        return callback(null, true);
      }

      // Blocked origin
      console.log("❌ BLOCKED — Not in allowedOrigins");
      callback(new Error("Blocked by CORS"));
    },

    credentials: true, // allow cookies & auth
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  };

  console.log("🚀 CORS Ready — Allowed Origins:", allowedOrigins);

  app.use(cors(corsOptions));
};
