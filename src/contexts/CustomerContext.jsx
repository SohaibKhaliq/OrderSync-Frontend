import React, { createContext, useContext, useState, useEffect } from "react";

const CustomerContext = createContext(null);
const CAFE_SESSION_KEY = "cafe_user_session";

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const data = localStorage.getItem(CAFE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  function login(account) {
    localStorage.setItem(CAFE_SESSION_KEY, JSON.stringify(account));
    setCustomer(account);
  }

  function logout() {
    localStorage.removeItem(CAFE_SESSION_KEY);
    setCustomer(null);
  }

  function refreshSession() {
    try {
      const data = localStorage.getItem(CAFE_SESSION_KEY);
      setCustomer(data ? JSON.parse(data) : null);
    } catch {
      setCustomer(null);
    }
  }

  // Sync across tabs and listen for local updates
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "cafe_session") {
        refreshSession();
      }
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("cafe_session", refreshSession);
    
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cafe_session", refreshSession);
    };
  }, []);

  return (
    <CustomerContext.Provider
      value={{ customer, login, logout, refreshSession }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}
