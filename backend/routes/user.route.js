import express from 'express'
import { login, logout, profile, register } from '../controllers/user.controller.js';
import passport from 'passport';
import { generateToken } from '../tools/auth.tools.js';
import dotenv from "dotenv"
import { verifyToken } from '../middlewares/auth.js';
dotenv.config();
const router = express.Router()

router.post("/login",login);
router.post("/register",register); // Assuming register uses the same controller for now
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false, // Disable session for stateless authentication
  prompt: 'select_account'
}));

router.get('/google/callback', 
  passport.authenticate('google',{failureRedirect: '/login',
    session: false }),
  (req, res) => {

    const token = generateToken(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.redirect(`${process.env.FRONTEND_URL}/`);

  }
);
router.post("/logout",logout)
router.get("/profile",verifyToken, profile)
export const userRouter = router;