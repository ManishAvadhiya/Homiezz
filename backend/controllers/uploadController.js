// controllers/uploadController.js
import Chat from '../models/chat.js';

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