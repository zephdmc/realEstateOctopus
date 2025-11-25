import Contact from '../models/Contact.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { sendEmail } from '../services/emailService.js';

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    type,
    priority
  } = req.query;

  // Build filter object
  const filter = {};

  if (status) filter.status = status;
  if (type) filter.type = type;
  if (priority) filter.priority = priority;

  // Execute query with pagination
  const messages = await Contact.find(filter)
    .populate('assignedTo', 'name email')
    .populate('property', 'title price')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  // Get total count for pagination
  const total = await Contact.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: messages.length,
    total,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    },
    data: messages
  });
});

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('property', 'title price images')
    .populate('notes.createdBy', 'name email');

  if (!message) {
    throw new ErrorResponse('Contact message not found', 404);
  }

  res.status(200).json({
    success: true,
    data: message
  });
});

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
export const createContactMessage = asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);

  // Send confirmation email to user
  try {
    await sendEmail({
      to: contact.email,
      subject: 'Thank you for contacting EliteProperties',
      template: 'contact-confirmation',
      context: {
        name: contact.name,
        subject: contact.subject
      }
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }

  // Send notification to admin
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message: ${contact.subject}`,
      template: 'contact-notification',
      context: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message
      }
    });
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }

  res.status(201).json({
    success: true,
    data: contact,
    message: 'Thank you for your message. We will get back to you soon.'
  });
});

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContactMessage = asyncHandler(async (req, res) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ErrorResponse('Contact message not found', 404);
  }

  contact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .populate('assignedTo', 'name email')
    .populate('property', 'title price');

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Add note to contact message
// @route   POST /api/contact/:id/notes
// @access  Private/Admin
export const addNote = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ErrorResponse('Note content is required', 400);
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ErrorResponse('Contact message not found', 404);
  }

  contact.notes.push({
    content,
    createdBy: req.user.id
  });

  await contact.save();

  await contact.populate('notes.createdBy', 'name email');

  res.status(201).json({
    success: true,
    data: contact.notes
  });
});

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Private/Admin
export const getContactStats = asyncHandler(async (req, res) => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await Contact.countDocuments();
  const newMessages = await Contact.countDocuments({ status: 'new' });

  res.status(200).json({
    success: true,
    data: {
      total,
      new: newMessages,
      byStatus: stats
    }
  });
});