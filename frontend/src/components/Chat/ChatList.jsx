// components/ChatList.jsx
import React, { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ChatList = () => {
  const { chats, setCurrentChat, openChat, loadUserChats, ensureSocketConnected } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadUserChats();
    }
  }, [user, loadUserChats]);

  const handleChatSelect = async (chat) => {
    const ok = await ensureSocketConnected();
    if (!ok) {
      console.warn('Socket not connected yet, retrying shortly...');
    }
    await setCurrentChat(chat);
    openChat(chat);
  };

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet";
    }
    const lastMsg = chat.messages[chat.messages.length - 1];
    return lastMsg.text || "No messages yet";
  };

  const getOtherUser = (chat) => {
    if (!chat.members || !user) return chat.members?.[0] || {};
    return chat.members.find(m => m._id !== user.id) || chat.members[0] || {};
  };

  return (
    <div className="h-full overflow-y-auto">
      {chats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No conversations yet</p>
          <p className="text-sm">Start a chat with someone!</p>
        </div>
      ) : (
        <div className="space-y-1 p-2">
          {chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const unreadCount = chat.unreadCount || 0;
            return (
              <div
                key={chat._id}
                className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors ${
                  unreadCount > 0 ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={otherUser.avatar} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {otherUser.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {otherUser.name || "Unknown User"}
                    </h3>
                    {chat.updatedAt && (
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {new Date(chat.updatedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    {getLastMessage(chat)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatList;