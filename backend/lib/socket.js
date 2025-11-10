// lib/socket.js - Simplified
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Chat from '../models/chat.js';
import User from '../models/user.js';
import { sendEmail } from '../utils/emailService.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    }
  });

  const extractTokenFromCookie = (cookieHeader) => {
    if (!cookieHeader) return null;
    try {
      const parts = cookieHeader.split(';').map(p => p.trim());
      for (const part of parts) {
        if (part.startsWith('token=')) {
          return decodeURIComponent(part.split('=')[1]);
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  io.use((socket, next) => {
    // Get token from handshake auth OR cookie
    let token = socket.handshake.auth?.token;
    if (!token) {
      const cookieHeader = socket.handshake.headers?.cookie;
      token = extractTokenFromCookie(cookieHeader);
    }
    if (!token) return next(new Error("Authentication error: No token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on('connection', async (socket) => {
    console.log('✅ User connected:', socket.userId);

    // Automatically join all user's existing chat rooms
    try {
      const userChats = await Chat.find({
        members: { $in: [socket.userId] }
      });
      userChats.forEach(chat => {
        socket.join(chat._id.toString());
        console.log(`User ${socket.userId} auto-joined chat: ${chat._id}`);
      });
    } catch (error) {
      console.error('Error joining user chats:', error);
    }

    // Join all user's chat rooms for direct messaging
    socket.on('join_chat', (chatId) => {
      const chatIdStr = chatId?.toString();
      if (chatIdStr) {
        socket.join(chatIdStr);
        console.log(`User ${socket.userId} joined chat room: ${chatIdStr}`);
      } else {
        console.error('Invalid chatId for join_chat:', chatId);
      }
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        console.log('📨 Received send_message event:', data);
        const { chatId, text } = data;
        if (!chatId || !text || !text.trim()) {
          socket.emit('message_error', { error: 'Chat ID and message text are required' });
          return;
        }

        // Find chat
        const chat = await Chat.findById(chatId).populate('members', 'name email');
        if (!chat) {
          socket.emit('message_error', { error: 'Chat not found' });
          return;
        }

        // Check if user is a member
        const isMember = chat.members.some(m => m._id.toString() === socket.userId);
        if (!isMember) {
          socket.emit('message_error', { error: 'Not a member of this chat' });
          return;
        }

        // Get the other user (receiver)
        const receiver = chat.members.find(m => m._id.toString() !== socket.userId);
        if (!receiver) {
          socket.emit('message_error', { error: 'Receiver not found' });
          return;
        }

        // Check one-message rule: If sender initiated and receiver hasn't responded, check message count
        const isSender = chat.initiatedBy && chat.initiatedBy.toString() === socket.userId;
        if (isSender && !chat.receiverResponded) {
          // Count messages from sender
          const senderMessages = chat.messages.filter(m => m.sender.toString() === socket.userId);
          if (senderMessages.length > 0) {
            socket.emit('message_error', { 
              error: 'You can only send one message until the receiver responds' 
            });
            return;
          }
        }

        // Create new message
        const newMessage = {
          sender: socket.userId,
          text: text.trim(),
          timestamp: new Date()
        };

        // If this is the first message, set initiatedBy
        if (chat.messages.length === 0) {
          chat.initiatedBy = socket.userId;
        }

        // Check if receiver is responding (if they weren't the initiator)
        if (!isSender && chat.initiatedBy && chat.initiatedBy.toString() !== socket.userId) {
          chat.receiverResponded = true;
        }

        // Add message to chat
        chat.messages.push(newMessage);

        // Increment unread count for receiver
        chat.incrementUnreadCount(receiver._id);

        // Send email notification only for the first message
        if (!chat.firstMessageNotified && chat.messages.length === 1) {
          const sender = await User.findById(socket.userId).select('name email');
          if (sender && receiver.email) {
            try {
              const emailSent = await sendEmail({
                to: receiver.email,
                subject: `New Message from ${sender.name} on Homiezz`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Hello ${receiver.name},</h2>
                    <p>You have received a new message from <b>${sender.name}</b> on Homiezz.</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                      <p style="margin: 0;"><b>Message:</b> ${text.trim()}</p>
                    </div>
                    <p>Please login to your Homiezz account to view and respond to this message.</p>
                    <p>Thank you for using Homiezz!</p>
                  </div>
                `
              });
              if (emailSent) {
                console.log('✅ Email notification sent to:', receiver.email);
                chat.firstMessageNotified = true;
              } else {
                console.error('❌ Failed to send email notification');
              }
            } catch (emailError) {
              console.error('❌ Error sending email notification:', emailError);
            }
          } else {
            console.log('⚠️ Email notification skipped - sender or receiver email missing');
          }
        }

        await chat.save();

        // Get the saved message with ID
        const savedMessage = chat.messages[chat.messages.length - 1];
        
        // Populate sender info for the message
        const senderInfo = await User.findById(socket.userId).select('name avatar');
        
        // Emit to all members in the chat room
        const messageData = {
          chatId,
          message: {
            _id: savedMessage._id,
            sender: {
              _id: socket.userId,
              name: senderInfo?.name || 'User',
              avatar: senderInfo?.avatar
            },
            text: savedMessage.text,
            timestamp: savedMessage.timestamp
          }
        };
        
        console.log('📤 Emitting message to chat room:', chatId);
        console.log('Message data:', JSON.stringify(messageData, null, 2));
        
        // Get all sockets in the chat room
        const chatIdStr = chatId.toString();
        const room = io.sockets.adapter.rooms.get(chatIdStr);
        console.log(`Room ${chatIdStr} has ${room ? room.size : 0} sockets`);
        
        // Ensure sender is in the room
        if (!socket.rooms.has(chatIdStr)) {
          socket.join(chatIdStr);
          console.log(`Added sender to room ${chatIdStr}`);
        }
        
        // Emit to all members in the chat room (including sender for immediate feedback)
        io.to(chatIdStr).emit('receive_message', messageData);
        console.log(`✅ Emitted to room ${chatIdStr}`);
        
        // Also emit directly to sender's socket as backup
        socket.emit('receive_message', messageData);
        console.log(`✅ Also emitted directly to sender socket`);

        // Emit unread count update to receiver
        const unreadCount = chat.getUnreadCount(receiver._id);
        const receiverSocketId = Array.from(io.sockets.sockets.values())
          .find(s => s.userId === receiver._id.toString())?.id;
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('unread_count_update', {
            chatId,
            unreadCount
          });
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Handle marking messages as read
    socket.on('mark_as_read', async (data) => {
      try {
        const { chatId } = data;
        if (!chatId) return;

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        // Update last read and reset unread count
        chat.updateLastRead(socket.userId);
        await chat.save();

        // Emit unread count update
        const unreadCount = chat.getUnreadCount(socket.userId);
        socket.emit('unread_count_update', {
          chatId,
          unreadCount
        });
      } catch (error) {
        console.error('Mark as read error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
};