import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaPlus, FaComments } from "react-icons/fa";
import { GET_CHATS, CREATE_CHAT } from "../graphql";

const ChatList = ({ selectedChatId, onSelect }) => {
  const { data, loading, error, refetch } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT);

  const handleNewChat = async () => {
    const { data } = await createChat();
    toast.success("New chat created");
    refetch();
    onSelect(data.insert_chats_one.id);
  };

  if (loading) return <p className="text-white">Loading chats...</p>;
  if (error) return <p className="text-red-400">Error loading chats.</p>;

  return (
    <motion.div
      className="w-full sm:w-1/3 bg-[#1b263b] text-white p-4 space-y-2 overflow-y-auto"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaComments /> My Chats
        </h2>
        <button onClick={handleNewChat} title="New Chat">
          <FaPlus className="text-blue-400 hover:text-blue-600" />
        </button>
      </div>
      {data.chats.map((chat) => (
        <div
          key={chat.id}
          className={`p-2 rounded cursor-pointer ${
            chat.id === selectedChatId
              ? "bg-blue-600"
              : "hover:bg-blue-800 transition"
          }`}
          onClick={() => onSelect(chat.id)}
        >
          {chat.title}
        </div>
      ))}
    </motion.div>
  );
};

export default ChatList;
