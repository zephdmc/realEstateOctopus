import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';

const NewsletterForm = ({ 
  size = 'medium',
  variant = 'default',
  className = "",
  onSubmit: externalOnSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm({
    initialValues: {
      email: '',
      firstName: '',
      preferences: {
        newListings: true,
        priceUpdates: true,
        marketNews: false,
        buyingTips: false,
        sellingTips: false
      }
    },
    validate: (values) => {
      const errors = {};
      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email address';
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
          await submitNewsletterForm(values);
        }
        
        setSubmitStatus({ 
          type: 'success', 
          message: 'Thank you for subscribing! Please check your email to confirm your subscription.' 
        });
        resetForm();
      } catch (error) {
        setSubmitStatus({ 
          type: 'error', 
          message: 'Sorry, there was an error with your subscription. Please try again.' 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const submitNewsletterForm = async (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Newsletter subscription:', formData);
        resolve();
      }, 1000);
    });
  };

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const variantClasses = {
    default: 'bg-white border border-gray-300',
    dark: 'bg-gray-800 border-gray-700',
    minimal: 'bg-transparent border-0'
  };

  const textClasses = {
    default: 'text-gray-900',
    dark: 'text-white',
    minimal: 'text-gray-900'
  };

  const isExpanded = variant === 'default' && size === 'large';

  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${sizeClasses[size]}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-semibold whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        
        {submitStatus && (
          <div className={`mt-2 p-2 rounded text-sm ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 ${variantClasses[variant]} ${className}`}>
      <div className={`mb-4 ${textClasses[variant]}`}>
        <h3 className={`font-bold mb-2 ${size === 'large' ? 'text-2xl' : 'text-xl'}`}>
          Stay Updated
        </h3>
        <p className={`opacity-90 ${sizeClasses[size]}`}>
          Get the latest property listings, market insights, and real estate news delivered to your inbox.
        </p>
      </div>

      {submitStatus && (
        <div className={`p-3 rounded-lg mb-4 ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isExpanded && (
          <div>
            <label htmlFor="firstName" className={`block font-medium mb-2 ${textClasses[variant]}`}>
              First Name (Optional)
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                variant === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your first name"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className={`block font-medium mb-2 ${textClasses[variant]}`}>
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 
              variant === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {isExpanded && (
          <div>
            <label className={`block font-medium mb-3 ${textClasses[variant]}`}>
              Email Preferences
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(values.preferences).map(([key, value]) => (
                <label key={key} className={`flex items-center space-x-3 ${textClasses[variant]}`}>
                  <input
                    type="checkbox"
                    name={`preferences.${key}`}
                    checked={value}
                    onChange={(e) => handleChange({
                      target: {
                        name: `preferences.${key}`,
                        value: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-semibold flex items-center justify-center space-x-2 ${
            size === 'large' ? 'text-lg' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Subscribing...</span>
            </>
          ) : (
            <span>Subscribe to Newsletter</span>
          )}
        </button>

        <p className={`text-xs opacity-75 text-center ${textClasses[variant]}`}>
          By subscribing, you agree to our Privacy Policy and consent to receive 
          updates from our company.
        </p>
      </form>

      {/* Benefits */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className={`font-semibold mb-3 ${textClasses[variant]}`}>What You'll Receive</h4>
          <ul className={`space-y-2 text-sm ${textClasses[variant]} opacity-90`}>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>New property listings matching your criteria</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Exclusive price updates and market trends</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Expert real estate advice and tips</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;