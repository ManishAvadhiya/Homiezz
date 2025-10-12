// lib/socket.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Chat from '../models/chat.js';
import User from '../models/user.js';

const connectedUsers = new Map();

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    }
  });

  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    // Add user to connected users map
    connectedUsers.set(socket.userId, socket.id);

    // Join user to their personal room
    socket.join(socket.userId);

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { chatId, text, file } = data;
        
        // Find chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Check if user is a member of the chat
        if (!chat.members.includes(socket.userId)) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Create new message
        const newMessage = {
          sender: socket.userId,
          text,
          file,
          timestamp: new Date()
        };

        // Add message to chat
        chat.messages.push(newMessage);
        chat.lastMessage = chat.messages[chat.messages.length - 1]._id;
        await chat.save();

        // Populate the message for sending
        const populatedChat = await Chat.findById(chatId)
          .populate('messages.sender', 'name email avatar')
          .populate('members', 'name email avatar');

        const message = populatedChat.messages[populatedChat.messages.length - 1];

        // Send message to all members of the chat
        chat.members.forEach(memberId => {
          const memberSocketId = connectedUsers.get(memberId.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit('receive_message', {
              chatId,
              message
            });
          }
          
          // Also emit to user's personal room for real-time updates
          io.to(memberId.toString()).emit('chat_updated', {
            chatId,
            lastMessage: message
          });
        });

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
      connectedUsers.delete(socket.userId);
    });
  });

  return io;
};