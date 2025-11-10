// controllers/chatController.js

import mongoose from 'mongoose';
import Chat from '../models/chat.js';
import User from '../models/user.js';

// Get or create chat between two users
export const getOrCreateChat = async (req, res) => {
  try {
    const { userId } = req.user;
    const { otherUserId } = req.params;

    // Validate
    if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Find or create chat
    let chat = await Chat.findOne({
      members: { $all: [userId, otherUserId] }
    }).populate('members', 'name avatar');

    if (!chat) {
      chat = new Chat({
        members: [userId, otherUserId],
        messages: [],
        unreadCounts: [],
        lastRead: []
      });
      await chat.save();
      chat = await Chat.findById(chat._id).populate('members', 'name avatar');
    }

    // Add unread count to chat object
    const chatObj = chat.toObject();
    chatObj.unreadCount = chat.getUnreadCount(userId);
    chatObj.canSendMessage = !chat.initiatedBy || 
      chat.initiatedBy.toString() !== userId || 
      chat.receiverResponded;

    res.json({
      success: true,
      chat: chatObj
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat'
    });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.some(m => m.toString() === userId.toString())) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Get unique sender IDs from messages
    const senderIds = [...new Set(chat.messages.map(msg => msg.sender.toString()))];
    
    // Populate sender info for all unique senders
    const senders = await User.find({ _id: { $in: senderIds } }).select('name avatar');
    const senderMap = {};
    senders.forEach(sender => {
      senderMap[sender._id.toString()] = {
        _id: sender._id,
        name: sender.name || 'User',
        avatar: sender.avatar
      };
    });

    // Format messages with sender info
    const formattedMessages = (chat.messages || []).map(msg => {
      const senderId = msg.sender.toString();
      const senderInfo = senderMap[senderId] || {
        _id: msg.sender,
        name: 'User',
        avatar: null
      };
      
      return {
        _id: msg._id,
        sender: senderInfo,
        text: msg.text || '',
        timestamp: msg.timestamp || new Date()
      };
    });

    res.json({
      success: true,
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load messages'
    });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.user;

    const chats = await Chat.find({
      members: { $in: [userId] }
    })
    .populate('members', 'name avatar')
    .sort({ updatedAt: -1 });

    // Add unread counts to each chat
    const chatsWithUnread = chats.map(chat => {
      const chatObj = chat.toObject();
      chatObj.unreadCount = chat.getUnreadCount(userId);
      // Get the other user
      const otherUser = chat.members.find(m => m._id.toString() !== userId);
      chatObj.otherUser = otherUser;
      return chatObj;
    });

    res.json({
      success: true,
      chats: chatsWithUnread || []
    });
  } catch (error) {
    console.error('Chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load chats'
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(userId)) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Update last read and reset unread count
    chat.updateLastRead(userId);
    await chat.save();

    res.json({
      success: true,
      unreadCount: chat.getUnreadCount(userId)
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};

// Get total unread count for user
export const getTotalUnreadCount = async (req, res) => {
  try {
    const { userId } = req.user;

    const chats = await Chat.find({
      members: { $in: [userId] }
    });

    const totalUnread = chats.reduce((total, chat) => {
      return total + chat.getUnreadCount(userId);
    }, 0);

    res.json({
      success: true,
      unreadCount: totalUnread
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

// Delete chat
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is a member of this chat
    if (!chat.members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
export const uploadChatFile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chatId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if chat exists and user is a member
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Determine file type
    let fileType = 'document';
    if (req.file.mimetype.startsWith('image/')) {
      fileType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      fileType = 'video';
    }

    const fileData = {
      url: req.file.path,
      filename: req.file.filename,
      fileType: fileType,
      originalName: req.file.originalname
    };

    res.status(200).json({
      success: true,
      file: fileData
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
};

export default {
  getOrCreateChat,
  getUserChats,
  getChatMessages,
  deleteChat,
  uploadChatFile,
  markMessagesAsRead,
  getTotalUnreadCount
};