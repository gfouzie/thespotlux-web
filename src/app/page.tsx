"use client";

import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";
import LandingPage from "@/components/landing";
import Dashboard from "@/components/dashboard";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { setTheme } = useTheme();
  const { state } = useAuth();

  // Set theme based on auth status
  useEffect(() => {
    if (!state.loading) {
      setTheme(state.isAuthenticated ? "light" : "dark");
    }
  }, [state.isAuthenticated, state.loading, setTheme]);

  return (
    <>
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
      <ProtectedRoute redirectTo="/login">
        <Dashboard />
      </ProtectedRoute>
    </>
  );
}
