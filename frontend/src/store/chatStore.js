// store/chatStore.js
import { create } from "zustand";
import axios from "../lib/axios";
import { io } from "socket.io-client";

export const useChatStore = create((set, get) => ({
  // State
  chats: [],
  currentChat: null,
  messages: [],
  onlineUsers: new Set(),
  isChatOpen: false,
  loading: false,
  socket: null,
  hasMoreMessages: false,
  currentPage: 1,

  // Actions
  initializeSocket: (token) => {
    const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:3000", {
      auth: {
        token: token
      }
    });

    socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    socket.on("receive_message", (data) => {
      const { currentChat, messages } = get();
      if (currentChat && currentChat._id === data.chatId) {
        set({
          messages: [...messages, data.message]
        });
      }
      // Refresh chats list to show latest message
      get().loadUserChats();
    });

    socket.on("chat_updated", (data) => {
      get().loadUserChats();
    });

    socket.on("user_typing", (data) => {
      // Handle typing indicators
      const { currentChat } = get();
      if (currentChat && currentChat._id === data.chatId) {
        // You can implement typing indicators here
        console.log(`User ${data.userId} is ${data.isTyping ? 'typing' : 'not typing'}`);
      }
    });

    socket.on("online_users", (users) => {
      set({ onlineUsers: new Set(users) });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  loadUserChats: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/chat");
      set({ 
        chats: response.data.chats,
        loading: false 
      });
    } catch (error) {
      console.error("Error loading chats:", error);
      set({ loading: false });
    }
  },

  getOrCreateChat: async (otherUserId) => {
    try {
      const response = await axios.get(`/chat/${otherUserId}`);
      set({ 
        currentChat: response.data.chat,
        messages: [],
        currentPage: 1
      });
      get().loadChatMessages(response.data.chat._id);
      return response.data.chat;
    } catch (error) {
      console.error("Error creating/getting chat:", error);
      throw error;
    }
  },

  loadChatMessages: async (chatId, page = 1) => {
    try {
      const response = await axios.get(`/chat/${chatId}/messages?page=${page}&limit=50`);
      set({ 
        messages: page === 1 ? response.data.messages : [...response.data.messages, ...get().messages],
        hasMoreMessages: response.data.hasMore,
        currentPage: page
      });
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  },

  sendMessage: async (chatId, text, file = null) => {
    const { socket, messages } = get();
    if (!socket) return;

    const messageData = {
      chatId,
      text,
      file
    };

    socket.emit("send_message", messageData);
  },

  sendTypingStart: (chatId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("typing_start", { chatId });
    }
  },

  sendTypingStop: (chatId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("typing_stop", { chatId });
    }
  },

  uploadFile: async (file, chatId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chatId", chatId);

      const response = await axios.post("/chat/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.file;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  openChat: (chat = null) => {
    set({ isChatOpen: true, currentChat: chat });
  },

  closeChat: () => {
    set({ isChatOpen: false, currentChat: null, messages: [] });
  },

  setCurrentChat: (chat) => {
    set({ currentChat: chat, messages: [] });
    if (chat) {
      get().loadChatMessages(chat._id);
    }
  },

  isUserOnline: (userId) => {
    const { onlineUsers } = get();
    return onlineUsers.has(userId);
  }
}));