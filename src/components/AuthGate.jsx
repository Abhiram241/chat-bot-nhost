import React, { useEffect, useState } from "react";
import {
  useSignInEmailPassword,
  useSignUpEmailPassword,
  useUserData,
  useAuthenticationStatus,
  useSignOut,
} from "@nhost/react";
import { gql, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaBars, FaTimes } from "react-icons/fa";

import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

const CREATE_CHAT = gql`
  mutation {
    insert_chats_one(object: { title: "New Chat" }) {
      id
    }
  }
`;

const AuthGate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const user = useUserData();
  const { signInEmailPassword } = useSignInEmailPassword();
  const { signUpEmailPassword } = useSignUpEmailPassword();
  const { signOut } = useSignOut();

  const [createChat] = useMutation(CREATE_CHAT);

  const handleAuth = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please fill in both email and password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setSubmitting(true);
      const fn = isSignUp ? signUpEmailPassword : signInEmailPassword;
      const result = await fn(trimmedEmail, trimmedPassword);

      if (result?.error) {
        toast.error(result.error.message || "Authentication failed");
      } else {
        toast.success(`${isSignUp ? "Sign-up" : "Login"} successful`);
      }
    } catch (err) {
      toast.error("Unexpected error: " + (err.message || "Unknown"));
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-create new chat on first login
  useEffect(() => {
    const createDefaultChat = async () => {
      if (isAuthenticated && !selectedChatId) {
        try {
          const { data } = await createChat();
          setSelectedChatId(data.insert_chats_one.id);
          toast.success("New chat created! Start chatting below.");
        } catch (error) {
          console.error("Error creating default chat:", error);
          toast.error("Failed to create chat. Please try again.");
        }
      }
    };
    createDefaultChat();
  }, [isAuthenticated, selectedChatId, createChat]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1b2a] text-white">
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-[#0d1b2a] text-white px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Toaster />
        <h2 className="text-3xl font-bold mb-6">
          {isSignUp ? "Create an Account" : "Login to Chat"}
        </h2>
        <form
          onSubmit={handleAuth}
          className="flex flex-col w-full max-w-xs space-y-4"
        >
          <input
            className="p-3 rounded bg-[#1b263b] text-white placeholder:text-blue-200 outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <div className="relative">
            <input
              className="p-3 w-full rounded bg-[#1b263b] text-white placeholder:text-blue-200 outline-none pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 transition rounded px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? isSignUp
                ? "Signing up..."
                : "Signing in..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
          <p
            className="text-sm text-blue-300 cursor-pointer text-center"
            onClick={() => setIsSignUp((v) => !v)}
          >
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </p>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0d1b2a] font-sans text-white">
      <Toaster />

      {/* Collapsible Sidebar */}
      {sidebarVisible && (
        <ChatList
          selectedChatId={selectedChatId}
          onSelect={setSelectedChatId}
        />
      )}
      <button
        onClick={() => setSidebarVisible((v) => !v)}
        className="absolute top-2 left-2 z-50 text-blue-400 hover:text-white"
        title="Toggle Sidebar"
      >
        {sidebarVisible ? <FaTimes /> : <FaBars />}
      </button>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center px-4 py-2 bg-[#132736] border-b border-[#1b263b]">
          <h2 className="text-lg font-semibold">
            Chat:{" "}
            {selectedChatId ? selectedChatId.slice(0, 8) : "None selected"}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-blue-300">{user?.email}</span>
            <button
              onClick={signOut}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          {selectedChatId ? (
            <>
              <ChatWindow chatId={selectedChatId} />
              <MessageInput chatId={selectedChatId} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl px-4"
              >
                <MessageInput chatId={null} isDisabled />
                <p className="text-blue-200 mt-4 text-center animate-pulse">
                  Setting things up...
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
