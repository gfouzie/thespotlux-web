"use client";

import LoginPage from "@/components/login";
import { PublicRoute } from "@/components/auth/ProtectedRoute";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

export default function Login() {
  const { setTheme } = useTheme();

  // Set dark theme for login page
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <PublicRoute redirectTo="/">
      <LoginPage />
    </PublicRoute>
  );
}
