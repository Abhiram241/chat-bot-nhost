import React, { useState, useEffect } from "react";
import { useUserData, useSignOut } from "@nhost/react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaBars } from "react-icons/fa";
import { Grid } from "ldrs/react";
import { GET_CHATS, CREATE_CHAT, MESSAGE_SUB } from "../graphql";
import TextType from "./TextType";

import ChatList from "./ChatList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false); // Sidebar is hidden by default
  const [isNewSession, setIsNewSession] = useState(true); // Track if this is a new session
  const [isAiTyping, setIsAiTyping] = useState(false); // Track if AI is typing

  const user = useUserData();
  const { signOut } = useSignOut();

  const {
    data: chatsData,
    loading: chatsLoading,
    refetch: refetchChats,
  } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT);
  const { data: messagesData, loading: messagesLoading } = useSubscription(
    MESSAGE_SUB,
    {
      variables: { chatId: selectedChatId },
      skip: !selectedChatId,
    }
  );

  const handleNewChat = async (firstMessage = null) => {
    try {
      const { data } = await createChat({
        variables: { title: "New Chat" },
      });
      const newChatId = data.insert_chats_one.id;
      await refetchChats();
      setSelectedChatId(newChatId);
      setIsNewSession(false);

      if (firstMessage) {
        // The MessageInput component will handle sending the first message
        return newChatId;
      }

      toast.success("New chat created");
      return newChatId;
    } catch (error) {
      toast.error("Failed to create new chat.");
      console.error("Error creating new chat:", error);
      return null;
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    setIsNewSession(false);
    setSidebarVisible(false); // Close sidebar when selecting a chat
  };

  const handleChatDeleted = () => {
    setSelectedChatId(null);
    setIsNewSession(true);
  };

  // Don't auto-select or create chats on load - let user start fresh
  useEffect(() => {
    // Keep the session as new when component mounts
    setIsNewSession(true);
  }, []);

  const hasMessages = messagesData?.messages?.length > 0;

  return (
    <div className="flex h-full w-full gradient-bg-primary font-mono text-white relative">
      <Toaster />

      {/* Sidebar - Hidden by default, slides in from left */}
      <AnimatePresence>
        {sidebarVisible && (
          <motion.div
            className="absolute top-0 left-0 h-full z-30 w-[85%] xs:w-4/5 sm:w-1/2 md:w-2/5 lg:w-1/3 max-w-sm sm:max-w-md"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <ChatList
              chats={chatsData?.chats || []}
              loading={chatsLoading}
              selectedChatId={selectedChatId}
              onSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onClose={() => setSidebarVisible(false)}
              onChatDeleted={handleChatDeleted}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when sidebar is open */}
      {sidebarVisible && (
        <motion.div
          className="absolute inset-0 bg-black/50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 relative z-10">
        {/* Toggle Button - Always visible */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-40">
          <motion.button
            onClick={() => setSidebarVisible((v) => !v)}
            className="p-2 sm:p-3 bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 rounded-lg sm:rounded-xl text-purple-400 hover:text-purple-300 hover:bg-slate-700/80 transition-all duration-200 shadow-lg"
            title="Toggle Chat History"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBars className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>

        {/* Main Chat Interface */}
        <AnimatePresence mode="wait">
          {isNewSession || (!selectedChatId && !chatsLoading) ? (
            // New Session View: Input in center
            <motion.div
              key="new-session"
              className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 min-h-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-full max-w-4xl">
                <motion.div
                  className="text-center mb-8 sm:mb-10 md:mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-bold gradient-text-purple mb-3 sm:mb-4">
                    Welcome to Synapse
                  </h1>
                  <div className="text-sm sm:text-base md:text-lg lg:text-xl text-purple-300 font-mono min-h-[1.5rem] sm:min-h-[2rem] px-2">
                    <TextType
                      text={[
                        "Your AI conversation starts here. Ask anything.",
                        "Ready to explore the possibilities?",
                        "Let's create something amazing together.",
                        "What would you like to know today?",
                      ]}
                      typingSpeed={60}
                      pauseDuration={2500}
                      showCursor={true}
                      cursorCharacter="|"
                      textColors={["#a855f7", "#3b82f6", "#10b981", "#f59e0b"]}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <MessageInput
                    chatId={null}
                    onNewChat={handleNewChat}
                    isNewSession={true}
                    placeholder="Start a conversation "
                    setIsAiTyping={setIsAiTyping}
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : selectedChatId && !messagesLoading ? (
            hasMessages ? (
              // Chat with Messages View
              <motion.div
                key="chat-with-messages"
                className="flex flex-col flex-1 pt-16 sm:pt-20 min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageList messages={messagesData.messages} isAiTyping={isAiTyping} />
                <MessageInput chatId={selectedChatId} setIsAiTyping={setIsAiTyping} />
              </motion.div>
            ) : (
              // Empty Chat View
              <motion.div
                key="empty-chat"
                className="flex-1 flex flex-col items-center justify-center pt-16 sm:pt-20 min-h-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full max-w-2xl px-4">
                  <p className="text-purple-300 mb-4 sm:mb-6 text-center font-mono text-sm sm:text-base md:text-lg">
                    This chat is empty. Send the first message!
                  </p>
                  <MessageInput chatId={selectedChatId} />
                </div>
              </motion.div>
            )
          ) : (
            // Loading View
            <motion.div
              key="loading"
              className="flex-1 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col items-center gap-4">
                <Grid size="40" speed="1.5" color="#a855f7" />
                <p className="text-purple-300 font-mono text-sm sm:text-base md:text-lg">
                  Loading chat...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage;
