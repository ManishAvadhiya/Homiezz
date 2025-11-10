// store/chatStore.js
import { create } from "zustand";
import axios from "../lib/axios";
import { io } from "socket.io-client";
import { useAuthStore } from "./userStore";
import { toast } from "react-hot-toast";

const computeCanSend = (chat) => {
  const userId = useAuthStore.getState().user?.id;
  if (!chat) return true;
  const rawInitiator = chat.initiatedBy;
  let initiatorId = rawInitiator;
  if (rawInitiator && typeof rawInitiator === "object") {
    if (rawInitiator._id) initiatorId = rawInitiator._id;
  }
  initiatorId = initiatorId?.toString?.() ?? initiatorId;
  const userIdStr = userId?.toString?.() ?? userId;
  if (!initiatorId || !userIdStr) return true;
  if (initiatorId === userIdStr) {
    return Boolean(chat.receiverResponded);
  }
  return true;
};

export const useChatStore = create((set, get) => ({
  // State
  chats: [],
  currentChat: null,
  messages: [],
  isChatOpen: false,
  loading: false,
  socket: null,
  totalUnreadCount: 0,
  canSendMessage: true,

  // Initialize Socket
  initializeSocket: (token) => {
    const { socket: existingSocket } = get();
    if (existingSocket && existingSocket.connected) {
      return existingSocket;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    let backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      backendUrl = apiUrl.includes('/api') ? apiUrl.replace('/api', '') : apiUrl.replace(/\/$/, '');
    }
    if (!backendUrl || backendUrl === apiUrl) backendUrl = "http://localhost:3000";

    const socket = io(backendUrl, {
      auth: token ? { token } : undefined,
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      set({ socket });
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Disconnected from chat server:", reason);
    });

    socket.on("receive_message", (data) => {
      console.log('📨 Received message event:', data);
      
      if (!data || !data.message || !data.chatId) {
        console.error('Invalid message data received:', data);
        return;
      }
      
      const { currentChat, messages, chats } = get();
      const user = useAuthStore.getState().user;
      
      if (!user) {
        console.error('No user found in store');
        return;
      }
      
      const isOwnMessage = data.message.sender?._id === user?.id || 
                          data.message.sender?._id?.toString() === user?.id?.toString();
      
      const currentChatId = currentChat?._id?.toString();
      const receivedChatId = data.chatId?.toString();
      
      if (currentChat && currentChatId === receivedChatId) {
        const messageExists = messages.some(m => 
          m._id === data.message._id || 
          (m.isSending && m.text === data.message.text && isOwnMessage)
        );
        
        if (!messageExists) {
          const filteredMessages = isOwnMessage 
            ? messages.filter(m => !(m.isSending && m.text === data.message.text))
            : messages;
          set({ messages: [...filteredMessages, data.message] });
        }
        
        get().markAsRead(data.chatId);
        
        if (!isOwnMessage) {
          const updatedCurrentChat = { ...currentChat, receiverResponded: true };
          set({ 
            currentChat: updatedCurrentChat,
            canSendMessage: computeCanSend(updatedCurrentChat)
          });
        } else {
          set({ canSendMessage: computeCanSend(currentChat) });
        }
      }
      
      const updatedChats = chats.map(chat => {
        const chatIdStr = chat._id?.toString();
        if (chatIdStr === receivedChatId) {
          const updatedChat = {
            ...chat,
            messages: [...(chat.messages || []), data.message],
            unreadCount: chat._id === currentChat?._id ? 0 : (chat.unreadCount || 0) + 1
          };
          if (!isOwnMessage) {
            updatedChat.receiverResponded = true;
          }
          return updatedChat;
        }
        return chat;
      });
      set({ chats: updatedChats });
      get().updateTotalUnreadCount();
    });

    socket.on("message_error", (data) => {
      console.error("❌ Message error from server:", data);
      if (data && data.error) toast.error(data.error);
    });

    socket.on("unread_count_update", (data) => {
      const { chats } = get();
      const receivedChatId = data?.chatId?.toString();
      const updatedChats = chats.map(chat => {
        const chatIdStr = chat._id?.toString();
        if (chatIdStr === receivedChatId) {
          return { ...chat, unreadCount: data.unreadCount || 0 };
        }
        return chat;
      });
      set({ chats: updatedChats });
      get().updateTotalUnreadCount();
    });

    set({ socket });
    return socket;
  },

  // Ensure socket is connected, try to init if not
  ensureSocketConnected: async () => {
    let { socket } = get();
    if (socket?.connected) return true;

    const tokenFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    const tokenFromLocal = window.localStorage.getItem("token");
    const token = tokenFromCookie || tokenFromLocal || undefined;

    socket = get().initializeSocket(token);

    const connected = await new Promise((resolve) => {
      if (socket.connected) return resolve(true);
      const onConnect = () => {
        socket.off("connect", onConnect);
        resolve(true);
      };
      const timeout = setTimeout(() => {
        socket.off("connect", onConnect);
        resolve(socket.connected);
      }, 2500);
      socket.on("connect", onConnect);
    });

    return !!connected;
  },

  // Disconnect Socket
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // Get or create chat
  getOrCreateChat: async (otherUserId) => {
    try {
      console.log('🔍 Getting or creating chat with user:', otherUserId);
      const response = await axios.get(`/chat/${otherUserId}`);
      
      if (!response.data || !response.data.chat) {
        throw new Error('Invalid response from server');
      }
      
      const chat = response.data.chat;
      console.log('✅ Chat created/found:', chat._id);
      
      // Join the chat room FIRST before loading messages
      const { socket } = get();
      if (!socket || !socket.connected) {
        console.error('❌ Socket not connected');
        throw new Error('Socket not connected. Please refresh the page.');
      }
      
      if (chat?._id) {
        const chatIdStr = chat._id.toString();
        console.log('🚪 Joining chat room:', chatIdStr);
        socket.emit("join_chat", chatIdStr);
        // Wait a bit for the join to complete
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Set chat state
      set({ 
        currentChat: chat,
        messages: [],
        isChatOpen: true,
        canSendMessage: computeCanSend(chat)
      });
      
      // Load existing messages
      console.log('📥 Loading messages for chat:', chat._id);
      await get().loadChatMessages(chat._id);
      
      // Mark as read
      await get().markAsRead(chat._id);
      
      return chat;
    } catch (error) {
      console.error('❌ Error creating chat:', error);
      throw error;
    }
  },

  // Load chat messages
  loadChatMessages: async (chatId) => {
    try {
      console.log('📥 Loading messages for chat:', chatId);
      const response = await axios.get(`/chat/${chatId}/messages`);
      const loadedMessages = response.data.messages || [];
      console.log('Loaded messages:', loadedMessages.length);
      set({ messages: loadedMessages });
      return loadedMessages;
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      set({ messages: [] });
      return [];
    }
  },

  // Send message
  sendMessage: async (chatId, text) => {
    const { socket, messages, currentChat, canSendMessage } = get();
    
    if (!socket) {
      throw new Error('Socket not connected. Please refresh the page.');
    }
    
    if (!socket.connected) {
      throw new Error('Socket not connected. Please wait a moment and try again.');
    }
    
    if (!text.trim()) {
      throw new Error('Message cannot be empty');
    }

    // Check if user can send message (one-message rule)
    if (!canSendMessage && currentChat?._id === chatId) {
      throw new Error('You can only send one message until the receiver responds');
    }

    const messageData = {
      chatId,
      text: text.trim()
    };

    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          socket.off('message_error', errorHandler);
          socket.off('receive_message', successHandler);
          resolved = true;
          reject(new Error('Message send timeout. Please try again.'));
        }
      }, 10000); // 10 second timeout

      // Listen for error
      const errorHandler = (data) => {
        if (data && data.error && !resolved) {
          clearTimeout(timeout);
          socket.off('message_error', errorHandler);
          socket.off('receive_message', successHandler);
          resolved = true;
          reject(new Error(data.error));
        }
      };
      socket.on('message_error', errorHandler);

      // Optimistically add message to UI first
      const user = useAuthStore.getState().user;
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        _id: tempId,
        sender: { 
          _id: user?.id,
          name: user?.name || 'You',
          avatar: user?.avatar
        },
        text: text.trim(),
        timestamp: new Date(),
        isSending: true
      };

      const currentMessages = get().messages || [];
      set({ 
        messages: [...currentMessages, tempMessage]
      });

      // Listen for success (message received)
      const successHandler = (data) => {
        const receivedChatId = data?.chatId?.toString();
        const targetChatId = chatId?.toString();
        
        if (data && receivedChatId === targetChatId && !resolved) {
          clearTimeout(timeout);
          socket.off('receive_message', successHandler);
          socket.off('message_error', errorHandler);
          resolved = true;
          
          const { messages: currentMessages, currentChat: latestChat } = get();
          const filteredMessages = currentMessages.filter(m => m._id !== tempId);
          const exists = filteredMessages.some(m => m._id === data.message._id);
          const nextMessages = exists ? filteredMessages : [...filteredMessages, data.message];
          set({ 
            messages: nextMessages,
            canSendMessage: computeCanSend(latestChat)
          });
          
          resolve(data.message);
        }
      };
      socket.on('receive_message', successHandler);

      console.log('📤 Sending message via socket:', messageData, 'Socket connected:', socket.connected);
      socket.emit("send_message", messageData);
    });
  },

  // Open chat
  openChat: (chat = null) => {
    console.log('Opening chat:', chat?._id);
    set({ 
      isChatOpen: true, 
      currentChat: chat,
      messages: chat ? get().messages : [],
      canSendMessage: computeCanSend(chat)
    });
  },

  // Close chat
  closeChat: () => {
    set({ isChatOpen: false, currentChat: null, messages: [] });
  },

  // Load user chats
  loadUserChats: async () => {
    try {
      const response = await axios.get("/chat");
      set({ chats: response.data.chats || [] });
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  },

  // Set current chat
  setCurrentChat: async (chat) => {
    set({ currentChat: chat, messages: [], canSendMessage: computeCanSend(chat) });
    if (chat) {
      const ok = await get().ensureSocketConnected();
      const { socket } = get();
      if (ok && socket && chat._id) {
        const chatIdStr = chat._id.toString();
        console.log('Joining chat room:', chatIdStr);
        socket.emit("join_chat", chatIdStr);
        await new Promise(resolve => setTimeout(resolve, 200));
      } else if (!socket) {
        console.warn('Socket not available when trying to join chat');
      }
      await get().loadChatMessages(chat._id);
      await get().markAsRead(chat._id);
      const { currentChat: latestChat } = get();
      set({ canSendMessage: computeCanSend(latestChat) });
    }
  },

  // Mark messages as read
  markAsRead: async (chatId) => {
    try {
      const { socket } = get();
      if (socket && chatId) {
        socket.emit("mark_as_read", { chatId });
      }
      // Also call API
      await axios.post(`/chat/${chatId}/read`);
      // Update local state
      const { chats, currentChat } = get();
      const updatedChats = chats.map(chat => {
        if (chat._id === chatId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      });
      set({ chats: updatedChats });
      if (currentChat?._id === chatId) {
        set({ currentChat: { ...currentChat, unreadCount: 0 } });
      }
      get().updateTotalUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  },

  // Update total unread count
  updateTotalUnreadCount: async () => {
    try {
      const response = await axios.get('/chat/unread/count');
      set({ totalUnreadCount: response.data.unreadCount || 0 });
    } catch (error) {
      console.error('Error updating unread count:', error);
      // Calculate from local chats as fallback
      const { chats } = get();
      const user = useAuthStore.getState().user;
      const total = chats.reduce((sum, chat) => {
        return sum + (chat.unreadCount || 0);
      }, 0);
      set({ totalUnreadCount: total });
    }
  },

  // Load user chats with unread counts
  loadUserChats: async () => {
    try {
      const response = await axios.get("/chat");
      set({ chats: response.data.chats || [] });
      get().updateTotalUnreadCount();
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  }
}));