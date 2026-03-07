import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCustomer } from "../contexts/CustomerContext";

export default function CustomerRoute({ children }) {
  const { customer } = useCustomer();
  const location = useLocation();

  if (!customer) {
    return <Navigate to="/cafe/login" state={{ from: location }} replace />;
  }

  return children;
}
