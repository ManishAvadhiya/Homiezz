// components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
  Paperclip,
  Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";

const Chat = () => {
  const { 
    isChatOpen, 
    closeChat, 
    currentChat, 
    messages, 
    sendMessage,
    canSendMessage,
    socket
  } = useChatStore();
  
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) {
      setError("Please enter a message");
      return;
    }
    
    if (!canSendMessage) {
      setError("You can only send one message until the receiver responds");
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX
    setError(""); // Clear any previous errors
    
    try {
      await sendMessage(currentChat._id, messageText);
      toast.success('Message sent!');
    } catch (err) {
      const errorMsg = err.message || "Failed to send message";
      setError(errorMsg);
      toast.error(errorMsg);
      setNewMessage(messageText);
    }
  };

  const getOtherUser = () => {
    if (!currentChat || !user) return null;
    return currentChat.members.find(member => member._id !== user.id);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const otherUser = getOtherUser();

  // Update canSendMessage when receiver responds
  useEffect(() => {
    if (currentChat && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const isOwn = lastMessage.sender?._id === user?.id || 
                    lastMessage.sender?._id?.toString() === user?.id?.toString();
      if (!isOwn) {
        useChatStore.setState({ canSendMessage: true });
      }
    }
  }, [messages, currentChat, user]);

  const chatVariants = {
    closed: { x: "100%", transition: { duration: 0.28 }},
    open: { x: 0, transition: { duration: 0.28 }}
  };

  const isMobile = window.innerWidth < 768;

  if (!isChatOpen) return null;

  // Build date separators
  const renderMessages = () => {
    const blocks = [];
    let lastDateKey = null;
    messages.forEach((message, index) => {
      const date = new Date(message.timestamp);
      const dateKey = date.toDateString();
      if (dateKey !== lastDateKey) {
        blocks.push(
          <div key={`sep-${dateKey}`} className="flex items-center justify-center my-3">
            <span className="text-xs text-gray-500 bg-white/80 border border-gray-200 rounded-full px-3 py-1 shadow-sm">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        );
        lastDateKey = dateKey;
      }

      const isOwn = message.sender?._id === user?.id || message.sender?._id?.toString() === user?.id?.toString();
      const prev = messages[index - 1];
      const isGrouped = prev && (prev.sender?._id === message.sender?._id);

      blocks.push(
        <div
          key={message._id || `msg-${index}`}
          className={`flex items-end ${isOwn ? "justify-end" : "justify-start"} mb-1`}
        >
          {!isOwn && !isGrouped && (
            <Avatar className="h-8 w-8 mr-2 shadow-sm">
              <AvatarImage src={message.sender?.avatar || otherUser?.avatar} />
              <AvatarFallback className="bg-blue-500 text-white text-xs">
                {(message.sender?.name || otherUser?.name)?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
          <div className={`max-w-[75%] md:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
            <div
              className={`${
                isOwn
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              } rounded-2xl px-4 py-2 shadow ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.text}
              </p>
            </div>
            <span className={`mt-1 text-[10px] ${isOwn ? 'text-gray-200' : 'text-gray-500'} px-1`}>
              {formatTime(message.timestamp)}
              {message.isSending ? ' • Sending…' : ''}
            </span>
          </div>
          {isOwn && (
            <div className="w-8" />
          )}
        </div>
      );
    });
    blocks.push(<div key="end" ref={messagesEndRef} />);
    return blocks;
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closeChat}
      />
      
      {/* Chat Panel */}
      <motion.div
        variants={chatVariants}
        initial="closed"
        animate="open"
        exit="closed"
        className={`fixed z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-2xl ${
          isMobile 
            ? "inset-0" 
            : "top-4 right-4 bottom-4 w-[420px] rounded-2xl border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            {otherUser && (
              <>
                <Avatar className="h-10 w-10 ring-2 ring-white shadow">
                  <AvatarImage src={otherUser.avatar} />
                  <AvatarFallback className="bg-emerald-500 text-white">
                    {otherUser.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {otherUser.name || "User"}
                  </h3>
                  <p className="text-xs text-emerald-600">Secure chat • End-to-end</p>
                </div>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeChat}
            className="hover:bg-emerald-100 rounded-full"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="absolute inset-x-0 top-[68px] bottom-[84px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
          {!currentChat ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-sm">No chat selected</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {renderMessages()}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white rounded-b-2xl">
          {!socket || !socket.connected ? (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              Not connected. Please refresh.
            </div>
          ) : null}
          {error && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              {error}
            </div>
          )}
          {!canSendMessage && (
            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
              Waiting for response. You can send more messages once the receiver responds.
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-500 hover:text-emerald-600"
              disabled={!canSendMessage || !socket || !socket.connected}
              aria-label="Attach"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={canSendMessage ? "Type a message..." : "Waiting for response..."}
                className="w-full h-10 px-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
                disabled={!canSendMessage || !socket || !socket.connected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim() || !canSendMessage || !socket || !socket.connected}
              className="h-10 w-10 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow text-white disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default Chat;