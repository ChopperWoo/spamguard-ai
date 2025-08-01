export const msalConfig = {
  auth: {
    clientId: "your-client-id-from-azure",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: process.env.NODE_ENV === 'production' 
      ? "https://your-app-name.netlify.app" 
      : "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};