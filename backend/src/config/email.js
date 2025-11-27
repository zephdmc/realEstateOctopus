// Email service configuration
const emailConfig = {
    // SMTP configuration
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      
      // Connection pool options
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    },
  
    // Email defaults
    defaults: {
      from: `"EliteProperties" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_FROM
    },
  
    // Template configuration
    templates: {
      // Base URL for template assets
      assetsBaseUrl: process.env.EMAIL_ASSETS_BASE_URL || 'https://eliteproperties.com/email-assets',
      
      // Company information for templates
      company: {
        name: 'EliteProperties',
        logo: 'https://eliteproperties.com/logo.png',
        phone: process.env.COMPANY_PHONE || '(555) 123-4567',
        address: process.env.COMPANY_ADDRESS || '123 Real Estate Ave, Suite 100, New York, NY 10001',
        website: process.env.COMPANY_WEBSITE || 'https://eliteproperties.com'
      }
    },
  
    // Email sending options
    sending: {
      // Maximum retry attempts for failed emails
      maxRetries: 3,
      
      // Delay between retries (in milliseconds)
      retryDelay: 5000,
      
      // Batch size for bulk emails
      batchSize: 50,
      
      // Delay between batches (in milliseconds)
      batchDelay: 1000
    },
  
    // Email tracking and analytics
    tracking: {
      // Enable open tracking
      openTracking: true,
      
      // Enable click tracking
      clickTracking: true,
      
      // Google Analytics tracking
      googleAnalytics: {
        enabled: true,
        campaignSource: 'email',
        campaignMedium: 'email',
        campaignName: 'transactional'
      }
    },
  
    // Test configuration
    test: {
      // Redirect all emails to this address in development
      redirectTo: process.env.EMAIL_REDIRECT_TO,
      
      // Enable test mode
      enabled: process.env.NODE_ENV === 'development'
    }
  };
  
  export default emailConfig;