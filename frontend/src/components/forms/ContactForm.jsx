import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';

const ContactForm = ({ 
  propertyId = null,
  propertyTitle = null,
  agentId = null,
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
      subject: propertyTitle ? `Inquiry about ${propertyTitle}` : '',
      message: '',
      propertyId: propertyId || '',
      agentId: agentId || '',
      type: 'general'
    },
    validate: (values) => {
      const errors = {};
      if (!values.name.trim()) errors.name = 'Name is required';
      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!values.message.trim()) errors.message = 'Message is required';
      if (values.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(values.phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        if (externalOnSubmit) {
          await externalOnSubmit(values);
        } else {
          await submitWithEmailJS(values);
        }
        
        setSubmitStatus({ 
          type: 'success', 
          message: 'Thank you! Your message has been sent successfully. We will get back to you soon.' 
        });
        resetForm();
      } catch (error) {
        setSubmitStatus({ 
          type: 'error', 
          message: error.message || 'Sorry, there was an error sending your message. Please try again.' 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const submitWithEmailJS = async (formData) => {
    // Dynamic import to avoid SSR issues
    const emailjs = await import('emailjs-com');
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
      inquiry_type: formData.type,
      property_id: formData.propertyId || 'N/A',
      agent_id: formData.agentId || 'N/A',
      submitted_at: new Date().toLocaleString(),
      to_email: process.env.REACT_APP_ADMIN_EMAIL || 'admin@yourdomain.com'
    };

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error('EmailJS error:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  };

  // Fallback method if EmailJS fails
  const submitWithFormspree = async (formData) => {
    const response = await fetch('https://formspree.io/f/your-form-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        type: formData.type,
        propertyId: formData.propertyId,
        agentId: formData.agentId,
        _replyto: formData.email,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'viewing', label: 'Schedule a Viewing' },
    { value: 'valuation', label: 'Property Valuation' },
    { value: 'mortgage', label: 'Mortgage Information' }
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {propertyTitle ? `Contact About ${propertyTitle}` : 'Contact Us'}
        </h3>
        <p className="text-gray-600">
          {propertyTitle 
            ? 'Interested in this property? Send us a message and we\'ll get back to you soon.'
            : 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'
          }
        </p>
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
              Phone Number
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

          {/* Inquiry Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Inquiry Type
            </label>
            <select
              id="type"
              name="type"
              value={values.type}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                isSubmitting ? 'bg-gray-50 opacity-50' : ''
              }`}
            >
              {inquiryTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={values.subject}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
              isSubmitting ? 'bg-gray-50 opacity-50' : ''
            }`}
            placeholder="Enter the subject of your message"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            rows={6}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            } ${isSubmitting ? 'bg-gray-50 opacity-50' : ''}`}
            placeholder="Enter your message..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
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
            * Required fields
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-semibold flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <span>Send Message</span>
            )}
          </button>
        </div>
      </form>

      {/* Contact Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Call Us</p>
              <p className="text-gray-600">+234 913 208 0059</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Email Us</p>
              <p className="text-gray-600">info@Octopusrealestate.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Office Hours</p>
              <p className="text-gray-600">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;