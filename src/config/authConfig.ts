export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || "",
    authority: process.env.REACT_APP_AUTHORITY || "",
    redirectUri: "/",
    postLogoutRedirectUri: "/"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
 scopes: ["User.Read"]
};