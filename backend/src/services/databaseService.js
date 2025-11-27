import Property from '../models/Property.js';
import Blog from '../models/Blog.js';
import Contact from '../models/Contact.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// Database Service
export class DatabaseService {
  // Property methods
  static async searchProperties(searchCriteria) {
    try {
      const {
        query,
        type,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        city,
        page = 1,
        limit = 12
      } = searchCriteria;

      const filter = {};

      if (query) {
        filter.$or = [
          { title: new RegExp(query, 'i') },
          { description: new RegExp(query, 'i') },
          { 'location.address': new RegExp(query, 'i') },
          { 'location.city': new RegExp(query, 'i') }
        ];
      }

      if (type) filter.type = type;
      if (city) filter['location.city'] = new RegExp(city, 'i');
      
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseInt(minPrice);
        if (maxPrice) filter.price.$lte = parseInt(maxPrice);
      }
      
      if (bedrooms) filter['specifications.bedrooms'] = { $gte: parseInt(bedrooms) };
      if (bathrooms) filter['specifications.bathrooms'] = { $gte: parseInt(bathrooms) };

      const properties = await Property.find(filter)
        .populate('agent', 'name email phone profile')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await Property.countDocuments(filter);

      return {
        properties,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error searching properties:', error);
      throw new ErrorResponse('Property search failed', 500);
    }
  }

  static async getPropertyStats() {
    try {
      const stats = await Property.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ]);

      const totalProperties = await Property.countDocuments();
      const featuredProperties = await Property.countDocuments({ featured: true });

      return {
        totalProperties,
        featuredProperties,
        byType: stats
      };
    } catch (error) {
      console.error('Error getting property stats:', error);
      throw new ErrorResponse('Failed to get property statistics', 500);
    }
  }

  // Blog methods
  static async getPopularPosts(limit = 5) {
    try {
      const posts = await Blog.find({ status: 'published' })
        .populate('author', 'name email profile')
        .sort({ views: -1 })
        .limit(limit);

      return posts;
    } catch (error) {
      console.error('Error getting popular posts:', error);
      throw new ErrorResponse('Failed to get popular posts', 500);
    }
  }

  static async getPostsByCategory(category, limit = 10) {
    try {
      const posts = await Blog.find({ 
        status: 'published',
        categories: category 
      })
        .populate('author', 'name email profile')
        .sort({ createdAt: -1 })
        .limit(limit);

      return posts;
    } catch (error) {
      console.error('Error getting posts by category:', error);
      throw new ErrorResponse('Failed to get posts by category', 500);
    }
  }

  // Contact methods
  static async getContactStats(timeframe = 'month') {
    try {
      const dateFilter = {};
      const now = new Date();

      if (timeframe === 'week') {
        dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
      } else if (timeframe === 'month') {
        dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
      } else if (timeframe === 'year') {
        dateFilter.$gte = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      const totalContacts = await Contact.countDocuments({
        createdAt: dateFilter
      });

      const contactsByType = await Contact.aggregate([
        { $match: { createdAt: dateFilter } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      const contactsByStatus = await Contact.aggregate([
        { $match: { createdAt: dateFilter } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      return {
        total: totalContacts,
        byType: contactsByType,
        byStatus: contactsByStatus,
        timeframe
      };
    } catch (error) {
      console.error('Error getting contact stats:', error);
      throw new ErrorResponse('Failed to get contact statistics', 500);
    }
  }

  // Appointment methods
  static async getUpcomingAppointments(days = 7) {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const appointments = await Appointment.find({
        date: {
          $gte: startDate,
          $lte: endDate
        },
        status: { $in: ['pending', 'confirmed'] }
      })
        .populate('property', 'title price images location')
        .populate('agent', 'name email phone')
        .sort({ date: 1, time: 1 });

      return appointments;
    } catch (error) {
      console.error('Error getting upcoming appointments:', error);
      throw new ErrorResponse('Failed to get upcoming appointments', 500);
    }
  }

  static async getAppointmentStats(agentId = null) {
    try {
      const matchStage = agentId ? { agent: agentId } : {};

      const stats = await Appointment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalAppointments = await Appointment.countDocuments(matchStage);
      const upcomingAppointments = await Appointment.countDocuments({
        ...matchStage,
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: new Date() }
      });

      return {
        total: totalAppointments,
        upcoming: upcomingAppointments,
        byStatus: stats
      };
    } catch (error) {
      console.error('Error getting appointment stats:', error);
      throw new ErrorResponse('Failed to get appointment statistics', 500);
    }
  }

  // User methods
  static async getAgentStats() {
    try {
      const agents = await User.find({ role: 'agent', isActive: true })
        .select('name email profile createdAt');

      const agentStats = await Promise.all(
        agents.map(async (agent) => {
          const propertyCount = await Property.countDocuments({ agent: agent._id });
          const appointmentCount = await Appointment.countDocuments({ agent: agent._id });

          return {
            agent: {
              _id: agent._id,
              name: agent.name,
              email: agent.email,
              profile: agent.profile
            },
            propertyCount,
            appointmentCount
          };
        })
      );

      return agentStats;
    } catch (error) {
      console.error('Error getting agent stats:', error);
      throw new ErrorResponse('Failed to get agent statistics', 500);
    }
  }

  // Backup methods
  static async createDataBackup() {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        properties: await Property.find().lean(),
        blogs: await Blog.find().lean(),
        contacts: await Contact.find().lean(),
        appointments: await Appointment.find().lean(),
        users: await User.find().select('-password').lean()
      };

      return backup;
    } catch (error) {
      console.error('Error creating data backup:', error);
      throw new ErrorResponse('Failed to create data backup', 500);
    }
  }
}

export default DatabaseService;