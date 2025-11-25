// Google services configuration
const googleConfig = {
    // Google Sheets configuration
    sheets: {
      // Service account credentials
      serviceAccount: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
  
      // Spreadsheet IDs
      spreadsheetIds: {
        contacts: process.env.GOOGLE_SHEETS_CONTACTS_ID,
        appointments: process.env.GOOGLE_SHEETS_APPOINTMENTS_ID,
        properties: process.env.GOOGLE_SHEETS_PROPERTIES_ID
      },
  
      // Sheet ranges
      ranges: {
        contacts: 'Contacts!A:F',
        appointments: 'Appointments!A:G',
        properties: 'Properties!A:J'
      }
    },
  
    // Google Maps configuration
    maps: {
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      
      // Geocoding settings
      geocoding: {
        region: 'us',
        language: 'en'
      },
      
      // Static maps settings
      staticMaps: {
        size: '600x400',
        scale: 2,
        zoom: 15
      }
    },
  
    // Google Analytics configuration
    analytics: {
      trackingId: process.env.GOOGLE_ANALYTICS_ID,
      
      // Events tracking
      events: {
        propertyView: 'property_view',
        contactForm: 'contact_form',
        appointmentBook: 'appointment_book'
      }
    },
  
    // OAuth configuration (if needed for future features)
    oauth: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI
    }
  };
  
  export default googleConfig;