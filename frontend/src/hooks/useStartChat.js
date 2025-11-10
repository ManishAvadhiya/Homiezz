// hooks/useStartChat.js
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/userStore";
import { toast } from "react-hot-toast";

export const useStartChat = () => {
  const { getOrCreateChat, openChat, ensureSocketConnected } = useChatStore();
  const { user } = useAuthStore();

  const startChat = async (otherUserId) => {
    if (!user) {
      toast.error("Please login to start a chat");
      return;
    }

    // Ensure socket connected
    const ok = await ensureSocketConnected();
    if (!ok) {
      toast.error("Connecting to chat... please try again in a moment.");
      return;
    }

    try {
      const chat = await getOrCreateChat(otherUserId);
      openChat(chat);
      toast.success("Chat opened!");
    } catch (error) {
      console.error("❌ Error starting chat:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to start chat");
    }
  };

  return { startChat };
};