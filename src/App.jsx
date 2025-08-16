import React from "react";
import { useAuthenticationStatus } from "@nhost/react";
import { AnimatePresence } from "framer-motion";
import { Grid } from "ldrs/react";
import AuthGate from "./components/AuthGate";
import Header from "./components/Header";
import "./index.css";

const App = () => {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen gradient-bg-primary text-white">
        <div className="flex flex-col items-center gap-4">
          <Grid size="60" speed="1.5" color="white" />
          <span className="gradient-text-purple font-mono text-lg">
            Loading authentication...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen gradient-bg-primary flex flex-col overflow-hidden">
      {isAuthenticated && <Header />}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <AuthGate key="auth-gate" />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
