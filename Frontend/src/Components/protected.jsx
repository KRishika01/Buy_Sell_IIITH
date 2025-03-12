import React from "react";
import { Navigate } from "react-router-dom";

export const Protection_by_token = ({ children }) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN IN PROC: ",token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protection_by_token;