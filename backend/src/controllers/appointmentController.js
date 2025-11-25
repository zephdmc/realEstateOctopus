import Appointment from '../models/Appointment.js';
import Property from '../models/Property.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { sendEmail } from '../services/emailService.js';

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    type,
    agent,
    startDate,
    endDate
  } = req.query;

  // Build filter object
  const filter = {};

  if (status) filter.status = status;
  if (type) filter.type = type;
  if (agent) filter.agent = agent;
  
  // Date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // If user is not admin, only show their appointments
  if (req.user.role !== 'admin') {
    filter.$or = [
      { agent: req.user.id },
      { 'client.email': req.user.email }
    ];
  }

  // Execute query with pagination
  const appointments = await Appointment.find(filter)
    .populate('property', 'title price images location')
    .populate('agent', 'name email phone profile')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ date: 1, time: 1 });

  // Get total count for pagination
  const total = await Appointment.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: appointments.length,
    total,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    },
    data: appointments
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('property', 'title price images location specifications')
    .populate('agent', 'name email phone profile bio');

  if (!appointment) {
    throw new ErrorResponse('Appointment not found', 404);
  }

  // Check if user is authorized to view this appointment
  if (req.user.role !== 'admin' && 
      appointment.agent._id.toString() !== req.user.id && 
      appointment.client.email !== req.user.email) {
    throw new ErrorResponse('Not authorized to view this appointment', 403);
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = asyncHandler(async (req, res) => {
  const { propertyId, date, time, duration = 60, ...appointmentData } = req.body;

  // Verify property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ErrorResponse('Property not found', 404);
  }

  // Use property's agent if not specified
  if (!appointmentData.agent) {
    appointmentData.agent = property.agent;
  }

  // Check for scheduling conflicts
  const appointmentDate = new Date(date);
  const conflicts = await Appointment.findConflicts(
    appointmentData.agent,
    appointmentDate,
    time,
    duration
  );

  if (conflicts.length > 0) {
    throw new ErrorResponse('Time slot is not available. Please choose a different time.', 409);
  }

  const appointment = await Appointment.create({
    property: propertyId,
    date: appointmentDate,
    time,
    duration,
    ...appointmentData
  });

  await appointment.populate('property', 'title price images location');
  await appointment.populate('agent', 'name email phone');

  // Send confirmation emails
  try {
    // Send to client
    await sendEmail({
      to: appointment.client.email,
      subject: 'Appointment Confirmation - EliteProperties',
      template: 'appointment-confirmation-client',
      context: {
        clientName: appointment.client.name,
        propertyTitle: appointment.property.title,
        date: appointment.formattedDateTime,
        agentName: appointment.agent.name,
        agentPhone: appointment.agent.phone
      }
    });

    // Send to agent
    await sendEmail({
      to: appointment.agent.email,
      subject: 'New Appointment Scheduled',
      template: 'appointment-notification-agent',
      context: {
        agentName: appointment.agent.name,
        clientName: appointment.client.name,
        clientEmail: appointment.client.email,
        clientPhone: appointment.client.phone,
        propertyTitle: appointment.property.title,
        date: appointment.formattedDateTime
      }
    });
  } catch (error) {
    console.error('Failed to send appointment emails:', error);
  }

  res.status(201).json({
    success: true,
    data: appointment,
    message: 'Appointment scheduled successfully. Confirmation emails have been sent.'
  });
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ErrorResponse('Appointment not found', 404);
  }

  // Check authorization
  if (req.user.role !== 'admin' && appointment.agent.toString() !== req.user.id) {
    throw new ErrorResponse('Not authorized to update this appointment', 403);
  }

  // Check for conflicts if time is being changed
  if (req.body.date || req.body.time || req.body.duration) {
    const newDate = new Date(req.body.date || appointment.date);
    const newTime = req.body.time || appointment.time;
    const newDuration = req.body.duration || appointment.duration;

    const conflicts = await Appointment.findConflicts(
      appointment.agent,
      newDate,
      newTime,
      newDuration,
      appointment._id
    );

    if (conflicts.length > 0) {
      throw new ErrorResponse('Time slot is not available. Please choose a different time.', 409);
    }
  }

  appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .populate('property', 'title price images location')
    .populate('agent', 'name email phone');

  res.status(200).json({
    success: true,
    data: appointment
  });
});

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ErrorResponse('Appointment not found', 404);
  }

  // Check authorization
  if (req.user.role !== 'admin' && 
      appointment.agent.toString() !== req.user.id && 
      appointment.client.email !== req.user.email) {
    throw new ErrorResponse('Not authorized to cancel this appointment', 403);
  }

  if (appointment.status === 'cancelled') {
    throw new ErrorResponse('Appointment is already cancelled', 400);
  }

  appointment.status = 'cancelled';
  appointment.cancellationReason = reason;
  await appointment.save();

  // Send cancellation emails
  try {
    await sendEmail({
      to: appointment.client.email,
      subject: 'Appointment Cancelled - EliteProperties',
      template: 'appointment-cancellation',
      context: {
        clientName: appointment.client.name,
        propertyTitle: appointment.property.title,
        date: appointment.formattedDateTime,
        reason: reason || 'No reason provided'
      }
    });
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
  }

  res.status(200).json({
    success: true,
    message: 'Appointment cancelled successfully'
  });
});

// @desc    Get available time slots for an agent
// @route   GET /api/appointments/availability/:agentId
// @access  Public
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const { date } = req.query;

  if (!date) {
    throw new ErrorResponse('Date is required', 400);
  }

  const targetDate = new Date(date);
  const appointments = await Appointment.find({
    agent: agentId,
    date: targetDate,
    status: { $in: ['pending', 'confirmed'] }
  });

  // Generate available time slots (9 AM to 5 PM, 1-hour slots)
  const availableSlots = [];
  const startHour = 9;
  const endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    
    const isAvailable = !appointments.some(apt => 
      apt.time === time
    );

    if (isAvailable) {
      availableSlots.push(time);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      date: targetDate.toISOString().split('T')[0],
      availableSlots
    }
  });
});