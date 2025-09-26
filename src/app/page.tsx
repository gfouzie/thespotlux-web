"use client";

import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";
import LandingPage from "@/components/landing";
import Dashboard from "@/components/dashboard";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function Home() {
  return (
    <>
      <PublicRoute>
        <ThemeProvider defaultTheme="dark">
          <LandingPage />
        </ThemeProvider>
      </PublicRoute>
      <ProtectedRoute redirectTo="/login">
        <Dashboard />
      </ProtectedRoute>
    </>
  );
}
