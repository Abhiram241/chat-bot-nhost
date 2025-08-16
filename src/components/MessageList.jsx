import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaRobot } from "react-icons/fa";
import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

const MessageList = ({ messages = [], isAiTyping = false }) => {
  const scrollRef = useRef(null);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && messages.length > previousMessageCount) {
      // Only scroll if new messages were added
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setPreviousMessageCount(messages.length);
  }, [messages, previousMessageCount]);

  return (
    <motion.div
      className="flex-1 p-2 xs:p-3 sm:p-4 overflow-y-auto space-y-2 xs:space-y-3 sm:space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      {messages.map((msg, index) => {
        const isNewMessage = index >= previousMessageCount - 1;
        return (
          <motion.div
            key={msg.id}
            className={`flex items-start gap-1 xs:gap-2 sm:gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
            initial={
              isNewMessage ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: isNewMessage ? 0.3 : 0,
              delay: isNewMessage ? 0.1 : 0,
            }}
          >
            {msg.role === "assistant" && (
              <FaRobot className="text-purple-400 mt-1 flex-shrink-0 text-xs xs:text-sm sm:text-base" />
            )}
            <div
              className={`p-1.5 xs:p-2 sm:p-3 rounded-lg max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] md:max-w-2xl leading-relaxed text-xs xs:text-sm sm:text-base ${
                msg.role === "user"
                  ? "bg-blue-700 text-white"
                  : "bg-[#1b263b] text-blue-200"
              }`}
              style={{
                whiteSpace: "pre-wrap", // ✅ keeps \n and \n\n
                wordBreak: "break-word", // ✅ wraps very long words/URLs
              }}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <FaUser className="text-blue-400 mt-1 flex-shrink-0 text-sm sm:text-base" />
            )}
          </motion.div>
        );
      })}

      {/* AI typing indicator */}
      {isAiTyping && (
        <motion.div
          className="flex items-start gap-1 xs:gap-2 sm:gap-3 justify-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaRobot className="text-purple-400 mt-1 flex-shrink-0 text-xs xs:text-sm sm:text-base" />
          <div className="p-1.5 xs:p-2 sm:p-3 rounded-lg bg-[#1b263b] text-blue-200 flex items-center">
            <Quantum 
              size="25" 
              speed="1.75" 
              color="#a78bfa" 
            />
          </div>
        </motion.div>
      )}

      {/* Auto-scroll target */}
      <div ref={scrollRef} />
    </motion.div>
  );
};

export default MessageList;
