// components/ChatListPanel.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatList from "./ChatList";

const ChatListPanel = ({ isOpen, onClose }) => {
  const isMobile = window.innerWidth < 768;

  const panelVariants = {
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

  const mobilePanelVariants = {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            variants={isMobile ? mobilePanelVariants : panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`fixed z-50 bg-white shadow-2xl border-l border-gray-200 ${
              isMobile 
                ? "inset-0 rounded-none" 
                : "top-0 right-0 h-full w-120"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-orange-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat List */}
            <div className="h-full">
              <ChatList />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatListPanel;