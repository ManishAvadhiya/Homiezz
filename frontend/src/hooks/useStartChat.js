// hooks/useStartChat.js
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/userStore";
import { toast } from "react-hot-toast";

export const useStartChat = () => {
  const { getOrCreateChat, openChat } = useChatStore();
  const { user } = useAuthStore();

  const startChat = async (otherUserId) => {
    if (!user) {
      toast.error("Please login to start a chat");
      return;
    }

    try {
      const chat = await getOrCreateChat(otherUserId);
      openChat(chat);
      return chat;
    } catch (error) {
      toast.error("Failed to start chat");
      console.error("Error starting chat:", error);
    }
  };

  return { startChat };
};