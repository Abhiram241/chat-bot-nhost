import React from "react";
import ReactDOM from "react-dom/client";
import { NhostProvider } from "@nhost/react";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { nhost } from "./nhost";
import App from "./App";
import "./App.css";

// Debug token persistence on app start
console.log("🚀 App starting - checking stored tokens...");
const storedAccessToken = localStorage.getItem("nhost-accessToken");
const storedRefreshToken = localStorage.getItem("nhost-refreshToken");
console.log("Stored access token:", storedAccessToken ? "Found" : "Not found");
console.log(
  "Stored refresh token:",
  storedRefreshToken ? "Found" : "Not found"
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <App />
      </NhostApolloProvider>
    </NhostProvider>
  </React.StrictMode>
);
