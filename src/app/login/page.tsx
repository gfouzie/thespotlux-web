"use client";

import LoginPage from "@/components/login";
import { PublicRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function Login() {
  return (
    <ThemeProvider defaultTheme="dark">
      <PublicRoute redirectTo="/">
        <LoginPage />
      </PublicRoute>
    </ThemeProvider>
  );
}
