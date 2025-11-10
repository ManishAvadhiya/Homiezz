// models/Chat.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  file: {
    url: String,
    filename: String,
    fileType: String, // 'image', 'document', etc.
    originalName: String
  },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const ChatSchema = new mongoose.Schema({
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }],
  messages: [MessageSchema],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // Track if receiver has responded (allows sender to send more messages)
  receiverResponded: {
    type: Boolean,
    default: false
  },
  // Track who initiated the chat (first sender)
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Track if first message notification was sent
  firstMessageNotified: {
    type: Boolean,
    default: false
  },
  // Track unread message counts per user
  unreadCounts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }],
  // Track last read timestamp per user
  lastRead: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Create index for faster queries
ChatSchema.index({ members: 1 });
ChatSchema.index({ 'members': 1, 'updatedAt': -1 });

// Helper method to get unread count for a user
ChatSchema.methods.getUnreadCount = function(userId) {
  const unreadEntry = this.unreadCounts.find(u => u.userId.toString() === userId.toString());
  return unreadEntry ? unreadEntry.count : 0;
};

// Helper method to increment unread count for a user
ChatSchema.methods.incrementUnreadCount = function(userId) {
  const unreadEntry = this.unreadCounts.find(u => u.userId.toString() === userId.toString());
  if (unreadEntry) {
    unreadEntry.count += 1;
  } else {
    this.unreadCounts.push({ userId, count: 1 });
  }
};

// Helper method to reset unread count for a user
ChatSchema.methods.resetUnreadCount = function(userId) {
  const unreadEntry = this.unreadCounts.find(u => u.userId.toString() === userId.toString());
  if (unreadEntry) {
    unreadEntry.count = 0;
  }
};

// Helper method to update last read timestamp
ChatSchema.methods.updateLastRead = function(userId) {
  const lastReadEntry = this.lastRead.find(l => l.userId.toString() === userId.toString());
  if (lastReadEntry) {
    lastReadEntry.timestamp = new Date();
  } else {
    this.lastRead.push({ userId, timestamp: new Date() });
  }
  // Reset unread count when marking as read
  this.resetUnreadCount(userId);
};

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;