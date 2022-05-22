import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "store";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/authConfig";

import { ConfigProvider } from "antd";
import en from "antd/lib/locale/en_US";
import vi from "antd/lib/locale/vi_VN";
import "./i18n";

const msalInstance = new PublicClientApplication(msalConfig);

const language = localStorage.getItem("i18nextLng");

if (!language || language === "en-US") {
  localStorage.setItem("i18nextLng", "en");
}

const locale = localStorage.getItem("i18nextLng") === "en" ? en : vi;

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>
      <ConfigProvider locale={locale}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </MsalProvider>
  </BrowserRouter>
);
