// src/nhost.js
import { NhostClient } from "@nhost/nhost-js";

export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
  autoRefreshToken: true,
  autoSignIn: true,
  refreshIntervalTime: 5 * 60 * 1000, // Optional, Nhost handles this well by default
});

// Optional: useful logging for debugging
nhost.auth.onTokenChanged((session) => {
  if (session) {
    console.log("✅ Token refreshed successfully");
  } else {
    console.log("❌ Token refresh failed or user logged out");
  }
});

nhost.auth.onAuthStateChanged((event, session) => {
  console.log(
    "🔐 Auth state changed:",
    event,
    session ? "authenticated" : "not authenticated"
  );
});

window.nhost = nhost;
