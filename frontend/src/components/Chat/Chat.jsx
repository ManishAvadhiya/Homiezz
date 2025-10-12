// components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
  Paperclip, 
  Smile, 
  Image as ImageIcon,
  FileText,
  Video,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const Chat = () => {
  const { 
    isChatOpen, 
    closeChat, 
    currentChat, 
    messages, 
    sendMessage, 
    uploadFile,
    sendTypingStart,
    sendTypingStop,
    isUserOnline
  } = useChatStore();
  
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    await sendMessage(currentChat._id, newMessage.trim());
    setNewMessage("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentChat) return;

    setIsUploading(true);
    try {
      const uploadedFile = await uploadFile(file, currentChat._id);
      await sendMessage(currentChat._id, "", uploadedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (currentChat) {
      if (e.target.value.trim()) {
        sendTypingStart(currentChat._id);
      } else {
        sendTypingStop(currentChat._id);
      }
    }
  };

  const getOtherUser = () => {
    if (!currentChat || !user) return null;
    return currentChat.members.find(member => member._id !== user.id);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const otherUser = getOtherUser();

  // Animation variants
  const chatVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const mobileChatVariants = {
    closed: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:z-40"
            onClick={closeChat}
          />
          
          {/* Chat Panel */}
          <motion.div
            variants={isMobile ? mobileChatVariants : chatVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`fixed z-50 bg-white shadow-2xl border-l border-gray-200 ${
              isMobile 
                ? "inset-0 rounded-none" 
                : "top-0 right-0 h-full w-full md:w-1/3 lg:w-96"
            }`}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center space-x-3">
                {otherUser && (
                  <>
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {otherUser.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      {isUserOnline(otherUser._id) && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {otherUser.name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isUserOnline(otherUser._id) ? "Online" : "Offline"}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChat}
                className="hover:bg-orange-200 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="h-[calc(100%-8rem)] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id || message.timestamp}
                    className={`flex ${
                      message.sender._id === user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${
                        message.sender._id === user?.id
                          ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {message.file ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            {getFileIcon(message.file.fileType)}
                            <span className="font-medium truncate">
                              {message.file.originalName}
                            </span>
                          </div>
                          {message.file.fileType === 'image' && (
                            <img
                              src={message.file.url}
                              alt={message.file.originalName}
                              className="rounded-lg max-w-full h-auto"
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 text-xs ${
                              message.sender._id === user?.id
                                ? "text-white hover:text-white hover:bg-orange-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                            onClick={() => window.open(message.file.url, '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.sender._id === user?.id
                            ? "text-orange-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-shrink-0 hover:bg-orange-50 border-orange-200"
                >
                  {isUploading ? (
                    <div className="h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Paperclip className="h-4 w-4" />
                  )}
                </Button>
                
                <Input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1 border-orange-200 focus:border-orange-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim() || isUploading}
                  className="bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Chat;