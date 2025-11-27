import cors from "cors";

export const configureCors = (app) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,               // Production frontend
    "http://localhost:5173",                // Vite dev
    "http://localhost:3000",                // React dev
    "https://eliteproperties.vercel.app",   // Vercel frontend
    "https://zephdmc.github.io",            // GitHub Pages
  ].filter(Boolean); // Remove undefined values

  const corsOptions = {
    origin: (origin, callback) => {
      console.log("🌍 Incoming Origin:", origin);

      // Allow Postman, backend requests, server-to-server
      if (!origin) {
        console.log("✔ Allowed — No origin (Postman / backend)");
        return callback(null, true);
      }

      // Safe check before using startsWith
      if (typeof origin === "string" && origin.startsWith("https://zephdmc.github.io")) {
        console.log("✔ Allowed — GitHub Pages sub-path");
        return callback(null, true);
      }

      // Standard allow list rule
      if (allowedOrigins.includes(origin)) {
        console.log("✔ Allowed — Found in allowedOrigins");
        return callback(null, true);
      }

      // If nothing matched → Block
      console.log("❌ BLOCKED — Origin not allowed:", origin);
      return callback(new Error("Blocked by CORS"));
    },

    credentials: true, // Send cookies / auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  };

  console.log("🚀 CORS initialized. Allowed Origins:", allowedOrigins);

  app.use(cors(corsOptions));
};
