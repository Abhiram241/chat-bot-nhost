import React, { useState, useEffect } from "react";
import {
  useSignInEmailPassword,
  useSignUpEmailPassword,
  useAuthenticationStatus,
} from "@nhost/react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import ChatPage from "./ChatPage";
import TextType from "./TextType";
import { tokenManager } from "../utils/tokenManager";

const AuthGate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const { signInEmailPassword } = useSignInEmailPassword();

  // Add a small delay to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Debug authentication state changes
  useEffect(() => {
    console.log("🔐 AuthGate - Auth state:", { isLoading, isAuthenticated });
    tokenManager.logTokenStatus();

    // If user becomes unauthenticated unexpectedly, show a message
    if (!isLoading && !isAuthenticated && tokenManager.hasValidTokens()) {
      console.warn(
        "⚠️ User appears logged out but tokens exist - possible token refresh issue"
      );
      toast.error("Session expired. Please log in again.");
      tokenManager.clearTokens();
    }
  }, [isLoading, isAuthenticated]);
  const { signUpEmailPassword } = useSignUpEmailPassword();

  // Clear fields when switching between login and signup
  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setVerificationSent(false);
  }, [isSignUp]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (isSignUp) {
      if (trimmedPassword !== trimmedConfirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      if (trimmedPassword.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
    }

    try {
      setSubmitting(true);
      const fn = isSignUp ? signUpEmailPassword : signInEmailPassword;
      const result = await fn(trimmedEmail, trimmedPassword);

      if (result?.error) {
        toast.error(result.error.message || "Authentication failed");
      } else {
        if (isSignUp) {
          setVerificationSent(true);
          toast.success("Account created! Please verify your email before signing in.");
        } else {
          toast.success("Login successful");
        }
      }
    } catch (err) {
      toast.error("Unexpected error: " + (err.message || "Unknown"));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !showContent) {
    return (
      <motion.div
        className="flex items-center justify-center h-full gradient-bg-primary text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="animate-pulse font-mono text-lg gradient-text-purple">
          Loading authentication...
        </div>
      </motion.div>
    );
  }

  // If authenticated, render the main ChatPage component with smooth transition
  if (isAuthenticated) {
    return (
      <motion.div
        key="chat-page"
        className="h-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <ChatPage />
      </motion.div>
    );
  }

  // Otherwise, show the Login/Sign Up form
  return (
    <motion.div
      key="auth-form"
      className="flex flex-col items-center justify-center min-h-full gradient-bg-primary text-white px-4 py-8 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Toaster position="top-center" />

      {/* Hero Section with Typing Effect */}
      <motion.div
        className="text-center mb-8 sm:mb-12 max-w-4xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold gradient-text-purple mb-4 sm:mb-6">
          Synapse AI
        </h1>
        <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-mono text-purple-300 min-h-[2rem] sm:min-h-[3rem] flex items-center justify-center px-2">
          <TextType
            text={[
              "Welcome to the future of AI conversation",
              "Your intelligent companion awaits",
              "Experience seamless AI interaction",
            ]}
            typingSpeed={75}
            pauseDuration={2000}
            showCursor={true}
            cursorCharacter="|"
            className=""
            textColors={["#a855f7", "#3b82f6", "#10b981", "#f59e0b"]}
          />
        </div>
      </motion.div>

      {/* Auth Card */}
      <motion.div
        className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-2xl glow-purple"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-mono font-bold gradient-text-purple mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-400 font-mono text-xs sm:text-sm">
            {isSignUp ? "Join the AI conversation" : "Continue your AI journey"}
          </p>
        </div>

        {verificationSent ? (
          <div className="text-center p-4 space-y-4">
            <div className="flex justify-center">
              <FaEnvelope className="text-purple-400 text-4xl animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-purple-300">Verification Email Sent</h3>
            <p className="text-gray-300 text-sm">Please check your email and verify your account before signing in. <span className="text-yellow-300">The verification email may be in your spam folder.</span></p>
            <div className="flex gap-2 mt-4">
              <motion.button
                className="flex-1 btn-gradient text-white font-mono font-semibold py-2 xs:py-2.5 sm:py-3 md:py-4 text-xs xs:text-sm sm:text-base rounded-lg shadow-lg"
                onClick={() => setIsSignUp(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Sign In
              </motion.button>
              <motion.a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-mono font-semibold py-2 xs:py-2.5 sm:py-3 md:py-4 text-xs xs:text-sm sm:text-base rounded-lg shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Open Gmail
              </motion.a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-3 xs:space-y-4 sm:space-y-6">
             <div>
               <input
                 className="w-full p-2 xs:p-2.5 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base rounded-lg bg-slate-700/50 border border-purple-500/30 text-white placeholder:text-purple-300/60 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 font-mono"
                 type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 autoComplete="email"
                 required
               />
             </div>

             <div className="relative">
               <input
                 className="w-full p-2 xs:p-2.5 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base rounded-lg bg-slate-700/50 border border-purple-500/30 text-white placeholder:text-purple-300/60 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 font-mono pr-10 xs:pr-11 sm:pr-12"
                 type={showPassword ? "text" : "password"}
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 autoComplete={isSignUp ? "new-password" : "current-password"}
                 required
               />
               <motion.button
                 type="button"
                 onClick={() => setShowPassword((v) => !v)}
                 className="absolute right-2 xs:right-2.5 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
               >
                 {showPassword ? <FaEyeSlash className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" /> : <FaEye className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />}
               </motion.button>
             </div>

             {isSignUp && (
               <div className="relative">
                 <input
                   className="w-full p-2 xs:p-2.5 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base rounded-lg bg-slate-700/50 border border-purple-500/30 text-white placeholder:text-purple-300/60 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 font-mono pr-10 xs:pr-11 sm:pr-12"
                   type={showConfirmPassword ? "text" : "password"}
                   placeholder="Confirm Password"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   autoComplete="new-password"
                   required
                 />
                 <motion.button
                   type="button"
                   onClick={() => setShowConfirmPassword((v) => !v)}
                   className="absolute right-2 xs:right-2.5 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                 >
                   {showConfirmPassword ? <FaEyeSlash className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" /> : <FaEye className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />}
                 </motion.button>
               </div>
             )}

             <motion.button
            className="w-full btn-gradient text-white font-mono font-semibold py-2 xs:py-2.5 sm:py-3 md:py-4 text-xs xs:text-sm sm:text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting
              ? isSignUp
                ? "Creating Account..."
                : "Signing In..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </motion.button>
            <div className="mt-4 sm:mt-6 text-center">
          <motion.p
            className="text-xs sm:text-sm text-purple-300 cursor-pointer font-mono hover:text-purple-200 transition-colors"
            onClick={() => setIsSignUp((v) => !v)}
            whileHover={{ scale: 1.05 }}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </motion.p>
        </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AuthGate;
