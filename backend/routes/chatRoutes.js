// routes/chatRoutes.js
import express from 'express';
import { 
  getOrCreateChat, 
  getUserChats, 
  getChatMessages, 
  deleteChat,
  markMessagesAsRead,
  getTotalUnreadCount
} from '../controllers/chatController.js';
import { uploadChatFile } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/fileMiddleware.js';


const router = express.Router();

// Chat routes
router.get('/', authenticateToken, getUserChats);
router.get('/unread/count', authenticateToken, getTotalUnreadCount);
router.get('/:otherUserId', authenticateToken, getOrCreateChat);
router.get('/:chatId/messages', authenticateToken, getChatMessages);
router.post('/:chatId/read', authenticateToken, markMessagesAsRead);
router.delete('/:chatId', authenticateToken, deleteChat);
router.post('/upload', authenticateToken, upload.single('file'), uploadChatFile);

export default router;