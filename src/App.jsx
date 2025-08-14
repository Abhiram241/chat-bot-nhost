import React from "react";
import { useAuthenticationStatus } from "@nhost/react";
import AuthGate from "./components/AuthGate";
import "./index.css";

const App = () => {
  const { isLoading } = useAuthenticationStatus();

  if (isLoading) return <p>Loading authentication...</p>;

  return (
    <div>
      <AuthGate />
    </div>
  );
};

export default App;
