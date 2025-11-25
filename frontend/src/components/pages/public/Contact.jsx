import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { WideContainer, SplitContainer } from '../../components/layout/PageContainer';
import ContactForm from '../../components/forms/ContactForm';

const Contact = () => {
  const officeLocations = [
    {
      city: 'New York',
      address: '123 Broadway, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'ny@estatepro.com',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
    },
    {
      city: 'Los Angeles',
      address: '456 Sunset Blvd, Los Angeles, CA 90001',
      phone: '+1 (555) 234-5678',
      email: 'la@estatepro.com',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
    },
    {
      city: 'Chicago',
      address: '789 Michigan Ave, Chicago, IL 60601',
      phone: '+1 (555) 345-6789',
      email: 'chicago@estatepro.com',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
    }
  ];

  const contactMethods = [
    {
      icon: '📞',
      title: 'Call Us',
      description: 'Speak directly with our agents',
      details: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      description: 'Send us a message anytime',
      details: 'info@estatepro.com',
      action: 'mailto:info@estatepro.com'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Instant help during business hours',
      details: 'Start chatting',
      action: '#chat'
    },
    {
      icon: '📅',
      title: 'Schedule Meeting',
      description: 'Book a consultation',
      details: 'Book now',
      action: '/appointment'
    }
  ];

  return (
    <MainLayout>
      <WideContainer>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with our expert real estate agents. We're here to help you with all your property needs.
          </p>
        </div>

        <SplitContainer gap={12}>
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              {/* Contact Methods */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.action}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{method.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {method.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                          <p className="text-blue-600 font-semibold mt-2">{method.details}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Office Locations */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Our Offices</h3>
                <div className="space-y-4">
                  {officeLocations.map((office, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 text-lg mb-3">{office.city} Office</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center space-x-2">
                          <span>📍</span>
                          <span>{office.address}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                          <span>📞</span>
                          <span>{office.phone}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                          <span>✉️</span>
                          <span>{office.email}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                          <span>🕒</span>
                          <span>{office.hours}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Answers</h3>
                <div className="space-y-4">
                  {[
                    {
                      question: 'How quickly do you respond to inquiries?',
                      answer: 'We typically respond within 2 hours during business hours.'
                    },
                    {
                      question: 'Do you offer virtual property tours?',
                      answer: 'Yes, we provide virtual tours for all our listed properties.'
                    },
                    {
                      question: 'What areas do you serve?',
                      answer: 'We serve major metropolitan areas across the United States.'
                    }
                  ].map((faq, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SplitContainer>
      </WideContainer>
    </MainLayout>
  );
};

export default Contact;