// src/nhost.js
import { NhostClient } from "@nhost/nhost-js";

console.log("Nhost Environment Variables:", {
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
});

export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
});

console.log("Nhost client created:", nhost);
console.log("Nhost auth URL:", nhost.auth.url);

// ✨ For browser testing in console:
window.nhost = nhost;
