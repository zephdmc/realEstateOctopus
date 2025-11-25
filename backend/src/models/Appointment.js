import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  client: {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Client phone is required'],
      trim: true
    }
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  duration: {
    type: Number,
    default: 60, // minutes
    min: 15,
    max: 240
  },
  type: {
    type: String,
    enum: ['viewing', 'valuation', 'consultation', 'signing'],
    default: 'viewing'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes
appointmentSchema.index({ property: 1 });
appointmentSchema.index({ agent: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ 'client.email': 1 });

// Virtual for formatted date and time
appointmentSchema.virtual('formattedDateTime').get(function() {
  return `${this.date.toLocaleDateString()} at ${this.time}`;
});

// Check if appointment is in the past
appointmentSchema.virtual('isPast').get(function() {
  const appointmentDateTime = new Date(`${this.date.toDateString()} ${this.time}`);
  return appointmentDateTime < new Date();
});

// Static method to get conflicting appointments
appointmentSchema.statics.findConflicts = function(agentId, date, time, duration, excludeId = null) {
  const startTime = new Date(`${date.toDateString()} ${time}`);
  const endTime = new Date(startTime.getTime() + duration * 60000);
  
  const query = {
    agent: agentId,
    date: date,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        $and: [
          { time: { $lte: time } },
          { 
            $expr: { 
              $gte: [
                { $dateAdd: { startDate: { $toDate: { $concat: [{ $toString: "$date" }, " ", "$time"] } }, unit: "minute", amount: "$duration" } },
                startTime
              ]
            }
          }
        ]
      },
      {
        $and: [
          { time: { $gte: time } },
          { 
            $expr: { 
              $lte: [
                { $toDate: { $concat: [{ $toString: "$date" }, " ", "$time"] } },
                endTime
              ]
            }
          }
        ]
      }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  return this.find(query);
};

export default mongoose.model('Appointment', appointmentSchema);