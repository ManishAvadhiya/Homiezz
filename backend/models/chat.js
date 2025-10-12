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
  }
}, { timestamps: true });

// Create index for faster queries
ChatSchema.index({ members: 1 });
ChatSchema.index({ 'members': 1, 'updatedAt': -1 });

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;