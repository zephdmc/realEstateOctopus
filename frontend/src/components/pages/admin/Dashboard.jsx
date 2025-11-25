import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    totalBlogs: 0,
    pendingAppointments: 0,
    totalRevenue: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const propertyTypeData = [
    { name: 'House', value: 45 },
    { name: 'Apartment', value: 30 },
    { name: 'Villa', value: 15 },
    { name: 'Commercial', value: 10 }
  ];

  const monthlyData = [
    { month: 'Jan', listings: 12, sales: 8 },
    { month: 'Feb', listings: 19, sales: 11 },
    { month: 'Mar', listings: 15, sales: 9 },
    { month: 'Apr', listings: 22, sales: 14 },
    { month: 'May', listings: 18, sales: 12 },
    { month: 'Jun', listings: 25, sales: 16 }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalProperties: 156,
        activeListings: 89,
        soldProperties: 67,
        totalBlogs: 24,
        pendingAppointments: 8,
        totalRevenue: 2450000
      });

      setRecentActivities([
        { id: 1, type: 'property', action: 'added', title: 'Modern Villa in Beverly Hills', time: '2 hours ago' },
        { id: 2, type: 'blog', action: 'published', title: 'Market Trends 2024', time: '5 hours ago' },
        { id: 3, type: 'appointment', action: 'scheduled', title: 'Property viewing - John Smith', time: '1 day ago' },
        { id: 4, type: 'property', action: 'sold', title: 'Downtown Apartment', time: '2 days ago' }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

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
    <div> {/* REMOVED: min-h-screen bg-gray-50 p-6 */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your real estate business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatCard 
          title="Total Properties" 
          value={stats.totalProperties} 
          icon="🏠"
          color="blue"
        />
        <StatCard 
          title="Active Listings" 
          value={stats.activeListings} 
          icon="📋"
          color="green"
        />
        <StatCard 
          title="Sold Properties" 
          value={stats.soldProperties} 
          icon="✅"
          color="purple"
        />
        <StatCard 
          title="Blog Posts" 
          value={stats.totalBlogs} 
          icon="📝"
          color="orange"
        />
        <StatCard 
          title="Pending Appointments" 
          value={stats.pendingAppointments} 
          icon="📅"
          color="red"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${(stats.totalRevenue / 1000000).toFixed(1)}M`} 
          icon="💰"
          color="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="listings" fill="#3B82F6" name="New Listings" />
              <Bar dataKey="sales" fill="#10B981" name="Properties Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property Types */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Property Types Distribution</h3>
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
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                  <p className="font-medium">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {activity.action} • {activity.time}
                  </p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;