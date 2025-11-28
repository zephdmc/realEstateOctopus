import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { propertiesAPI } from '../../services/api';
import { blogAPI } from '../../services/api';
// Remove appointmentsAPI import since it doesn't exist

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    rentedProperties: 0,
    totalBlogs: 0,
    pendingAppointments: 0,
    totalRevenue: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch properties data
        const propertiesResponse = await propertiesAPI.getMyProperties();
        const properties = propertiesResponse?.data?.data || propertiesResponse?.data || [];
        
        // Fetch blogs data (if available)
        let blogs = [];
        try {
          const blogsResponse = await blogAPI.getMyBlogs?.() || { data: [] };
          blogs = blogsResponse?.data || [];
        } catch (error) {
          console.log('Blog API not available, using empty data');
        }
        
        // Mock appointments data since appointmentsAPI doesn't exist
        const appointments = [];

        // Calculate statistics
        const totalProperties = properties.length;
        const activeListings = properties.filter(p => p.status === 'for-sale' || p.status === 'for-rent').length;
        const soldProperties = properties.filter(p => p.status === 'sold').length;
        const rentedProperties = properties.filter(p => p.status === 'rented').length;
        const totalBlogs = blogs.length;
        const pendingAppointments = 0; // Set to 0 since we don't have appointments API
        
        // Calculate total revenue (sum of sold properties prices)
        const totalRevenue = properties
          .filter(p => p.status === 'sold' || p.status === 'rented')
          .reduce((sum, property) => sum + (property.price || 0), 0);

        // Calculate property type distribution
        const typeDistribution = properties.reduce((acc, property) => {
          const type = property.type || 'other';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const propertyTypeData = Object.entries(typeDistribution).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        }));

        // Calculate monthly data (last 6 months)
        const monthlyData = calculateMonthlyData(properties);

        // Generate recent activities
        const recentActivities = generateRecentActivities(properties, blogs, appointments);

        setStats({
          totalProperties,
          activeListings,
          soldProperties,
          rentedProperties,
          totalBlogs,
          pendingAppointments,
          totalRevenue
        });

        setPropertyTypeData(propertyTypeData);
        setMonthlyData(monthlyData);
        setRecentActivities(recentActivities);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate monthly performance data
  const calculateMonthlyData = (properties) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      const year = new Date().getFullYear() - (currentMonth - 5 + index < 0 ? 1 : 0);
      
      // This is a simplified calculation - you might want to use actual created dates
      const monthlyProperties = properties.filter(property => {
        if (!property.createdAt) return false;
        const createdDate = new Date(property.createdAt);
        return createdDate.getMonth() === monthIndex && createdDate.getFullYear() === year;
      });

      const listings = monthlyProperties.length;
      const sales = monthlyProperties.filter(p => p.status === 'sold' || p.status === 'rented').length;

      return {
        month,
        listings,
        sales
      };
    });
  };

  // Generate recent activities from real data
  const generateRecentActivities = (properties, blogs, appointments) => {
    const activities = [];

    // Add recent property activities
    properties.slice(0, 3).forEach(property => {
      activities.push({
        id: property._id,
        type: 'property',
        action: property.status === 'sold' || property.status === 'rented' ? 'sold' : 'listed',
        title: property.title,
        time: formatTimeAgo(property.createdAt || property.updatedAt),
        link: `/admin/properties`
      });
    });

    // Add recent blog activities (if blogs exist)
    blogs.slice(0, 2).forEach(blog => {
      activities.push({
        id: blog._id,
        type: 'blog',
        action: 'published',
        title: blog.title,
        time: formatTimeAgo(blog.createdAt),
        link: '/admin/blog'
      });
    });

    // Add sample appointment activities (since we don't have real appointments)
    if (activities.length < 5) {
      activities.push({
        id: 'sample-appointment-1',
        type: 'appointment',
        action: 'scheduled',
        title: 'Property viewing scheduled',
        time: '2 days ago',
        link: '/admin/appointments'
      });
    }

    // Sort by time (newest first) and take top 5
    return activities
      .sort((a, b) => {
        // For sample data, just maintain order
        if (a.id.includes('sample') || b.id.includes('sample')) return 0;
        return new Date(b.time) - new Date(a.time);
      })
      .slice(0, 5);
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your real estate business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-8">
        <StatCard 
          title="Total Properties" 
          value={stats.totalProperties} 
          icon="🏠"
          color="blue"
          description="All properties in your portfolio"
        />
        <StatCard 
          title="Active Listings" 
          value={stats.activeListings} 
          icon="📋"
          color="green"
          description="Available for sale/rent"
        />
        <StatCard 
          title="Sold Properties" 
          value={stats.soldProperties} 
          icon="✅"
          color="purple"
          description="Successfully sold"
        />
        <StatCard 
          title="Rented Properties" 
          value={stats.rentedProperties} 
          icon="🔑"
          color="orange"
          description="Currently rented out"
        />
        <StatCard 
          title="Blog Posts" 
          value={stats.totalBlogs} 
          icon="📝"
          color="indigo"
          description="Published articles"
        />
        <StatCard 
          title="Pending Appointments" 
          value={stats.pendingAppointments} 
          icon="📅"
          color="red"
          description="Awaiting confirmation"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon="💰"
          color="emerald"
          description="From sales and rentals"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="listings" fill="#3B82F6" name="New Listings" />
                <Bar dataKey="sales" fill="#10B981" name="Properties Sold/Rented" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available for monthly performance
            </div>
          )}
        </div>

        {/* Property Types */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Property Types Distribution ({propertyTypeData.reduce((sum, item) => sum + item.value, 0)})
          </h3>
          {propertyTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No property type data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'property' ? 'bg-blue-100' :
                    activity.type === 'blog' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <span className="text-lg">
                      {activity.type === 'property' ? '🏠' : 
                       activity.type === 'blog' ? '📝' : '📅'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {activity.action} • {activity.time}
                    </p>
                  </div>
                </div>
                <a 
                  href={activity.link}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activities found
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, description }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;