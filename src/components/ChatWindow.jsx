import React, { useEffect, useRef, useState } from "react";
import { useSubscription } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaRobot, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MESSAGE_SUB } from "../graphql";

const ChatWindow = ({ chatId }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { data, loading } = useSubscription(MESSAGE_SUB, {
    variables: { chatId },
    skip: !chatId,
  });

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-white p-4 animate-pulse bg-[#0d1b2a]">
        Select a chat to view messages
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 relative bg-[#0d1b2a]">
      <button
        className="absolute top-2 right-2 z-10 text-blue-400 hover:text-blue-600"
        onClick={() => setCollapsed((prev) => !prev)}
        title={collapsed ? "Expand chat" : "Collapse chat"}
      >
        {collapsed ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="chat-body"
            className="flex-1 p-4 overflow-y-auto space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loading && (
              <p className="text-white animate-pulse">Loading messages...</p>
            )}
            {!loading && data?.messages.length === 0 && (
              <p className="text-blue-200 text-center animate-pulse">
                Start a conversation...
              </p>
            )}
            {data?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <FaRobot className="text-blue-300 mt-1" />
                )}
                <div
                  className={`p-3 rounded-lg max-w-md ${
                    msg.role === "user"
                      ? "bg-blue-700 text-white"
                      : "bg-[#1b263b] text-blue-200"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <FaUser className="text-blue-400 mt-1" />
                )}
              </div>
            ))}

            {/* 👇 Auto-scroll target */}
            <div ref={scrollRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWindow;
