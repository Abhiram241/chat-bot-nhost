import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaComments,
  FaTimes,
  FaEdit,
  FaTrash,
  FaCheck,
  FaUndo,
} from "react-icons/fa";
import { Grid } from "ldrs/react";
import { useMutation } from "@apollo/client";
import { UPDATE_CHAT_TITLE, DELETE_CHAT, GET_CHATS } from "../graphql";
import toast from "react-hot-toast";

const ChatList = ({
  chats,
  loading,
  selectedChatId,
  onSelect,
  onNewChat,
  onClose,
  onChatDeleted,
}) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE, {
    refetchQueries: [{ query: GET_CHATS }],
  });
  const [deleteChat] = useMutation(DELETE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }],
  });

  const handleSelect = (id) => {
    onSelect(id);
    if (window.innerWidth < 640) {
      // Close sidebar on mobile after selection
      onClose();
    }
  };

  const handleEditStart = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = async (chatId, e) => {
    e.stopPropagation();
    if (!editTitle.trim()) {
      toast.error("Chat title cannot be empty");
      return;
    }

    try {
      console.log("🔄 Updating chat title:", {
        chatId,
        title: editTitle.trim(),
      });
      const result = await updateChatTitle({
        variables: { chat_id: chatId, title: editTitle.trim() },
      });
      console.log("✅ Chat title updated:", result);
      setEditingChatId(null);
      toast.success("Chat renamed successfully");
    } catch (error) {
      console.error("❌ Error updating chat title:", error);
      toast.error(
        "Failed to rename chat: " + (error.message || "Unknown error")
      );
    }
  };

  const handleEditCancel = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to delete this chat? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      console.log("🗑️ Deleting chat:", chatId);
      const result = await deleteChat({
        variables: { chat_id: chatId },
      });
      console.log("✅ Chat deleted:", result);

      // If the deleted chat was selected, clear selection
      if (chatId === selectedChatId && onChatDeleted) {
        onChatDeleted();
      }

      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting chat:", error);
      toast.error(
        "Failed to delete chat: " + (error.message || "Unknown error")
      );
    }
  };

  return (
    <motion.div
      className="w-full h-full bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm text-white p-3 xs:p-4 sm:p-6 flex flex-col space-y-2 xs:space-y-3 sm:space-y-4 border-r border-purple-500/20"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-2 xs:mb-3 sm:mb-4">
        <h2 className="text-base xs:text-lg sm:text-xl font-mono font-semibold flex items-center gap-1 xs:gap-2 sm:gap-3 gradient-text-purple">
          <FaComments className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" /> My Chats
        </h2>
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
          <motion.button
            onClick={onNewChat}
            title="New Chat"
            className="p-1 xs:p-1.5 sm:p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPlus className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-purple-400 hover:text-purple-300" />
          </motion.button>
          <motion.button
            onClick={onClose}
            title="Close Sidebar"
            className="sm:hidden p-1 xs:p-1.5 sm:p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-purple-400 hover:text-white" />
          </motion.button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 space-y-1 xs:space-y-1.5 sm:space-y-2">
        {loading && (
          <div className="flex flex-col items-center gap-2 xs:gap-2.5 sm:gap-3 py-4 xs:py-6 sm:py-8">
            <Grid size="30" speed="1.5" color="#a855f7" className="sm:h-10 sm:w-10" />
            <p className="text-purple-300 font-mono text-xs xs:text-sm">
              Loading chats...
            </p>
          </div>
        )}
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            className={`group relative p-3 rounded-lg cursor-pointer font-mono transition-all duration-200 ${
              chat.id === selectedChatId
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "bg-slate-700/30 hover:bg-slate-600/50 text-purple-200 hover:text-white border border-purple-500/10 hover:border-purple-500/30"
            }`}
            onClick={() => handleSelect(chat.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {editingChatId === chat.id ? (
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 bg-slate-600/50 text-white text-sm px-2 py-1 rounded border border-purple-500/30 outline-none focus:border-purple-400"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSave(chat.id, e);
                    if (e.key === "Escape") handleEditCancel(e);
                  }}
                />
                <motion.button
                  onClick={(e) => handleEditSave(chat.id, e)}
                  className="p-1 text-green-400 hover:text-green-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaCheck className="w-3 h-3" />
                </motion.button>
                <motion.button
                  onClick={handleEditCancel}
                  className="p-1 text-red-400 hover:text-red-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaUndo className="w-3 h-3" />
                </motion.button>
              </div>
            ) : (
              <>
                <div className="font-medium text-sm truncate pr-16">
                  {chat.title}
                </div>

                {/* Action buttons - show on hover */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={(e) => handleEditStart(chat, e)}
                    className="p-1.5 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 rounded"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Rename chat"
                  >
                    <FaEdit className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    onClick={(e) => handleDelete(chat.id, e)}
                    className="p-1.5 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete chat"
                  >
                    <FaTrash className="w-3 h-3" />
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatList;
