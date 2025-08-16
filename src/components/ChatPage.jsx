// ... (imports remain the same)
import React, { useState, useEffect } from "react";
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
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isNewSession, setIsNewSession] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const { data: chatsData, loading: chatsLoading, refetch: refetchChats } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT);
  const { data: messagesData, loading: messagesLoading } = useSubscription(
    MESSAGE_SUB,
    { variables: { chatId: selectedChatId }, skip: !selectedChatId }
  );

  const handleNewChat = async (firstMessage = null) => {
    try {
      const { data } = await createChat({ variables: { title: "New Chat" } });
      const newChatId = data.insert_chats_one.id;
      await refetchChats();
      setSelectedChatId(newChatId);
      setIsNewSession(false);
      if (!firstMessage) toast.success("New chat created");
      return newChatId;
    } catch (error) {
      toast.error("Failed to create new chat.");
      return null;
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    setIsNewSession(false);
    setSidebarVisible(false);
  };

  const handleChatDeleted = () => {
    setSelectedChatId(null);
    setIsNewSession(true);
  };

  useEffect(() => {
    setIsNewSession(true); // Always start fresh on page load
  }, []);

  const hasMessages = messagesData?.messages?.length > 0;

  return (
    <div className="flex h-full w-full gradient-bg-primary font-mono text-white relative">
      <Toaster position="top-center" />

      <AnimatePresence>
        {sidebarVisible && (
          <motion.div
            className="absolute top-0 left-0 h-full z-30 w-4/5 max-w-sm" // Simplified width
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <ChatList chats={chatsData?.chats || []} loading={chatsLoading} selectedChatId={selectedChatId} onSelect={handleChatSelect} onNewChat={handleNewChat} onClose={() => setSidebarVisible(false)} onChatDeleted={handleChatDeleted}/>
          </motion.div>
        )}
      </AnimatePresence>

      {sidebarVisible && <motion.div className="absolute inset-0 bg-black/50 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarVisible(false)} />}

      <div className="flex flex-col flex-1 relative z-10">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-40">
          <motion.button onClick={() => setSidebarVisible(true)} className="p-3 bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl" title="Toggle Chat History" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaBars className="w-5 h-5 text-purple-400" />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {isNewSession || (!selectedChatId && !chatsLoading) ? (
            <motion.div key="new-session" className="flex-1 flex flex-col items-center justify-center p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="w-full max-w-4xl text-center">
                <motion.h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text-purple mb-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Welcome to Synapse</motion.h1>
                <motion.div className="text-base sm:text-lg text-purple-300 min-h-[2rem] px-2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <TextType text={["Your AI conversation starts here.", "Ask me anything."]} typingSpeed={60} pauseDuration={2500} />
                </motion.div>
                <div className="mt-10">
                  <MessageInput onNewChat={handleNewChat} isNewSession setIsAiTyping={setIsAiTyping} />
                </div>
              </div>
            </motion.div>
          ) : messagesLoading ? (
            <motion.div key="loading" className="flex-1 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Grid size="40" color="#a855f7" />
            </motion.div>
          ) : hasMessages ? (
            <motion.div key="chat-with-messages" className="flex flex-col flex-1 pt-20 min-h-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MessageList messages={messagesData.messages} isAiTyping={isAiTyping} />
              <MessageInput chatId={selectedChatId} setIsAiTyping={setIsAiTyping} />
            </motion.div>
          ) : (
            <motion.div key="empty-chat" className="flex-1 flex flex-col items-center justify-center pt-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="w-full max-w-2xl px-4 text-center">
                <p className="text-purple-300 mb-6 text-base md:text-lg">This chat is empty. Send the first message!</p>
                <MessageInput chatId={selectedChatId} setIsAiTyping={setIsAiTyping} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage;