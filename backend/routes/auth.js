import express from 'express';
import {
  signup,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getCurrentUser
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

// Protected route - get current user
router.get('/me', authenticateToken, getCurrentUser);

export default router;