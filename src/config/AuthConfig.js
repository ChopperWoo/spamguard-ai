// src/config/authConfig.js
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || "your-client-id-here",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_REDIRECT_URI || window.location.origin
      : "http://localhost:3000",
    postLogoutRedirectUri: process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_REDIRECT_URI || window.location.origin
      : "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
  scopes: ["User.Read", "Mail.Read", "Mail.ReadWrite"],
  prompt: "select_account"
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
};