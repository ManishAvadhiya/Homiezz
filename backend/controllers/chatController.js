// controllers/chatController.js

import Chat from '../models/chat.js';
import User from '../models/user.js';

// Get or create chat between two users
export const getOrCreateChat = async (req, res) => {
  try {
    const { userId } = req.user;
    const { otherUserId } = req.params;

    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: 'Other user ID is required'
      });
    }

    // Check if users exist
    const [user, otherUser] = await Promise.all([
      User.findById(userId),
      User.findById(otherUserId)
    ]);

    if (!user || !otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find existing chat between the two users
    let chat = await Chat.findOne({
      members: { $all: [userId, otherUserId] }
    }).populate('members', 'name email avatar')
      .populate('lastMessage');

    // If chat doesn't exist, create a new one
    if (!chat) {
      chat = new Chat({
        members: [userId, otherUserId],
        messages: []
      });
      await chat.save();
      
      // Populate the newly created chat
      chat = await Chat.findById(chat._id)
        .populate('members', 'name email avatar')
        .populate('lastMessage');
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get or create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.user;

    const chats = await Chat.find({
      members: { $in: [userId] }
    })
    .populate('members', 'name email avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get chat messages
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId)
      .populate('members', 'name email avatar')
      .populate('messages.sender', 'name email avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is a member of this chat
    const { userId } = req.user;
    if (!chat.members.some(member => member._id.toString() === userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Paginate messages (newest first)
    const messages = chat.messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      hasMore: chat.messages.length > page * limit
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
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
  uploadChatFile
};