// server.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";

import authRoutes from "./routes/authRoutes.js";
import roomsRoutes from "./routes/roomsRoute.js";
import chatRoutes from "./routes/chatRoutes.js"; // Add this line
import roommateRoutes from './routes/roommates.js';
import { 
  updateRoommateProfile, 
  getRoommateProfile, 
  toggleRoommateProfile 
} from './controllers/roommateController.js';
import { authenticateToken } from "./middleware/authMiddleware.js";
import { initializeSocket } from "./lib/socket.js"; // Add this line

dotenv.config();

const app = express();
const server = createServer(app); // Create HTTP server

// Initialize Socket.io
const io = initializeSocket(server);

// CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/chat", chatRoutes); // Add this line
app.put('/api/user/roommate-profile', authenticateToken, updateRoommateProfile);
app.get('/api/user/roommate-profile', authenticateToken, getRoommateProfile);
app.patch('/api/user/roommate-profile/active', authenticateToken, toggleRoommateProfile);
app.use('/api/roommates', roommateRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the backend server");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { // Use server.listen instead of app.listen
  console.log(`Server is running on port ${PORT}`);
  connectDB();
})