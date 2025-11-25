import { apiService } from './api';

class GoogleSheetsService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_GOOGLE_SHEETS_API_URL;
  }

  // Submit contact form data to Google Sheets
  async submitContactForm(data) {
    try {
      const submission = {
        timestamp: new Date().toISOString(),
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        subject: data.subject || '',
        message: data.message || '',
        propertyId: data.propertyId || '',
        propertyTitle: data.propertyTitle || '',
        inquiryType: data.type || 'general',
        source: 'website',
        userAgent: navigator.userAgent,
        ipAddress: '', // Would be captured server-side
      };

      const response = await apiService.post(`${this.apiUrl}/contact`, submission);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Google Sheets submission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit form',
      };
    }
  }

  // Submit appointment request
  async submitAppointment(data) {
    try {
      const appointment = {
        timestamp: new Date().toISOString(),
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        propertyId: data.propertyId || '',
        propertyTitle: data.propertyTitle || '',
        preferredDate: data.preferredDate || '',
        preferredTime: data.preferredTime || '',
        contactMethod: data.contactMethod || 'phone',
        urgency: data.urgency || 'normal',
        message: data.message || '',
        status: 'pending',
        source: 'website',
      };

      const response = await apiService.post(`${this.apiUrl}/appointments`, appointment);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Appointment submission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to schedule appointment',
      };
    }
  }

  // Submit newsletter subscription
  async submitNewsletter(data) {
    try {
      const subscription = {
        timestamp: new Date().toISOString(),
        email: data.email || '',
        firstName: data.firstName || '',
        preferences: JSON.stringify(data.preferences || {}),
        status: 'active',
        source: 'website',
      };

      const response = await apiService.post(`${this.apiUrl}/newsletter`, subscription);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Newsletter submission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to subscribe to newsletter',
      };
    }
  }

  // Submit property inquiry
  async submitPropertyInquiry(data) {
    try {
      const inquiry = {
        timestamp: new Date().toISOString(),
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        propertyId: data.propertyId || '',
        propertyTitle: data.propertyTitle || '',
        propertyPrice: data.propertyPrice || '',
        propertyType: data.propertyType || '',
        message: data.message || '',
        inquiryType: 'property',
        status: 'new',
        source: 'website',
      };

      const response = await apiService.post(`${this.apiUrl}/inquiries`, inquiry);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Property inquiry submission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit inquiry',
      };
    }
  }

  // Get analytics data (read from sheets)
  async getAnalytics(range = 'Analytics!A:Z') {
    try {
      const response = await apiService.get(`${this.apiUrl}/analytics`, {
        params: { range },
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Analytics fetch error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch analytics',
      };
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;