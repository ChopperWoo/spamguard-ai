export const msalConfig = {
  auth: {
    clientId: "fa4735b2-0249-41a1-a288-bc7c731a24cc",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: process.env.NODE_ENV === 'production' 
      ? "https://spamguard-ai.netlify.app" 
      : "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};