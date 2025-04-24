// src/main.jsx

window.global = window;

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";
import "./index.css";
import { StompProvider } from "./contexts/StompContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <StompProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StompProvider>
    </Provider>
  </React.StrictMode>
);
