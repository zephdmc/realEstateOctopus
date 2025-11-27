import cors from "cors";

export const configureCors = (app) => {
  const allowedOrigins = [
    "https://zephdmc.github.io",
    "https://zephdmc.github.io/realEstateOctopus",
    "https://eliteproperties.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      console.log("🌍 CORS CHECK — Origin:", origin);

      if (!origin) return callback(null, true); // allow Postman, server calls

      if (origin.startsWith("https://zephdmc.github.io")) {
        return callback(null, true); // allow all GitHub Pages paths
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED ORIGIN:", origin);
      return callback(new Error("Blocked by CORS"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  };

  console.log("🚀 CORS FINAL Allowed Origins:", allowedOrigins);

  app.use(cors(corsOptions));
};
