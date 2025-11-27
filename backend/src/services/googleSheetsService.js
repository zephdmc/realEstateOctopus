import { google } from 'googleapis';
import ErrorResponse from '../utils/ErrorResponse.js';

// Configure Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Append contact form data to Google Sheet
export const appendContactToSheet = async (contactData) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = 'Contacts!A:F';

    const values = [
      [
        new Date().toISOString(),
        contactData.name,
        contactData.email,
        contactData.phone || '',
        contactData.subject,
        contactData.message.substring(0, 100) + '...' // Truncate long messages
      ]
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    throw new ErrorResponse('Failed to save contact data to sheet', 500);
  }
};

// Append appointment data to Google Sheet
export const appendAppointmentToSheet = async (appointmentData) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = 'Appointments!A:G';

    const values = [
      [
        new Date().toISOString(),
        appointmentData.client.name,
        appointmentData.client.email,
        appointmentData.client.phone,
        appointmentData.property.title,
        appointmentData.date.toISOString().split('T')[0],
        appointmentData.time
      ]
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending appointment to Google Sheet:', error);
    throw new ErrorResponse('Failed to save appointment data to sheet', 500);
  }
};

// Get data from Google Sheet
export const getSheetData = async (range) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error reading from Google Sheet:', error);
    throw new ErrorResponse('Failed to read data from sheet', 500);
  }
};

// Clear sheet data
export const clearSheetData = async (range) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    
    const response = await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });

    return response.data;
  } catch (error) {
    console.error('Error clearing Google Sheet:', error);
    throw new ErrorResponse('Failed to clear sheet data', 500);
  }
};