import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { WideContainer, SplitContainer } from '../../components/layout/PageContainer';
import { 
  FaHandshake, 
  FaLightbulb, 
  FaHeart, 
  FaChartLine,
  FaAward,
  FaUsers,
  FaHome,
  FaCalendarAlt,
  FaRocket,
  FaPhone,
  FaSearch
} from 'react-icons/fa';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      experience: '15+ years',
      specialty: 'Luxury Properties',
      image: '/images/team/sarah.jpg',
      bio: 'Sarah founded Octopus Real Estate with a vision to revolutionize real estate services through technology and personalized care.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Sales',
      experience: '12+ years',
      specialty: 'Commercial Real Estate',
      image: '/images/team/michael.jpg',
      bio: 'Michael leads our sales team with expertise in commercial properties and investment opportunities.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Senior Agent',
      experience: '8+ years',
      specialty: 'First-time Buyers',
      image: '/images/team/emily.jpg',
      bio: 'Emily specializes in helping first-time home buyers navigate the complex process of purchasing their dream home.'
    },
    {
      name: 'David Thompson',
      role: 'Property Manager',
      experience: '10+ years',
      specialty: 'Rental Properties',
      image: '/images/team/david.jpg',
      bio: 'David manages our extensive portfolio of rental properties, ensuring optimal returns for investors.'
    }
  ];

  const milestones = [
    { year: '2008', event: 'Company Founded', description: 'Started with a single office in Port Harcourt' },
    { year: '2012', event: '1000+ Properties', description: 'Reached milestone of 1000 properties sold' },
    { year: '2015', event: 'National Expansion', description: 'Expanded to major cities across the US' },
    { year: '2018', event: 'Tech Platform Launch', description: 'Launched our proprietary real estate platform' },
    { year: '2022', event: '5000+ Clients', description: 'Helped over 5000 clients find their perfect homes' },
    { year: '2024', event: 'Award Winning', description: 'Recognized as top real estate agency nationally' }
  ];

  const values = [
    {
      icon: <FaHandshake className="w-10 h-10" />,
      title: 'Trust & Integrity',
      description: 'We build relationships based on honesty and transparency in every transaction.'
    },
    {
      icon: <FaChartLine className="w-10 h-10" />,
      title: 'Expert Guidance',
      description: 'Our experienced agents provide expert advice tailored to your unique needs.'
    },
    {
      icon: <FaLightbulb className="w-10 h-10" />,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to simplify the real estate process.'
    },
    {
      icon: <FaHeart className="w-10 h-10" />,
      title: 'Client First',
      description: 'Your goals and satisfaction are at the center of everything we do.'
    }
  ];

  return (
    <MainLayout>
      <WideContainer>
        {/* Hero Section */}
        <section className="relative py-8 overflow-hidden">
  {/* Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    {/* Animated Blue Lines */}
    <div className="absolute top-1/4 left-10 w-1 h-32 bg-blue-500/30 animate-pulse"></div>
    <div className="absolute bottom-1/3 right-20 w-1 h-24 bg-blue-400/40 animate-bounce"></div>
    <div className="absolute top-1/2 left-1/4 w-1 h-16 bg-blue-300/50 animate-ping"></div>
    
    {/* Floating Dots */}
    <div className="absolute top-10 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
    <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-75"></div>
    <div className="absolute top-40 right-40 w-4 h-4 bg-blue-500/60 rounded-full animate-ping delay-150"></div>
    
    {/* Gradient Orbs */}
    <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-xl opacity-60"></div>
    <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full blur-xl opacity-40"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 text-center mb-16 max-w-4xl mx-auto px-4">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
      About Octopus Real Estate
    </h1>
    <div className="relative inline-block mb-8">
      <div className="absolute -inset-4 bg-blue-50 rounded-lg transform rotate-3 animate-pulse"></div>
      <p className="relative text-xl text-gray-600 leading-relaxed bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-blue-100 shadow-sm">
        For over 15 years, Octopus Real Estate has been transforming the real estate experience 
        through innovation, expertise, and unwavering commitment to our clients' success.
      </p>
    </div>
    
    {/* Icon Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
      {[
        { icon: "🏠", label: "Residential" },
        { icon: "🏢", label: "Commercial" },
        { icon: "🌆", label: "Urban" },
        { icon: "🏡", label: "Luxury" }
      ].map((item, index) => (
        <div 
          key={index}
          className="flex flex-col items-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <span className="text-2xl mb-2">{item.icon}</span>
          <span className="text-sm font-medium text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* Story Section */}
        <section className="mb-8">
          <SplitContainer>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2008, Octopus Real Estate began as a small real estate agency with a big vision: 
                  to make property buying and selling simpler, smarter, and more transparent.
                </p>
                <p>
                  What started as a single office in New York has grown into a nationwide network 
                  of expert agents, serving thousands of clients across the United States.
                </p>
                <p>
                  Today, we combine deep market knowledge with cutting-edge technology to deliver 
                  exceptional results for buyers, sellers, and investors alike.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/images/about-story.jpg"
                alt="Our office team"
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
          </SplitContainer>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 text-center group">
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white border border-blue-200 mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300 mx-auto">
                  <div className="text-blue-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to your real estate success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100 group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-4 h-4 text-blue-500" />
                      <span>Experience: {member.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaHome className="w-4 h-4 text-blue-500" />
                      <span>Specialty: {member.specialty}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Milestones that mark our growth and success
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-200 to-blue-300 h-full"></div>
            
            {/* Milestones */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
                      <div className="text-blue-600 font-bold text-lg mb-2 flex items-center space-x-2 justify-end">
                        <FaAward className="w-5 h-5" />
                        <span>{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                      <p className="text-gray-700">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Spacer */}
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-12 text-center text-white shadow-xl">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-10 rounded-2xl mb-6">
              <FaUsers className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of satisfied clients who have found their perfect property with Octopus Real Estate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <FaRocket className="w-5 h-5" />
                <span>Get in Touch</span>
              </a>
              <a
                href="/properties"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <FaSearch className="w-5 h-5" />
                <span>Browse Properties</span>
              </a>
            </div>
          </div>
        </section>
      </WideContainer>
    </MainLayout>
  );
};

export default About;