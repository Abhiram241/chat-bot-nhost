import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaRobot } from "react-icons/fa";
import { Quantum } from 'ldrs/react';

const MessageList = ({ messages = [], isAiTyping = false }) => {
  const scrollRef = useRef(null);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  useEffect(() => {
    if (scrollRef.current && messages.length > prevMessageCount) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    setPrevMessageCount(messages.length);
  }, [messages, prevMessageCount]);

  return (
    <motion.div
      className="flex-1 p-4 overflow-y-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout // This is crucial for smooth animations
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {msg.role === "assistant" && (
              <FaRobot className="text-purple-400 mt-1 flex-shrink-0 text-lg" />
            )}
            <div
              className={`p-3 rounded-xl max-w-[85%] sm:max-w-[80%] leading-relaxed text-base ${
                msg.role === "user"
                  ? "bg-blue-700 text-white rounded-br-none"
                  : "bg-[#1b263b] text-blue-200 rounded-bl-none"
              }`}
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <FaUser className="text-blue-400 mt-1 flex-shrink-0 text-lg" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {isAiTyping && (
        <motion.div
          className="flex items-start gap-3 justify-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaRobot className="text-purple-400 mt-1 flex-shrink-0 text-lg" />
          <div className="p-3 rounded-xl rounded-bl-none bg-[#1b263b]">
            <Quantum size="25" speed="1.75" color="#a78bfa" />
          </div>
        </motion.div>
      )}
      <div ref={scrollRef} />
    </motion.div>
  );
};

export default MessageList;