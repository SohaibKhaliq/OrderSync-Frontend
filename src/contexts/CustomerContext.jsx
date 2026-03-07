import React, { createContext, useContext, useState, useEffect } from "react";
import { CustomerAccounts } from "../localdb/LocalDB";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(() => CustomerAccounts.getSession());

  function login(account) {
    setCustomer(account);
  }

  function logout() {
    CustomerAccounts.logout();
    setCustomer(null);
  }

  function refreshSession() {
    setCustomer(CustomerAccounts.getSession());
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
