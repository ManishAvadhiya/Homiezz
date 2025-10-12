// routes/chatRoutes.js
import express from 'express';
import { 
  getOrCreateChat, 
  getUserChats, 
  getChatMessages, 
  deleteChat 
} from '../controllers/chatController.js';
import { uploadChatFile } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/fileMiddleware.js';


const router = express.Router();

// Chat routes
router.get('/', authenticateToken, getUserChats);
router.get('/:otherUserId', authenticateToken, getOrCreateChat);
router.get('/:chatId/messages', authenticateToken, getChatMessages);
router.delete('/:chatId', authenticateToken, deleteChat);
router.post('/upload', authenticateToken, upload.single('file'), uploadChatFile);

export default router;