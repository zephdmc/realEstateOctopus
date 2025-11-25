import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';

const AppointmentForm = ({ 
  propertyId,
  propertyTitle,
  agentId,
  agentName,
  className = "",
  onSubmit: externalOnSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      propertyId: propertyId || '',
      propertyTitle: propertyTitle || '',
      agentId: agentId || '',
      agentName: agentName || '',
      preferredDate: '',
      preferredTime: '',
      message: '',
      contactMethod: 'phone',
      urgency: 'normal'
    },
    validate: (values) => {
      const errors = {};
      if (!values.name.trim()) errors.name = 'Name is required';
      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!values.phone.trim()) errors.phone = 'Phone number is required';
      if (!values.preferredDate) errors.preferredDate = 'Preferred date is required';
      if (!values.preferredTime) errors.preferredTime = 'Preferred time is required';
      return errors;
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        if (externalOnSubmit) {
          await externalOnSubmit(values);
        } else {
          await submitAppointmentWithEmailJS(values);
        }
        
        setSubmitStatus({ 
          type: 'success', 
          message: 'Thank you! Your appointment request has been submitted. We will contact you to confirm the details.' 
        });
        resetForm();
      } catch (error) {
        setSubmitStatus({ 
          type: 'error', 
          message: error.message || 'Sorry, there was an error submitting your appointment request. Please try again.' 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const submitAppointmentWithEmailJS = async (formData) => {
    // Dynamic import to avoid SSR issues
    const emailjs = await import('emailjs-com');
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      preferred_date: formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Not specified',
      preferred_time: formData.preferredTime || 'Not specified',
      contact_method: formData.contactMethod,
      urgency: formData.urgency,
      message: formData.message || 'No additional notes',
      property_title: formData.propertyTitle || 'Not specified',
      property_id: formData.propertyId || 'N/A',
      agent_name: formData.agentName || 'Not assigned',
      agent_id: formData.agentId || 'N/A',
      submitted_at: new Date().toLocaleString(),
      to_email: process.env.REACT_APP_ADMIN_EMAIL || 'admin@yourdomain.com'
    };

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_APPOINTMENT_TEMPLATE_ID || process.env.REACT_APP_EMAILJS_TEMPLATE_IDA,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error('EmailJS error:', error);
      throw new Error('Failed to submit appointment request. Please try again.');
    }
  };

  // Fallback method
  const submitWithFormspree = async (formData) => {
    const response = await fetch('https://formspree.io/f/your-appointment-form-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        contactMethod: formData.contactMethod,
        urgency: formData.urgency,
        message: formData.message,
        propertyTitle: formData.propertyTitle,
        propertyId: formData.propertyId,
        agentName: formData.agentName,
        agentId: formData.agentId,
        type: 'appointment',
        _replyto: formData.email,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit appointment request');
    }

    return response.json();
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  // Generate date options (next 14 days)
  const dateOptions = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dateOptions.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
  }

  const contactMethods = [
    { value: 'phone', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'text', label: 'Text Message' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Flexible timing' },
    { value: 'normal', label: 'Normal - Within a week' },
    { value: 'high', label: 'High - As soon as possible' }
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Schedule a Viewing
        </h3>
        <p className="text-gray-600">
          {propertyTitle 
            ? `Interested in viewing "${propertyTitle}"? Schedule an appointment and we'll arrange a viewing at your convenience.`
            : 'Schedule a property viewing with one of our expert agents.'
          }
        </p>
        {agentName && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Assigned Agent:</strong> {agentName}
            </p>
          </div>
        )}
      </div>

      {submitStatus && (
        <div className={`p-4 rounded-lg mb-6 ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-50 opacity-50' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-50 opacity-50' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-50 opacity-50' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method
            </label>
            <select
              id="contactMethod"
              name="contactMethod"
              value={values.contactMethod}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                isSubmitting ? 'bg-gray-50 opacity-50' : ''
              }`}
            >
              {contactMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preferred Date */}
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date *
            </label>
            <select
              id="preferredDate"
              name="preferredDate"
              value={values.preferredDate}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.preferredDate ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-50 opacity-50' : ''}`}
            >
              <option value="">Select a date</option>
              {dateOptions.map(date => (
                <option key={date.value} value={date.value}>
                  {date.label}
                </option>
              ))}
            </select>
            {errors.preferredDate && <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>}
          </div>

          {/* Preferred Time */}
          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time *
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={values.preferredTime}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                errors.preferredTime ? 'border-red-500' : 'border-gray-300'
              } ${isSubmitting ? 'bg-gray-50 opacity-50' : ''}`}
            >
              <option value="">Select a time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.preferredTime && <p className="mt-1 text-sm text-red-600">{errors.preferredTime}</p>}
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
            How soon would you like to view the property?
          </label>
          <select
            id="urgency"
            name="urgency"
            value={values.urgency}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
              isSubmitting ? 'bg-gray-50 opacity-50' : ''
            }`}
          >
            {urgencyLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes or Special Requests
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            rows={4}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
              isSubmitting ? 'bg-gray-50 opacity-50' : ''
            }`}
            placeholder="Any special requirements or questions you'd like to share..."
          />
        </div>

        {/* Hidden Fields */}
        {propertyId && (
          <input type="hidden" name="propertyId" value={propertyId} />
        )}
        {agentId && (
          <input type="hidden" name="agentId" value={agentId} />
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            * Required fields. We typically respond within 2 hours during business hours.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-semibold flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Scheduling...</span>
              </>
            ) : (
              <span>Schedule Viewing</span>
            )}
          </button>
        </div>
      </form>

      {/* Additional Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">What to Expect</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• We'll contact you to confirm your appointment details</li>
            <li>• A confirmation email with property details will be sent</li>
            <li>• Our agent will meet you at the property at the scheduled time</li>
            <li>• Please bring a valid ID for security purposes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;