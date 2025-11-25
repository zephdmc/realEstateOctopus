import nodemailer from 'nodemailer';
import ErrorResponse from '../utils/ErrorResponse.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  'contact-confirmation': (context) => ({
    subject: 'Thank you for contacting EliteProperties',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f8fafc; padding: 20px; }
          .footer { text-align: center; padding: 20px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EliteProperties</h1>
          </div>
          <div class="content">
            <h2>Thank You for Contacting Us</h2>
            <p>Dear ${context.name},</p>
            <p>We have received your message regarding "${context.subject}" and will get back to you within 24 hours.</p>
            <p>If you have any urgent inquiries, please call us at ${process.env.COMPANY_PHONE || '(555) 123-4567'}.</p>
            <p>Best regards,<br>The EliteProperties Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EliteProperties. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'contact-notification': (context) => ({
    subject: `New Contact Message: ${context.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { background: #f8fafc; padding: 20px; }
          .info-item { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Message</h1>
          </div>
          <div class="content">
            <div class="info-item"><strong>Name:</strong> ${context.name}</div>
            <div class="info-item"><strong>Email:</strong> ${context.email}</div>
            <div class="info-item"><strong>Phone:</strong> ${context.phone || 'Not provided'}</div>
            <div class="info-item"><strong>Subject:</strong> ${context.subject}</div>
            <div class="info-item"><strong>Message:</strong><br>${context.message}</div>
            <div class="info-item"><strong>Received:</strong> ${new Date().toLocaleString()}</div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'appointment-confirmation-client': (context) => ({
    subject: 'Appointment Confirmation - EliteProperties',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { background: #f8fafc; padding: 20px; }
          .appointment-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${context.clientName},</p>
            <p>Your appointment has been confirmed with the following details:</p>
            
            <div class="appointment-details">
              <p><strong>Property:</strong> ${context.propertyTitle}</p>
              <p><strong>Date & Time:</strong> ${context.date}</p>
              <p><strong>Agent:</strong> ${context.agentName}</p>
              <p><strong>Agent Phone:</strong> ${context.agentPhone}</p>
            </div>
            
            <p>Please arrive 5 minutes early for your appointment. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            <p>Best regards,<br>The EliteProperties Team</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'password-reset': (context) => ({
    subject: 'Password Reset Request - EliteProperties',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { background: #f8fafc; padding: 20px; }
          .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Dear ${context.name},</p>
            <p>You have requested to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${context.resetUrl}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in ${context.expiry}. If you didn't request this reset, please ignore this email.</p>
            <p>Best regards,<br>The EliteProperties Team</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const template = emailTemplates[options.template];
    if (!template) {
      throw new ErrorResponse(`Email template '${options.template}' not found`, 500);
    }

    const emailContent = template(options.context);

    const mailOptions = {
      from: `"EliteProperties" <${process.env.SMTP_FROM}>`,
      to: options.to,
      subject: emailContent.subject,
      html: emailContent.html,
      ...options.overrides
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new ErrorResponse('Failed to send email', 500);
  }
};

// Send bulk email
export const sendBulkEmail = async (recipients, options) => {
  try {
    const transporter = createTransporter();
    
    const sendPromises = recipients.map(recipient => 
      sendEmail({ ...options, to: recipient })
    );

    const results = await Promise.allSettled(sendPromises);
    return results;
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw new ErrorResponse('Failed to send bulk email', 500);
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
};