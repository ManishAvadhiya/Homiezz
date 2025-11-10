import mongoose from 'mongoose';

const roommateRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Compound index to ensure one active request between users
roommateRequestSchema.index({ fromUser: 1, toUser: 1, status: 1 });

// Index for faster queries
roommateRequestSchema.index({ fromUser: 1, createdAt: -1 });
roommateRequestSchema.index({ toUser: 1, createdAt: -1 });
roommateRequestSchema.index({ status: 1 });

export default mongoose.model('RoommateRequest', roommateRequestSchema);