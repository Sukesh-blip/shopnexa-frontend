import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import CustomerHomePage from "./CustomerHomePage";
import CartPage from "./CartPage";
import OrderPage from "./OrderPage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import LandingPage from "./LandingPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/admin" element={<AdminLogin />} />

      {/* Customer Routes (Protected) */}
      <Route
        path="/customerhome"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/UserCartPage"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <OrderPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes (Protected) */}
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;
