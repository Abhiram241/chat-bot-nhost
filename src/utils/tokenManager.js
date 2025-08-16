// Token management utilities
export const tokenManager = {
  // Check if tokens exist and are valid
  hasValidTokens: () => {
    const accessToken = localStorage.getItem("nhost-accessToken");
    const refreshToken = localStorage.getItem("nhost-refreshToken");
    return !!(accessToken && refreshToken);
  },

  // Clear all stored tokens
  clearTokens: () => {
    localStorage.removeItem("nhost-accessToken");
    localStorage.removeItem("nhost-refreshToken");
    localStorage.removeItem("nhost-user");
    console.log("🧹 Cleared all stored tokens");
  },

  // Log token status for debugging
  logTokenStatus: () => {
    const accessToken = localStorage.getItem("nhost-accessToken");
    const refreshToken = localStorage.getItem("nhost-refreshToken");
    console.log("📊 Token Status:", {
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : "None",
      refreshToken: refreshToken
        ? `${refreshToken.substring(0, 20)}...`
        : "None",
      hasTokens: !!(accessToken && refreshToken),
    });
  },
};
