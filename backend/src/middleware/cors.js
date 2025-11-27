import cors from 'cors';

// Simple and effective CORS configuration
export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('🌐 CORS: No origin (server-to-server request)');
      return callback(null, true);
    }
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'https://eliteproperties.vercel.app',
      'https://zephdmc.github.io',
      'https://zephdmc.github.io/realEstateOctopus',
    ].filter(Boolean); // Remove any undefined values

    console.log(`🔍 CORS checking origin: ${origin}`);

    // More flexible matching for GitHub Pages
    const isAllowed = allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.startsWith('https://zephdmc.github.io')
    );

    if (isAllowed || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log(`✅ CORS: Allowed origin - ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS: Blocked origin - ${origin}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200, // Important for some clients
  maxAge: 86400 // 24 hours
};

// Simplified CORS middleware - REMOVE DUPLICATE HEADERS
export const configureCors = (app) => {
  console.log('🔧 Configuring CORS middleware...');
  
  // Apply CORS middleware - THIS IS ENOUGH
  app.use(cors(corsOptions));
  
  // Handle preflight requests explicitly
  app.options('*', cors(corsOptions));
  
  console.log('✅ CORS middleware configured');
};

// Emergency CORS for testing - MORE PERMISSIVE
export const emergencyCors = (app) => {
  console.log('🚨 Applying emergency CORS configuration');
  
  app.use(cors({
    origin: [
      'https://zephdmc.github.io',
      'https://zephdmc.github.io/realEstateOctopus',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://eliteproperties.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
  }));
  
  app.options('*', cors());
};

// Test endpoint to verify CORS is working
export const testCors = (req, res) => {
  console.log('🔍 CORS Test - Headers:', {
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent']?.substring(0, 50)
  });

  res.json({
    success: true,
    message: 'CORS is working! 🎉',
    yourOrigin: req.headers.origin,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    allowedOrigins: [
      'https://zephdmc.github.io',
      'https://zephdmc.github.io/realEstateOctopus',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://eliteproperties.vercel.app'
    ]
  });
};

export default corsOptions;
