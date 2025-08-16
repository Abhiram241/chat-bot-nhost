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
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null); // State for two-step delete

  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE, {
    refetchQueries: [{ query: GET_CHATS }],
  });
  const [deleteChat] = useMutation(DELETE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }],
  });

  const handleSelect = (id) => {
    onSelect(id);
    if (window.innerWidth < 640) {
      onClose();
    }
  };

  const handleEditStart = (chat, e) => {
    e.stopPropagation();
    setConfirmingDeleteId(null); // Close confirm dialog if open
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
      await updateChatTitle({
        variables: { chat_id: chatId, title: editTitle.trim() },
      });
      setEditingChatId(null);
      toast.success("Chat renamed successfully");
    } catch (error) {
      toast.error("Failed to rename chat: " + (error.message || "Unknown error"));
    }
  };

  const handleEditCancel = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleDeleteStart = (chatId, e) => {
    e.stopPropagation();
    setEditingChatId(null); // Close edit input if open
    setConfirmingDeleteId(chatId);
  };

  const handleDeleteConfirm = async (chatId, e) => {
    e.stopPropagation();
    try {
      await deleteChat({ variables: { chat_id: chatId } });
      if (chatId === selectedChatId && onChatDeleted) {
        onChatDeleted();
      }
      toast.success("Chat deleted successfully");
      setConfirmingDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete chat: " + (error.message || "Unknown error"));
    }
  };

  const handleDeleteCancel = (e) => {
    e.stopPropagation();
    setConfirmingDeleteId(null);
  };

  return (
    <motion.div
      className="w-full h-full bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm text-white p-4 sm:p-6 flex flex-col space-y-4 border-r border-purple-500/20"
      initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-mono font-semibold flex items-center gap-3 gradient-text-purple">
          <FaComments className="w-5 h-5" /> My Chats
        </h2>
        <div className="flex items-center gap-2">
          <motion.button onClick={onNewChat} title="New Chat" className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FaPlus className="w-4 h-4 text-purple-400" />
          </motion.button>
          <motion.button onClick={onClose} title="Close Sidebar" className="sm:hidden p-2 rounded-lg hover:bg-slate-700/50" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FaTimes className="w-4 h-4 text-purple-400" />
          </motion.button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 space-y-2">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Grid size="40" speed="1.5" color="#a855f7" />
            <p className="text-purple-300 font-mono text-sm">Loading chats...</p>
          </div>
        )}
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.div
              key={chat.id} layout
              className={`group relative p-4 sm:p-3 rounded-lg cursor-pointer font-mono transition-colors duration-200 ${
                chat.id === selectedChatId
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-slate-700/30 hover:bg-slate-600/50 text-purple-200 hover:text-white"
              }`}
              onClick={() => handleSelect(chat.id)}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {editingChatId === chat.id ? (
                // EDITING VIEW
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-1 bg-slate-600 text-white text-base sm:text-sm px-3 py-2 rounded" autoFocus onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(chat.id, e); if (e.key === "Escape") handleEditCancel(e); }} />
                  <motion.button onClick={(e) => handleEditSave(chat.id, e)} className="p-2 text-green-400" whileHover={{ scale: 1.1 }}><FaCheck className="w-4 h-4" /></motion.button>
                  <motion.button onClick={handleEditCancel} className="p-2 text-red-400" whileHover={{ scale: 1.1 }}><FaUndo className="w-4 h-4" /></motion.button>
                </div>
              ) : confirmingDeleteId === chat.id ? (
                // CONFIRM DELETE VIEW
                <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <span className="text-red-300 text-sm font-semibold">Delete?</span>
                  <div className="flex gap-2">
                    <motion.button onClick={(e) => handleDeleteConfirm(chat.id, e)} className="px-3 py-1 bg-red-500/80 rounded text-white" whileHover={{ scale: 1.1 }}>Yes</motion.button>
                    <motion.button onClick={handleDeleteCancel} className="px-3 py-1 bg-slate-600 rounded text-white" whileHover={{ scale: 1.1 }}>No</motion.button>
                  </div>
                </div>
              ) : (
                // DEFAULT VIEW
                <>
                  <div className="font-medium text-base sm:text-sm truncate pr-16">{chat.title}</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button onClick={(e) => handleEditStart(chat, e)} className="p-2 text-purple-300 hover:bg-purple-500/20 rounded" whileHover={{ scale: 1.1 }} title="Rename"><FaEdit className="w-4 h-4" /></motion.button>
                    <motion.button onClick={(e) => handleDeleteStart(chat.id, e)} className="p-2 text-red-300 hover:bg-red-500/20 rounded" whileHover={{ scale: 1.1 }} title="Delete"><FaTrash className="w-4 h-4" /></motion.button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatList;