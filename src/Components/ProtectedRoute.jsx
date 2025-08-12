// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const jwt = localStorage.getItem("jwt");
  const userDetails = localStorage.getItem("userDetails");

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userDetails) {
    const parsedUser = JSON.parse(userDetails);
    const userRole = parsedUser.Type; // adjust if your API returns role differently
 const hasSubOrganizerRole = parsedUser.SubOrganizerRole && parsedUser.SubOrganizerRole.length > 0;

    // Check if the user's main role is allowed OR if they have a SubOrganizerRole
    if (!allowedRoles.includes(userRole) && !hasSubOrganizerRole) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
