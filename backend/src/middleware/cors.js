import cors from 'cors';

// CORS configuration
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
    ];

    console.log(`🔍 CORS checking origin: ${origin}`);
    console.log(`📋 Allowed origins:`, allowedOrigins);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
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
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'Content-Disposition'
  ],
  maxAge: 86400 // 24 hours
};

// Enhanced CORS middleware with better error handling
export const configureCors = (app) => {
  console.log('🔧 Configuring CORS middleware...');
  
  // Apply CORS middleware
  app.use(cors(corsOptions));
  
  // Handle preflight requests explicitly
  app.options('*', cors(corsOptions));
  
  // Manual CORS headers as backup
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'https://eliteproperties.vercel.app',
      'https://zephdmc.github.io',
      'https://zephdmc.github.io/realEstateOctopus',
    ];

    // Set CORS headers
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log('🛬 Handling preflight request for:', req.path);
      return res.status(200).end();
    }

    next();
  });

  console.log('✅ CORS middleware configured');
};

// Emergency CORS for testing
export const emergencyCorsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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
      process.env.FRONTEND_URL,
      'https://zephdmc.github.io',
      'https://zephdmc.github.io/realEstateOctopus',
      'http://localhost:3000',
      'http://localhost:5173'
    ]
  });
};

export default corsOptions;
