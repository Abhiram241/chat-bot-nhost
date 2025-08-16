import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { SEND_MESSAGE, INSERT_USER_MESSAGE } from "../graphql";

const MessageInput = ({
  chatId,
  isDisabled = false,
  onNewChat = null,
  isNewSession = false,
  placeholder = "Type your message...",
  setIsAiTyping = () => {},
}) => {
  const [text, setText] = useState("");
  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isDisabled || loading) return;

    setText(""); // Clear input immediately for better UX

    try {
      let currentChatId = chatId;

      if (isNewSession && !chatId && onNewChat) {
        currentChatId = await onNewChat(trimmed);
        if (!currentChatId) {
          toast.error("Failed to start new chat");
          setText(trimmed); // Restore text on failure
          return;
        }
      }

      if (!currentChatId) {
        toast.error("No active chat session");
        setText(trimmed);
        return;
      }

      await insertUserMessage({
        variables: { chat_id: currentChatId, content: trimmed },
      });

      setIsAiTyping(true);
      await sendMessage({
        variables: { chat_id: currentChatId, content: trimmed },
      });
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
      setText(trimmed);
    } finally {
      setIsAiTyping(false);
    }
  };

  const containerStyle = isNewSession ? "p-0" : "p-3 sm:p-4 border-t border-purple-500/20 bg-gradient-to-r from-slate-800/50 to-purple-900/20";
  const inputStyle = isNewSession ? "p-4 text-lg rounded-2xl bg-slate-800/60 shadow-2xl" : "p-3 text-base rounded-xl";
  const buttonStyle = isNewSession ? "px-6 py-4 text-lg rounded-2xl shadow-2xl" : "px-4 py-3 text-base";

  return (
    <motion.div
      className={`flex gap-3 ${containerStyle}`}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: isNewSession ? 0.5 : 0 }}
    >
      <textarea
        className={`flex-1 bg-slate-700/50 border border-purple-500/30 text-white placeholder:text-purple-300/60 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 font-mono disabled:opacity-50 transition-all ${inputStyle}`}
        placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        rows="1" disabled={loading || isDisabled} autoFocus={isNewSession}
      />
      <motion.button
        onClick={handleSend}
        className={`btn-gradient text-white rounded-xl font-mono font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${buttonStyle}`}
        disabled={loading || isDisabled || !text.trim()} // Bug fix: use trim() here
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      >
        {loading ? "..." : "Send"}
      </motion.button>
    </motion.div>
  );
};

export default MessageInput;