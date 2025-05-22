import React, { createContext, useContext } from "react";
import { useCallHandler } from "../utils/useCallHandler";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const currentUserId = localStorage.getItem("userId");
  const call = useCallHandler(currentUserId);

  return (
    <CallContext.Provider value={call}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};
