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
  setIsAiTyping = () => {}, // Function to set AI typing state
}) => {
  const [text, setText] = useState("");

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isDisabled) return;

    setText("");

    try {
      let currentChatId = chatId;

      // If this is a new session and no chat exists, create one
      if (isNewSession && !chatId && onNewChat) {
        currentChatId = await onNewChat(trimmed);
        if (!currentChatId) {
          toast.error("Failed to create new chat");
          setText(trimmed); // Restore text on error
          return;
        }
      }

      if (!currentChatId) {
        toast.error("No chat selected");
        setText(trimmed); // Restore text on error
        return;
      }

      // Step 1: Save user message to DB
      await insertUserMessage({
        variables: { chat_id: currentChatId, content: trimmed },
      });

      // Show AI typing indicator
      setIsAiTyping(true);

      // Step 2: Call Hasura Action → n8n → AI
      await sendMessage({
        variables: { chat_id: currentChatId, content: trimmed },
      });

      // Hide AI typing indicator after response is received
      setIsAiTyping(false);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Something went wrong. Try again.");
      setText(trimmed); // Restore text on error
      setIsAiTyping(false); // Ensure typing indicator is hidden on error
    }
  };

  const inputStyle = isNewSession
    ? "flex gap-2 xs:gap-4 p-0"
    : "flex gap-2 xs:gap-3 p-3 sm:p-6 border-t border-purple-500/20 bg-gradient-to-r from-slate-800/50 to-purple-900/20 backdrop-blur-sm";

  const inputFieldStyle = isNewSession
    ? "flex-1 p-3 sm:p-6 text-base sm:text-lg rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-purple-500/30 text-white placeholder:text-purple-300/60 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 font-mono disabled:opacity-50 shadow-2xl"
    : "flex-1 p-2 sm:p-4 rounded-xl bg-slate-700/50 border border-purple-500/30 text-white placeholder:text-purple-300/60 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 font-mono disabled:opacity-50";

  const buttonStyle = isNewSession
    ? "px-4 sm:px-8 py-3 sm:py-6 text-base sm:text-lg btn-gradient text-white rounded-2xl font-mono font-semibold disabled:opacity-50 shadow-2xl"
    : "px-3 sm:px-6 py-2 sm:py-4 btn-gradient text-white rounded-xl font-mono font-semibold disabled:opacity-50 shadow-lg";

  return (
    <motion.div
      className={inputStyle}
      initial={{ opacity: 0, y: isNewSession ? 30 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isNewSession ? 0.6 : 0.2 }}
    >
      <textarea
        className={inputFieldStyle}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        rows="1"
        disabled={loading || isDisabled}
        autoFocus={isNewSession}
      />
      <motion.button
        onClick={handleSend}
        className={buttonStyle}
        disabled={loading || isDisabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "..." : "Send"}
      </motion.button>
    </motion.div>
  );
};

export default MessageInput;
