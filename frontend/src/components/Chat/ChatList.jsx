import React, { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/userStore";
import { motion } from "framer-motion";
import { MessageCircle, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const ChatList = () => {
  const {
    chats,
    loading,
    loadUserChats,
    setCurrentChat,
    openChat,
    isUserOnline
  } = useChatStore();
  
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    loadUserChats();
  }, [loadUserChats]);

  const getOtherUser = (chat) => {
    if (!user) return null;
    return chat.members.find(member => member._id !== user.id);
  };

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet";
    }
    
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage.file) {
      return `Sent a ${lastMessage.file.fileType}`;
    }
    return lastMessage.text || "Media message";
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = getOtherUser(chat);
    return otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    openChat(chat);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-orange-500" />
          Messages
        </h2>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a chat with someone!</p>
            </div>
          ) : (
            filteredChats.map((chat, index) => {
              const otherUser = getOtherUser(chat);
              const lastMessage = getLastMessage(chat);
              const isOnline = isUserOnline(otherUser?._id);

              return (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors mb-2"
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {otherUser?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherUser?.name || "Unknown User"}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTime(chat.updatedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;
