import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { SEND_MESSAGE, INSERT_USER_MESSAGE } from "../graphql";

const MessageInput = ({ chatId, isDisabled = false }) => {
  const [text, setText] = useState("");

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  const handleSend = async () => {
    if (isDisabled || !chatId) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    setText("");

    try {
      // Step 1: Save user message to DB
      await insertUserMessage({
        variables: { chat_id: chatId, content: trimmed },
      });

      // Step 2: Call Hasura Action → n8n → AI
      await sendMessage({
        variables: { chat_id: chatId, content: trimmed },
      });
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <motion.div
      className="flex p-4 border-t border-[#1b263b] bg-[#0d1b2a]"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <input
        className="flex-1 p-3 rounded bg-[#1b263b] text-white placeholder:text-blue-200 outline-none disabled:opacity-50"
        type="text"
        placeholder={
          isDisabled || !chatId
            ? "Setting up your chat..."
            : "Type a message..."
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        disabled={loading || isDisabled || !chatId}
      />
      <button
        onClick={handleSend}
        className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        disabled={loading || isDisabled || !chatId}
      >
        {loading ? "..." : "Send"}
      </button>
    </motion.div>
  );
};

export default MessageInput;
